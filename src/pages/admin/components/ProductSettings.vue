<template>
  <div>
    <div v-if="user.user.role === 'admin'">
      <!-- Buscado de productos -->
      <v-row v-if="user.user.role === 'admin'">
        <v-col cols="8" md="5" lg="5">
          <v-text-field
            v-model="searchInput"
            label="Buscar productos"
            placeholder="Buscar productos"
            variant="outlined"
            class="search-text-field"
            @keyup.enter="searchProducts"
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- Lista de  resultados-->
      <v-row v-if="(user.user.role === 'admin') & (products.length > 0)">
        <v-col cols="8" md="5" lg="5">
          <v-table>
            <thead>
              <tr>
                <th class="text-left">Nombre</th>
                <th class="text-left">Precio</th>
                <th class="text-left">Accion</th>
                <th class="text-left"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="product in products"
                :key="product._id"
                @click="selectProduct(product)"
                :class="
                  'img-list' + { 'selected-row': isProductSelected(product) }
                "
              >
                <td>{{ product.name }}</td>
                <td>{{ formattedNumber(product.price) }}</td>
                <td>
                  <img
                    @click="isActiveProduct(product)"
                    src="./../../../assets/trash.png"
                    alt="Desactivar"
                    class="img-list"
                  />
                </td>
                <td>
                  <img
                    v-if="isProductSelected(product)"
                    src="@/assets/checked.png"
                    alt="Seleccionado"
                    class="img-list"
                  />
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>

      <v-row>
        <v-col v-if="selectedProduct" cols="8" md="5" lg="5">
          <!-- Formulario de edición -->
          <h3>Modificar producto</h3>
          <FormProduct
            :selectedProduct="selectedProduct"
            @update="updateProduct"
          />
        </v-col>
        <v-col v-if="selectedProduct" cols="8" md="3" lg="3">
          <h3>Proveedores</h3>
          <v-autocomplete
            chips
            label="Autocomplete"
            v-model="product.selectedSupplier"
            :items="suppliers"
            item-title="name"
            item-value="_id"
            multiple
            return-object
          >
          </v-autocomplete>
          <h3>Marca</h3>
          <v-autocomplete
            chips
            label="Autocomplete"
            v-model="product.selectedBrand"
            :items="brands"
            item-title="name"
            item-value="_id"
            return-object
          >
          </v-autocomplete>
          <h3>Categoria</h3>
          <v-autocomplete
            chips
            label="Autocomplete"
            v-model="product.selectedCategory"
            :items="categories"
            item-title="name"
            item-value="_id"
            return-object
          >
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            v-if="selectedProduct"
            type="submit"
            color="primary"
            @click="updateProduct()"
            >Actualizar</v-btn
          >
        </v-col>
      </v-row>
    </div>
    <div v-else>No tienes permiso para navegar a esta direccion...</div>
  </div>
</template>

<style>
.img-list {
  width: 25px;
  height: 25px;
}
.search-text-field {
  padding-top: 20px;
}
</style>

<script>
import axios from "axios";
import { useUserStore } from "@/stores/user";
import { formatNumber } from "@/utils/utils.js";
import FormProduct from "./FormProduct.vue";
export default {
  name: "ProductSettings",
  data() {
    return {
      searchInput: "",
      products: [], //Filled on seach

      selectedProduct: null, //filled on select product
      selectedBrand: null,
      selectedCategory: null, //filled on select product
    };
  },
  props: ["brands", "categories", "suppliers"],
  components: {
    FormProduct,
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
  methods: {
    formattedNumber(value) {
      return formatNumber(Number(value));
    },
    updateProduct() {
      const sbrand = this.brands.find((el) => el.name === this.selectedBrand);
      const scate = this.categories.find(
        (el) => el.name === this.selectedCategory
      );

      const product = {
        name: this.selectedProduct.name,
        price: Number(this.selectedProduct.price),
        productionPrice: Number(this.selectedProduct.productionPrice),
        isActive: this.selectedProduct.isActive,
        category: scate._id,
        brand: sbrand._id,
      };
      axios
        .patch(`/api/v1/products/${this.selectedProduct._id}`, product, {
          withCredentials: true,
        })
        .then((response) => {
          this.selectedProduct = null;
          this.selectedCategory = null;
          this.selectedBrand = null;
          this.products = [];
          this.searchInput = "";
          console.log("Product updated:", response);
        })
        .catch((error) => {
          console.error("Error searching for products:", error);
        });
    },
    searchProducts() {
      this.selectedProduct = null;
      this.selectedCategory = null;
      this.selectedBrand = null;
      if (this.searchInput.length > 0) {
        axios
          .get(`/api/v1/products/search/${this.searchInput}`)
          .then((response) => {
            this.products = response.data.data.data;
          })
          .catch((error) => {
            console.error("Error searching for products:", error);
          });
      } else {
        this.products = [];
      }
    },
    isActiveProduct(product) {
      if (this.searchInput.length > 0) {
        axios
          .delete(`/api/v1/products/${product._id}`)
          .then((response) => {
            if (response.status === 204) {
              console.log("La eliminación se realizó con éxito.");
              this.selectedProduct.isActive = false;
            } else {
              console.error("La eliminación no se realizó correctamente.");
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
      const sbrand = this.brands.find(
        (el) => el._id == this.selectedProduct.brand
      );
      this.selectedBrand = sbrand.name;
      const scate = this.categories.find(
        (el) => el._id == this.selectedProduct.category
      );
      this.selectedCategory = scate.name;
    },
    isProductSelected(product) {
      return (
        this.selectedProduct !== null &&
        this.selectedProduct._id === product._id
      );
    },
  },
};
</script>
