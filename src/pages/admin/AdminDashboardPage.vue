<template>
  <v-card v-if="isAdmin">
    <v-tabs v-model="tab" bg-color="primary">
      <v-tab value="one">Productos</v-tab>
      <v-tab value="two">Marcas</v-tab>
      <v-tab value="three">Categorias</v-tab>
      <v-tab value="four">Usuarios</v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="one">
          <v-card>
            <AdminProducts />
          </v-card>
        </v-window-item>

        <v-window-item value="two"> Two </v-window-item>

        <v-window-item value="three"> Three </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
  <div v-else>
    <h3>No tiene permisos de administrador</h3>
  </div>
</template>
<script>
import AdminProducts from "./AdminProductsPage.vue";
import { useUserStore } from "@/stores/user";

export default {
  name: "AdminDashboard",
  data: () => ({
    tab: null,
  }),
  components: {
    AdminProducts,
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
};
</script>
