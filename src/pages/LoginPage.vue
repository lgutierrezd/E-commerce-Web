<template>
  <div class="container">
    <h3 class="text-center">Login</h3>
    <form @submit.prevent="login" class="text-left">
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          type="email"
          id="email"
          class="form-control form-control-sm input-size"
          v-model="formData.email"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="text"
          id="password"
          class="form-control form-control-sm input-size"
          v-model="formData.password"
          required
        />
      </div>
      <br />
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </div>
</template>

<style>
.input-size {
  width: 200px;
}
</style>

<script>
import axios from "axios";
import { useUserStore } from "@/stores/user";

export default {
  data() {
    return {
      loginTitle: "Login",
      formData: {
        email: "",
        password: "",
      },
      loading: false,
    };
  },
  computed: {
    user() {
      return useUserStore();
    },
  },
  created() {
    document.title = this.loginTitle;
    if (useUserStore().isLoggedIn) {
      this.$router.push("/myaccount");
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(
          "/api/v1/users/login",
          this.formData,
          { withCredentials: true }
        );

        if (response.data.status === "success") {
          const jwtToken = response.data.token;
          const user = response.data.data.user;
          if (jwtToken) {
            // Store user information and token in your Vuex store
            useUserStore().login(user, jwtToken);
            this.loading = false;
            this.$router.push("/");
          }
        }
      } catch (error) {
        console.error("Error en el inicio de sesión:", error);
      }
    },
  },
};
</script>
