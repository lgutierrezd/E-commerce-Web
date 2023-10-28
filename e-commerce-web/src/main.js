import { createApp } from "vue";
import App from "./App.vue";
import * as VueRouter from "vue-router";
import ShoppingCartPage from "./pages/ShoppingCartPage.vue";
import ProductsPage from "./pages/ProductsPage.vue";
import ProductDetailPage from "./pages/ProductDetailPage.vue";
import HomePage from "./pages/HomePage.vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

createApp(App)
  .use(
    VueRouter.createRouter({
      history: VueRouter.createWebHistory(process.env.BASE_URL),
      routes: [
        {
          path: "/",
          component: HomePage,
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
      ],
    })
  )
  .mount("#app");
