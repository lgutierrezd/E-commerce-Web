<template>
  <v-card>
    <div class="d-flex flex-row">
      <v-tabs v-model="tab" direction="vertical" color="primary">
        <v-tab value="one"> Agregar Producto </v-tab>
        <v-tab value="two"> Modificar Producto </v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="one" v-if="!loading">
            <v-card>
              <CreateProduct
                :autocompleteBrands="brands"
                :autocompleteCategories="categories"
                :autocompleteSuppliers="suppliers"
              />
            </v-card>
          </v-window-item>
          <v-window-item value="two" v-if="!loading">
            <ProductSettings
              :brands="brands"
              :categories="categories"
              :suppliers="suppliers"
            />
          </v-window-item>
        </v-window>
      </v-card-text>
    </div>
  </v-card>
</template>

<style></style>

<script>
// import axios from "axios";
import { useUserStore } from "@/stores/user";
import ProductSettings from "./components/ProductSettings";
import CreateProduct from "./components/CreateProduct";
import axios from "axios";
export default {
  name: "AdminProducts",
  data: () => ({
    tab: null,
    categories: [], //filled on create
    brands: [], //filled on create
    supplier: [], //filled on create
    loading: true,
  }),
  components: {
    ProductSettings,
    CreateProduct,
  },
  computed: {
    isLoggedIn: {
      get() {
        return useUserStore().isLoggedIn;
      },
    },
    isAdmin: {
      get() {
        return useUserStore().isAdmin;
      },
    },
    user() {
      return useUserStore();
    },
  },
  methods: {
    fetchData() {
      return Promise.all([
        axios.get("api/v1/brand"),
        axios.get("api/v1/categories"),
        axios.get("api/v1/supplier"),
      ])
        .then((responses) => {
          this.brands = responses[0].data.data.data;
          this.categories = responses[1].data.data.data;
          this.suppliers = responses[2].data.data.data;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  created() {
    document.title = "Productos || Mantenimiento";
    if (!useUserStore().isLoggedIn) {
      this.$router.push("/");
    } else {
      this.fetchData();
    }
  },
};
</script>
