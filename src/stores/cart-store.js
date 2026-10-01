const CART_STORAGE_KEY = 'your-product-cart-v1'

export function registerCartStore(
  Alpine,
  products,
  options = {},
) {
  const allowedPricingTypes = [
    'starter',
    'builder',
    'leader',
    'prestige',
  ]

  const pricingType = allowedPricingTypes.includes(
    options.pricingType,
  )
    ? options.pricingType
    : 'regular'

  const tierPrices = {
    starter: 245,
    builder: 227,
    leader: 210,
    prestige: 175,
  }

  Alpine.store('cart', {
    items: [],
    pricingType,

    init() {
      this.load()
    },

    load() {
      try {
        const savedCart = localStorage.getItem(
          CART_STORAGE_KEY,
        )

        if (!savedCart) {
          this.items = []
          return
        }

        const parsedItems = JSON.parse(savedCart)

        if (!Array.isArray(parsedItems)) {
          this.items = []
          return
        }

        this.items = parsedItems
          .map((item) => {
            const product = products.find(
              (productItem) =>
                productItem.id === item.productId,
            )

            if (
              !product ||
              !product.isActive ||
              product.stockQuantity <= 0 ||
              !Number.isInteger(item.quantity) ||
              item.quantity <= 0
            ) {
              return null
            }

            return {
              productId: item.productId,
              quantity: Math.min(
                item.quantity,
                product.stockQuantity,
              ),
            }
          })
          .filter(Boolean)
      } catch (error) {
        console.error(
          'Unable to load cart:',
          error,
        )

        this.items = []
      }
    },

    save() {
      try {
        localStorage.setItem(
          CART_STORAGE_KEY,
          JSON.stringify(this.items),
        )
      } catch (error) {
        console.error(
          'Unable to save cart:',
          error,
        )
      }
    },

    add(productId) {
      const product = products.find(
        (productItem) =>
          productItem.id === productId,
      )

      if (
        !product ||
        !product.isActive ||
        product.stockQuantity <= 0
      ) {
        return
      }

      const existingItem = this.items.find(
        (item) =>
          item.productId === productId,
      )

      if (existingItem) {
        this.items = this.items.map((item) => {
          if (item.productId !== productId) {
            return item
          }

          return {
            ...item,
            quantity: Math.min(
              item.quantity + 1,
              product.stockQuantity,
            ),
          }
        })
      } else {
        this.items = [
          ...this.items,
          {
            productId,
            quantity: 1,
          },
        ]
      }

      this.save()
    },

    increase(productId) {
      this.add(productId)
    },

    decrease(productId) {
      const existingItem = this.items.find(
        (item) =>
          item.productId === productId,
      )

      if (!existingItem) {
        return
      }

      if (existingItem.quantity <= 1) {
        this.remove(productId)
        return
      }

      this.items = this.items.map((item) => {
        if (item.productId !== productId) {
          return item
        }

        return {
          ...item,
          quantity: item.quantity - 1,
        }
      })

      this.save()
    },

    remove(productId) {
      this.items = this.items.filter(
        (item) =>
          item.productId !== productId,
      )

      this.save()
    },

    clear() {
      this.items = []
      this.save()
    },

    quantityFor(productId) {
      const item = this.items.find(
        (cartItem) =>
          cartItem.productId === productId,
      )

      return item?.quantity ?? 0
    },

    unitPriceFor(product) {
      const regularPrice = Number(
        product?.regularPrice || 0,
      )

      if (this.pricingType in tierPrices) {
        return tierPrices[this.pricingType]
      }

      return regularPrice
    },

    get priceLabel() {
      return this.pricingType === 'regular'
        ? 'Regular price'
        : 'Reseller tier price'
    },

    get itemCount() {
      return this.items.reduce(
        (total, item) =>
          total + item.quantity,
        0,
      )
    },

    get detailedItems() {
      return this.items
        .map((item) => {
          const product = products.find(
            (productItem) =>
              productItem.id === item.productId,
          )

          if (!product) {
            return null
          }

          const unitPrice =
            this.unitPriceFor(product)

          return {
            ...item,
            product,
            pricingType: this.pricingType,
            unitPrice,
            lineTotal:
              unitPrice * item.quantity,
          }
        })
        .filter(Boolean)
    },

    get subtotal() {
      return this.detailedItems.reduce(
        (total, item) =>
          total + item.lineTotal,
        0,
      )
    },
  })
}