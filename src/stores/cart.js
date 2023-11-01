import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    products: [],
  }),
  actions: {
    clearCart() {
      this.products = []; // Vacía el carrito en la tienda
      this.saveCartToLocalStorage(); // Actualiza el localStorage
    },
    addToCart(product) {
      const existingProduct = this.products.find((el) => el.id === product.id);

      if (existingProduct) {
        // Si el producto ya existe en el carrito, aumenta la cantidad en 1
        existingProduct.quantity++;
      } else {
        // Si el producto no existe en el carrito, agrégalo con cantidad 1
        product.quantity = 1;
        this.products.push(product);
      }
      // this.products.forEach((el) => {
      //   console.log(
      //     `Name: ${el.name}, id: ${el.id}, quantity: ${el.images[0]}`
      //   );
      // });
      this.saveCartToLocalStorage(); // Guarda el carrito en el almacenamiento local
    },
    removeFromCart(product) {
      const index = this.products.indexOf(product);
      if (index !== -1) {
        this.products.splice(index, 1);
      }
      this.saveCartToLocalStorage(); // Guarda el carrito en el almacenamiento local
    },
    loadCartFromLocalStorage() {
      try {
        const cartData = localStorage.getItem("cart");
        if (cartData) {
          this.products = JSON.parse(cartData);
        }
      } catch (error) {
        console.error("Error al analizar los datos de localStorage:", error);
      }
    },
    saveCartToLocalStorage() {
      localStorage.setItem("cart", JSON.stringify(this.products));
    },
    getCartItems() {
      return this.products;
    },
  },
  onBeforeMount() {
    // Cargar el carrito desde el almacenamiento local al inicio de la aplicación
    this.loadCartFromLocalStorage();
  },
});
