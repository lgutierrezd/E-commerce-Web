<template>
  <div>
    <h1>Shopping Cart</h1>
    <div v-if="cartItems.length === 0">
      <p>No hay elementos en el carrito.</p>
    </div>
    <div v-else>
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
            <td>{{ item.price }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.quantity * item.price }}</td>
          </tr>
        </tbody>
      </table>
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

export default {
  name: "ShoppingCartPage",
  data() {
    return {
      cartItems: {},
    };
  },
  methods: {
    removeItem(index) {
      const product = this.cartItems.splice(index, 1)[0];
      useCartStore().removeFromCart(product);
    },
  },
  computed: {
    cart() {
      return useCartStore();
    },
  },
  created() {
    this.cartItems = useCartStore().getCartItems();
  },
  //   computed: {
  //     cartItems() {
  //       return useCartStore().getCartItems();
  //     },
  //   },
};
</script>
