<template>
  <v-app-bar app>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <router-link to="/">
      <v-img class="nav-bar-logo" :src="logo" alt="Logo"></v-img>
    </router-link>
    <v-spacer></v-spacer>
    <v-text-field
      v-model="searchInput"
      label="Estoy buscando..."
      class="custom-search-input"
      @keyup.enter="searchProducts"
      append-inner-icon="mdi-map-marker"
    ></v-text-field>
    <v-spacer></v-spacer>
    <v-card>
      <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="end">
        <v-tab :value="2" @click="goToCart" :active="isRouteActive('/cart')">
          <router-link to="/cart">
            <v-img class="cart" :src="cart" alt="Cart"></v-img>
          </router-link>
        </v-tab>
        <v-tab :value="1" @click="goToHome" :active="isRouteActive('/')"
          >Inicio</v-tab
        >
        <v-tab
          :value="3"
          @click="goToLoginOrMyAccount"
          :active="isRouteActive('/login') || isRouteActive('/myaccount')"
          >{{ !isLoggedIn ? "Iniciar sesión" : "Mi cuenta" }}</v-tab
        >
        <v-tab
          :value="4"
          @click="goToSignupOrLogout"
          :active="isRouteActive('/signup')"
          >{{ !isLoggedIn ? "Registrarse" : "Cerrar sesión" }}</v-tab
        >
      </v-tabs>
    </v-card>
  </v-app-bar>
</template>

<style>
.cart {
  width: 30px;
  height: 30px;
  padding-top: 60px;
  object-fit: contain;
}
.nav-bar-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  padding-left: 10px;
}
.custom-search-input {
  padding-top: 20px;
}
</style>

<script>
import logo from "@/assets/logo.png";
import cart from "@/assets/cart.png";
import { useUserStore } from "@/stores/user";

export default {
  name: "NavBar",
  data() {
    return {
      logo,
      cart,
      searchInput: "",
      drawer: false,
      tab: null,
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
  watch: {
    $route(to) {
      if (to.path === "/") {
        this.goToHome();
      }
    },
  },
  methods: {
    isRouteActive(route) {
      return this.$route.path === route;
    },
    handleLogout() {
      useUserStore().logout();
    },
    goToHome() {
      this.$router.push({ path: "/" });
      this.tab = 1;
    },
    goToCart() {
      this.tab = 2;
    },
    goToLoginOrMyAccount() {
      if (this.isLoggedIn) {
        this.$router.push({ path: "/myaccount" });
      } else {
        this.$router.push({ path: "/login" });
      }
      this.tab = 3;
    },
    goToSignupOrLogout() {
      if (this.isLoggedIn) {
        this.handleLogout();
        this.$router.push({ path: "/" });
        this.tab = 1;
      } else {
        this.$router.push({ path: "/signup" });
        this.tab = 4;
      }
    },
    searchProducts() {},
  },
};
</script>
