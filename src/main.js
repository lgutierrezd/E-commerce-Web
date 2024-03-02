import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import * as VueRouter from "vue-router";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/dist/vuetify.css";

import ShoppingCartPage from "./pages/ShoppingCartPage.vue";
import ProductsPage from "./pages/ProductsPage.vue";
import ProductDetailPage from "./pages/ProductDetailPage.vue";
import HomePage from "./pages/HomePage.vue";
import NotFoundPage from "./pages/NotFoundPage.vue";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.vue";
import LoginPage from "./pages/LoginPage.vue";
import SignUpPage from "./pages/SignUpPage.vue";
import MyAccountPage from "./pages/MyAccountPage.vue";
import { useCartStore } from "@/stores/cart";
import { useUserStore } from "@/stores/user";
import axios from "./axios";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase.js";

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: HomePage,
    },
    {
      path: "/login",
      component: LoginPage,
    },
    {
      path: "/signup",
      component: SignUpPage,
    },
    {
      path: "/myaccount",
      component: MyAccountPage,
    },
    {
      path: "/cart",
      component: ShoppingCartPage,
    },
    {
      path: "/products",
      component: ProductsPage,
    },
    {
      path: "/product/:id",
      name: "ProductDetail",
      component: ProductDetailPage,
    },
    {
      path: "/:pathMatch(.*)*",
      component: NotFoundPage,
    },
    {
      path: "/admin",
      component: AdminDashboardPage,
    },
    {
      path: "/admin/*",
      component: NotFoundPage,
    },
  ],
});

const app = createApp(App);
initializeApp(firebaseConfig);
const pinia = createPinia();

const vuetify = createVuetify({
  components,
  directives,
});

app.use(vuetify);
app.use(pinia);

app.provide("cartStore", useCartStore);
app.provide("userStore", useUserStore);
app.use(router);

app.mount("#app");

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://silent-blend-412918.uc.r.appspot.com";
app.config.globalProperties.axios = axios;

const cartStore = useCartStore();
cartStore.loadCartFromLocalStorage();

const userStore = useUserStore();
userStore.loadUserFromLocalStorage();

//cartStore.clearCart();
