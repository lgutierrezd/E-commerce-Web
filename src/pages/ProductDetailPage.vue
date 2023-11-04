<template>
  <div v-if="product.id">
    <div class="container">
      <h1>Detalles del Producto</h1>
      <div class="row">
        <div class="col-md-6">
          <img v-if="loading" src="" alt="Cargando..." />
          <img
            v-else
            class="product-image"
            :src="
              product.images && product.images.length > 0
                ? product.images[0]
                : ''
            "
            :alt="product.name"
          />
        </div>
        <div class="col-md-6">
          <h2>{{ product.name }}</h2>
          <p>Precio: ${{ formattedNumber(product.price) }}</p>
          <p v-if="product.stock && product.stock.length > 0">
            Disponibles:
            {{
              product.stock[0] && product.stock[0].quantity
                ? product.stock[0].quantity
                : "No disponible"
            }}
          </p>
          <label for="quantity">Cantidad:</label>
          <input type="number" id="quantity" v-model="quantity" min="1" />
          <button @click="addToCart">Agregar al carrito</button>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <NotFoundPage />
  </div>
</template>

<script>
import axios from "axios";
import { useCartStore } from "@/stores/cart";
import NotFoundPage from "@/pages/NotFoundPage.vue";
import { formatNumber } from "@/utils/utils.js";

export default {
  name: "ProductDetailPage",
  data() {
    return {
      product: {},
      loading: true,
      quantity: 1,
    };
  },
  components: {
    NotFoundPage,
  },
  methods: {
    formattedNumber(value) {
      return formatNumber(Number(value));
    },
    addToCart() {
      const availableQuantity =
        this.product.stock[0] && this.product.stock[0].quantity;

      if (availableQuantity && availableQuantity > 0) {
        // Verifica si hay suficiente cantidad disponible
        const productToAdd = {
          id: this.product.id,
          name: this.product.name,
          price: this.product.price,
          images: [...this.product.images],
          quantity: this.quantity,
        };

        useCartStore().addToCart(productToAdd);

        // Actualiza la cantidad disponible restando la cantidad seleccionada
        this.product.stock[0].quantity -= this.quantity;

        // Restablece la cantidad seleccionada a 1
        this.quantity = 1;
      } else {
        console.warn("No hay suficiente cantidad disponible");
      }
    },
    removeFromCart(product) {
      useCartStore().removeFromCart(product);
    },
  },
  computed: {
    cart() {
      return useCartStore();
    },
  },
  created() {
    document.title = "Producto | ";
    const slug = this.$route.params.id;

    axios
      .get(`/api/v1/products/${slug}`)
      .then((response) => {
        this.product = response.data.data.data;
        if (response.data.status === "success") {
          this.loading = false;
          document.title = `${this.product.name}`;
        }
      })
      .catch(() => {
        // console.error("Error al obtener los datos de la API: " + error);
        this.loading = false;
      });
  },
};
</script>
