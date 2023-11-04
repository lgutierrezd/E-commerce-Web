<template>
  <div>
    <h3>My account</h3>
    <div>
      <!-- Agrega el botón solo si el usuario tiene el rol de administrador -->
      <router-link
        v-if="user.role === 'admin'"
        to="/admin"
        class="btn btn-primary"
      >
        Go to Admin
      </router-link>

      <div>
        <!-- Aquí puedes mostrar la información de la cuenta del usuario -->
        <p>Name: {{ user.name }}</p>
        <p>Email: {{ user.email }}</p>
        <!-- Agrega más detalles según sea necesario -->
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useUserStore } from "@/stores/user";

export default {
  name: "MyAccount",
  data() {
    return {
      user: {},
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
  },
  created() {
    if (!useUserStore().isLoggedIn) {
      this.$router.push("/");
    } else {
      axios
        .get(`/api/v1/users/me`, {
          withCredentials: true,
        })
        .then((response) => {
          this.user = response.data.data.data;
          if (response.data.status === "success") {
            this.loading = false;
            document.title = `${this.user.name}`;
          }
        })
        .catch(() => {
          // console.error("Error al obtener los datos de la API: " + error);
          this.loading = false;
        });
    }
  },
};
</script>
