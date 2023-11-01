<template>
  <div class="container">
    <h1>Productos</h1>
    <div class="row">
      <div v-for="product in products" :key="product._id" class="col-md-3">
        <router-link
          :to="{ name: 'ProductDetail', params: { id: product.slug } }"
          class="card-link"
        >
          <div class="card border-white">
            <img
              class="card-img-top custom-image"
              :src="product.images[0]"
              alt="Producto"
            />
            <div class="card-body">
              <h5 class="card-title text-left">{{ product.name }}</h5>
              <p class="card-text text-left">Precio: ${{ product.price }}</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style>
.card-link {
  text-decoration: none;
}
.custom-image {
  width: 150px;
  height: 150px;
  object-fit: contain;
}
</style>

<script>
import axios from "axios";

export default {
  name: "ProductsPage",
  data() {
    return {
      products: [],
    };
  },
  created() {
    document.title = `Principal`;
    axios
      .get(
        "http://192.168.100.28:3000/api/v1/products?fields=name,price,images,category,brand,slug,isActive&sort=-price"
      )
      .then((response) => {
        this.products = response.data.data.data;
      })
      .catch((error) => {
        console.error("Error al obtener los datos de la API: " + error);
      });
  },
};
</script>
