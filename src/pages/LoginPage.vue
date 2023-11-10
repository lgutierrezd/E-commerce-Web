<template>
  <div>
    <v-img
      class="mx-auto my-6"
      max-width="228"
      src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
    ></v-img>

    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Correo</div>

      <v-text-field
        density="compact"
        placeholder="Correo electronico"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        v-model="formData.email"
      ></v-text-field>

      <div
        class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
      >
        Contraseña

        <a
          class="text-caption text-decoration-none text-blue"
          href="/forgotPassword"
          rel="noopener noreferrer"
          target="_blank"
        >
          ¿Olvido contraseña?</a
        >
      </div>

      <v-text-field
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Enter your password"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="visible = !visible"
        v-model="formData.password"
      ></v-text-field>

      <v-card class="mb-12" color="surface-variant" variant="tonal">
        <v-card-text class="text-medium-emphasis text-caption">
          Warning: After 3 consecutive failed login attempts, you account will
          be temporarily locked for three hours. If you must login now, you can
          also click "Forgot login password?" below to reset the login password.
        </v-card-text>
      </v-card>

      <v-btn
        block
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        @click="login()"
      >
        Log In
      </v-btn>

      <v-card-text class="text-center">
        <a
          class="text-blue text-decoration-none"
          href="/signup"
          rel="noopener noreferrer"
          target="_blank"
        >
          Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </v-card-text>
    </v-card>
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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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
          if (jwtToken) {
            const auth = getAuth();
            const user = response.data.data.user;
            console.log("user " + user.role);
            if (user.role === "admin") {
              signInWithEmailAndPassword(
                auth,
                this.formData.email,
                this.formData.password
              )
                .then(() => {
                  console.log("user firebase success ");
                })
                .catch((error) => {
                  console.error(
                    "Error en la autenticación de Firebase:",
                    error
                  );
                });
            }

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
