<template>
  <div class="container">
    <div class="row">
      <nav class="col-md-3 col-lg-2 d-md-block bg-light sidebar">
        <div class="position-sticky">
          <ul class="nav flex-column">
            <li class="nav-item">
              <router-link to="/admin/products" class="nav-link">
                Products
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/admin/brands" class="nav-link">
                Brands
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/admin/categories" class="nav-link">
                Categories
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/admin/users" class="nav-link">
                Users
              </router-link>
            </li>
          </ul>
        </div>
      </nav>

      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <!-- Contenido principal de la página -->
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminDashboard",
};
</script>
