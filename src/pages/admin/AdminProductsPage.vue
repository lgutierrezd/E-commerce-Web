<template>
  <div class="container">
    <h3 class="mt-4">ADMIN - Mantenimiento de Productos</h3>
    <div v-if="user.user.role === 'admin'">
      <!-- Buscado de productos -->
      <div v-if="user.user.role === 'admin'" class="mb-4">
        <v-row>
          <v-col cols="10">
            <v-text-field
              v-model="searchInput"
              label="Buscar productos"
              placeholder="Buscar productos"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-btn @click="searchProducts" color="primary">Buscar</v-btn>
          </v-col>
        </v-row>
      </div>

      <!-- Lista de  resultados-->
      <div
        v-if="(user.user.role === 'admin') & (products.length > 0)"
        class="mb-4"
      >
        <v-card class="mx-auto pa-2" max-width="300"> </v-card>
        <v-list>
          <v-list-subheader>Resultados: </v-list-subheader>
          <v-list-item
            v-for="(product, i) in products"
            :key="i"
            :value="product"
            color="primary"
            rounded="shaped"
            @click="selectProduct(product)"
          >
            <v-list-item-title v-text="product.name"></v-list-item-title
          ></v-list-item>
        </v-list>
      </div>

      <div class="row">
        <!-- Formulario de edición -->
        <div v-if="selectedProduct" class="col-md-6">
          <div class="container">
            <h3 class="mt-4">Modificar producto</h3>
            <form @submit.prevent="updateProduct">
              <v-text-field
                v-model="selectedProduct.name"
                label="Nombre"
                outlined
              ></v-text-field>

              <v-text-field
                v-model="selectedProduct.price"
                label="Precio"
                outlined
              ></v-text-field>

              <v-text-field
                v-model="selectedProduct.productionPrice"
                label="Precio costo"
                outlined
              ></v-text-field>

              <v-switch
                v-model="selectedProduct.isActive"
                :label="selectedProduct.isActive ? 'Activo' : 'Inactivo'"
                class="isActive"
              ></v-switch>

              <v-btn type="submit" color="primary">Actualizar</v-btn>
            </form>
          </div>
        </div>

        <div v-if="selectedProduct" class="col-md-6 dropdownBrand">
          <h3>Marca</h3>
          <div>
            <v-autocomplete
              chips
              :title="'Autocomplete'"
              v-model="selectedBrand.name"
              :items="brandsNames"
              return-object
            >
            </v-autocomplete>
          </div>
        </div>
      </div>
    </div>
    <div v-else>No tienes permiso para navegar a esta direccion...</div>
  </div>
</template>

<style>
.selected-row {
  background-color: lightblue; /* You can change the background color to your preference */
}
.isActive {
  padding-right: 5px;
}
.dropdownBrand {
  padding: 20px;
}
</style>

<script>
import axios from "axios";
import { useUserStore } from "@/stores/user";

export default {
  name: "AdminProducts",
  data() {
    return {
      searchInput: "",
      products: [], //Filled on seach
      selectedProduct: null, //filled on select product
      selectedBrand: null, //filled on select product
      brands: [], //filled on create
      brandsNames: [], //filled for autocomplete search
      selectedBrands: [], //filled on select brands
    };
  },
  computed: {
    isLoggedIn: {
      get() {
        return useUserStore().isLoggedIn;
      },
    },
    user() {
      return useUserStore();
    },
  },
  created() {
    document.title = "Productos || Mantenimiento";
    if (!useUserStore().isLoggedIn) {
      this.$router.push("/");
    } else {
      axios
        .get("api/v1/brand")
        .then((response) => {
          this.brands = response.data.data.data;
          this.brandsNames = this.brands.map((brand) => brand.name);
        })
        .catch((error) => {
          console.error("Error searching for products:", error);
        });
    }
  },
  methods: {
    searchProducts() {
      if (this.searchInput.length > 0) {
        axios
          .get(`/api/v1/products/search/${this.searchInput}`)
          .then((response) => {
            this.products = response.data.data.data;
            if (this.products.length < 1) {
              this.selectedProduct = null;
            }
          })
          .catch((error) => {
            console.error("Error searching for products:", error);
          });
      } else {
        this.products = [];
        this.selectedProduct = null;
      }
    },
    selectProduct(product) {
      // Cuando se selecciona un producto, almacénalo en selectedProduct
      this.selectedProduct = product;
      this.selectedBrand = this.brands.find(
        (el) => el._id == this.selectedProduct.brand
      );
    },
    executeSearch() {
      const searchTerm = this.searchBrandInput;
      this.brands = this.brands.filter((brandItem) =>
        brandItem.name.includes(searchTerm)
      );
    },
  },
};
</script>
