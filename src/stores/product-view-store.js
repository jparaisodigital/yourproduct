export function registerProductViewStore(
    Alpine,
    products,
  ) {
    Alpine.store('productView', {
      isOpen: false,
      selectedProductId: null,
      quantity: 1,
  
      get selectedProduct() {
        return (
          products.find(
            (product) =>
              product.id === this.selectedProductId,
          ) || null
        )
      },
  
      open(productId) {
        const product = products.find(
          (productItem) =>
            productItem.id === productId,
        )
  
        if (!product || !product.isActive) {
          return
        }
  
        this.selectedProductId = productId
        this.quantity = 1
        this.isOpen = true
      },
  
      close() {
        this.isOpen = false
        this.quantity = 1
      },
  
      increase() {
        const product = this.selectedProduct
  
        if (!product) {
          return
        }
  
        this.quantity = Math.min(
          this.quantity + 1,
          product.stockQuantity,
        )
      },
  
      decrease() {
        this.quantity = Math.max(
          this.quantity - 1,
          1,
        )
      },
  
      addToCart() {
        const product = this.selectedProduct
  
        if (
          !product ||
          product.stockQuantity <= 0
        ) {
          return
        }
  
        const cartStore = Alpine.store('cart')
  
        for (
          let count = 0;
          count < this.quantity;
          count += 1
        ) {
          cartStore.add(product.id)
        }
  
        this.quantity = 1
      },
    })
  }