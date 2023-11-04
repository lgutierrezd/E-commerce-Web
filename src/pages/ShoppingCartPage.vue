<template>
  <div class="container mt-4">
    <h1 class="mb-4">Carrito</h1>
    <div v-if="cartItems.length === 0">
      <p>No hay elementos en el carrito.</p>
    </div>
    <div v-else class="d-flex">
      <div class="flex-grow-1">
        <table class="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in cartItems" :key="index">
              <td>
                <img
                  src="./../assets/trash.png"
                  alt="Eliminar"
                  class="delete-icon"
                  @click="removeItem(index)"
                />
                <img
                  class="custom-image"
                  :src="
                    item.images && item.images.length > 0
                      ? item.images[0]
                      : './../assets/cart1.png'
                  "
                  :alt="item.name"
                />
                {{ item.name }}
              </td>
              <td>{{ formattedNumber(item.price) }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ formattedNumber(item.quantity * item.price) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="ml-4">
        <h2>Total del carrito</h2>
        <p v-if="subtotal > 0">Subtotal: {{ formattedNumber(subtotal) }}</p>
        <p v-else>Subtotal: 0</p>
        <p>Total</p>
        <button class="btn btn-primary">Finalizar compra</button>
      </div>
    </div>
  </div>
</template>

<style>
.custom-image {
  width: 150px;
  height: 150px;
  object-fit: contain;
}
</style>

<script>
import { useCartStore } from "@/stores/cart";
import { formatNumber } from "@/utils/utils.js";

export default {
  name: "ShoppingCartPage",
  data() {
    return {
      cartItems: {},
      subtotal: 0,
      total: 0,
    };
  },
  methods: {
    removeItem(index) {
      const product = this.cartItems.splice(index, 1)[0];
      useCartStore().removeFromCart(product);
    },
    formattedNumber(value) {
      return formatNumber(Number(value));
    },
  },
  computed: {
    cart() {
      return useCartStore();
    },
  },
  created() {
    this.cartItems = useCartStore().getCartItems();
    this.subtotal = this.cartItems.reduce((total, element) => {
      return total + element.quantity * element.price;
    }, 0);
    if (typeof this.subtotal !== "number") {
      // En caso de que this.subtotal no sea un número válido, configúralo en 0 o cualquier otro valor predeterminado.
      this.subtotal = 0;
    }
  },
  //   computed: {
  //     cartItems() {
  //       return useCartStore().getCartItems();
  //     },
  //   },
};
</script>
