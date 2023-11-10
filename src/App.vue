<template>
  <v-app
    ><NavBar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
.card-link {
  text-decoration: none;
}
</style>

<script>
import NavBar from "@/components/NavBar.vue";

export default {
  name: "App",
  components: {
    NavBar,
  },
};
</script>
