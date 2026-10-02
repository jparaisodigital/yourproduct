export function registerProductViewStore(
  Alpine,
  products,
  pricingOptions = {},
) {
  let feedbackTimer = null

  Alpine.store('productView', {
    isOpen: false,
    selectedProductId: null,
    quantity: 1,
    addedQuantity: 0,
    pricingOptions,

    get selectedProduct() {
      return (
        products.find(
          (product) => product.id === this.selectedProductId,
        ) || null
      )
    },

    get tierLabel() {
      return this.pricingOptions.tierLabel || ''
    },

    get tierPrice() {
      return Number(this.pricingOptions.tierPrice || 0)
    },

    get hasTierPrice() {
      return this.tierPrice > 0
    },

    resetFeedback() {
      clearTimeout(feedbackTimer)
      feedbackTimer = null
      this.addedQuantity = 0
    },

    open(productId) {
      const product = products.find(
        (item) => item.id === productId,
      )

      if (!product || !product.isActive) {
        return
      }

      this.resetFeedback()
      this.selectedProductId = productId
      this.quantity = 1
      this.isOpen = true
    },

    close() {
      this.isOpen = false
      this.quantity = 1
      this.resetFeedback()
    },

    increase() {
      const product = this.selectedProduct

      if (!product || product.stockQuantity <= 0) {
        return
      }

      this.quantity = Math.min(
        this.quantity + 1,
        product.stockQuantity,
      )
    },

    decrease() {
      this.quantity = Math.max(this.quantity - 1, 1)
    },

    addToCart() {
      const product = this.selectedProduct

      if (!product || product.stockQuantity <= 0) {
        return
      }

      this.resetFeedback()

      const cart = Alpine.store('cart')
      const previousQuantity = cart.quantityFor(product.id)

      for (let count = 0; count < this.quantity; count += 1) {
        cart.add(product.id)
      }

      const actualAdded =
        cart.quantityFor(product.id) - previousQuantity

      if (actualAdded <= 0) {
        return
      }

      this.addedQuantity = actualAdded
      this.quantity = 1

      feedbackTimer = setTimeout(() => {
        this.addedQuantity = 0
        feedbackTimer = null
      }, 1800)
    },
  })
}
