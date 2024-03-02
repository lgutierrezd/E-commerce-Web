<template>
  <div class="container">
    <h1>Productos</h1>
    <div class="row"></div>
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
import { formatNumber } from "@/utils/utils.js";

export default {
  name: "HomePage",
  data() {
    return {
      products: [],
    };
  },
  methods: {
    formattedNumber(value) {
      return formatNumber(Number(value));
    },
  },
  created() {
    document.title = `Principal`;
    axios
      .get(
        "/api/v1/products?fields=name,price,images,category,brand,slug,isActive&sort=-price"
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
