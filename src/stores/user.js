// user.js
import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    user: null,
    jwtToken: null, // Aquí almacenarás los datos del usuario
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdmin: (state) => {
      if (state.user) {
        return true;
      } else {
        return false;
      }
    },
  },
  actions: {
    login(user, jwtToken) {
      //console.log(`User ${user.name}.`);
      // Lógica para iniciar sesión (puedes realizar la solicitud HTTP aquí)
      // Después de un inicio de sesión exitoso, guarda los datos del usuario en el estado y en localStorage
      this.user = user;

      localStorage.setItem("user", JSON.stringify(user));
      if (jwtToken) {
        localStorage.setItem("jwtToken", jwtToken);
        this.jwtToken = jwtToken;
      }
      this.saveUserToLocalStorage();
    },
    async logout() {
      try {
        const response = await axios.get("/api/v1/users/logout", null, {
          withCredentials: true,
        });

        if (response.data.status === "success") {
          // Realiza la lógica de cierre de sesión aquí, por ejemplo, borrar datos locales.
          this.user = null;
          this.jwtToken = null;
          localStorage.removeItem("user");
          localStorage.removeItem("jwtToken");
        }
      } catch (error) {
        console.error("Error al cerrar la sesión:", error);
      }
    },
    loadUserFromLocalStorage() {
      try {
        const user = localStorage.getItem("user");
        const jwtToken = localStorage.getItem("jwtToken");
        if (user) {
          this.user = JSON.parse(user);
        }
        if (jwtToken) {
          this.jwtToken = jwtToken;
        }
      } catch (error) {
        console.error("Error al analizar los datos de localStorage:", error);
      }
    },
    saveUserToLocalStorage() {
      localStorage.setItem("user", JSON.stringify(this.user));
    },
  },
  onBeforeMount() {
    // Cargar el carrito desde el almacenamiento local al inicio de la aplicación
    this.loadUserFromLocalStorage();
  },
});
