<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark">
    <a class="navbar-brand">
      <router-link to="/" class="nav-link">
        <img :src="logo" alt="Logo" class="nav-bar-logo" />
      </router-link>
      <!-- Enlace al inicio (home) -->
    </a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    ></button>
    <div class="container">
      <form class="d-flex mx-auto" role="search">
        <input
          class="custom-search-input rounded me-2"
          type="search"
          placeholder="Estoy buscando..."
          aria-label="Search"
        />
        <button class="btn btn-primary" type="submit">Buscar</button>
      </form>
    </div>
    <div class="navbar-collapse collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link" href="#">Iniciar Sesión</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Registrarse</a>
        </li>
        <li class="nav-item">
          <router-link to="/cart" class="nav-link">
            <img :src="cart" alt="Carrito" class="cart" />
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style>
.cart {
  width: 30px;
  height: 30px;
  object-fit: contain;
}
.nav-bar-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  padding-left: 10px;
}
.custom-search-input {
  width: 600px; /* Ajusta el ancho según tus necesidades */
}
</style>

<script>
import logo from "@/assets/logo.png";
import cart from "@/assets/cart.png";
export default {
  name: "NavBar",
  data() {
    return {
      logo,
      cart,
    };
  },
};
</script>
