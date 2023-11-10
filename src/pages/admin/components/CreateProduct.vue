<template>
  <v-row>
    <v-col cols="8" md="5" lg="4">
      <!-- Formulario de edición -->
      <ConfigProductForm1
        :product="product"
        :autocompleteSuppliers="autocompleteSuppliers"
        :autocompleteBrands="autocompleteBrands"
        :autocompleteCategories="autocompleteCategories"
        @product-updated="handleProductUpdate"
      />
    </v-col>
    <v-col v-if="isCreatingProductFinished">
      <ConfigProductForm2 :product="product" :productReponse="productReponse" />
    </v-col>
  </v-row>

  <v-btn
    type="submit"
    color="primary"
    @click="createProduct()"
    v-show="showCreate"
    >Crear</v-btn
  >
  <v-alert
    v-if="showAlert"
    :value="showAlert"
    color="error"
    dismissible
    outlined
  >
    {{ alertText }}
  </v-alert>
  <v-alert
    v-if="showGreenAlert"
    :value="showGreenAlert"
    color="success"
    outlined
  >
    {{ greenAlertText }}
  </v-alert>
</template>

<style>
.grid-layout {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(160px, 1fr)
  ); /* Define las columnas como desees */
  grid-gap: 16px; /* Espacio entre elementos (ajusta según tus necesidades) */
}
</style>

<script>
import ConfigProductForm1 from "./ConfigProductForm1.vue";
import ConfigProductForm2 from "./ConfigProductForm2.vue";
import axios from "axios";

import trash from "@/assets/trash.png";
import { product } from "./productData.js";

export default {
  name: "CreateProduct",
  data() {
    return {
      dragOptions: {
        animation: 150, // Adjust animation speed as needed
      },
      trash,
      dragging: false,
      showCreate: true,
      product,
      productReponse: {},
      isCreatingProductFinished: false,
      showAlert: false,
      showGreenAlert: false,
      alertText: "",
      greenAlertText: "",
    };
  },
  props: [
    "autocompleteBrands",
    "autocompleteCategories",
    "autocompleteSuppliers",
  ],
  components: {
    ConfigProductForm1,
    ConfigProductForm2,
  },
  methods: {
    createProduct() {
      if (
        this.product.selectedCategory &&
        this.product.selectedBrand &&
        this.product.selectedSupplier &&
        this.product.name.length > 0
      ) {
        this.product.category = this.product.selectedCategory._id;
        this.product.brand = this.product.selectedBrand._id;
        this.product.suppliers = this.product.selectedSupplier.map(
          (ele) => ele._id
        );
        axios
          .post("api/v1/products", this.product, { withCredentials: true })
          .then((responses) => {
            if (responses.data.status === "success") {
              this.productReponse = responses.data.data.data;
              this.isCreatingProductFinished = true;

              this.showGreenAlert = true;
              this.greenAlertText = "Producto creado existosamente.";

              this.showAlert = false;
              this.alertText = "";

              setTimeout(() => {
                this.showGreenAlert = false;
                this.showCreate = false;
              }, 1500); // Mostrar la alerta durante 1 segundo (1000 milisegundos)
            }
          })
          .catch(() => {
            // console.error("Error creating product:", error);
            this.showAlert = true;
            this.alertText = "Error procesando la solicitud.";
          });
      } else {
        this.showAlert = true;
        this.alertText = "Todos los datos del formulario son requeridos.";
      }
    },
    handleProductUpdate(newProduct) {
      this.product.name = newProduct.name;
      this.product.selectedBrand = newProduct.selectedBrand;
      this.product.selectedSupplier = newProduct.selectedSupplier;
      this.product.selectedCategory = newProduct.selectedCategory;
    },
  },
};
</script>
