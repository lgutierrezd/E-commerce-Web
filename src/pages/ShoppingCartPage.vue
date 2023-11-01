<template>
  <div>
    <h1>Shopping Cart</h1>
    <div v-if="cartItems.length === 0">
      <p>No hay elementos en el carrito.</p>
    </div>
    <div v-else>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in cartItems" :key="index">
            <img v-if="loading" src="" alt="Cargando..." />
            <img
              v-else
              class="custom-image"
              :src="
                item.images && item.images.length > 0
                  ? item.images[0]
                  : './../assets/cart1.png'
              "
              :alt="item.name"
            />
            <td>{{ item.name }}</td>
            <td>{{ item.price }}</td>
            <td>{{ item.quantity }}</td>
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
  computed: {
    cart() {
      return useCartStore();
    },
  },
  created() {
    this.cartItems = useCartStore().getCartItems();
    this.cartItems.forEach((element) => {
      console.log("element");
      console.log(element);
      // element.images.forEach((img) => {
      //   console.log(img);
      // });
    });
  },
  //   computed: {
  //     cartItems() {
  //       return useCartStore().getCartItems();
  //     },
  //   },
};
</script>
