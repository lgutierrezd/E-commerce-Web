<template>
  <NavBar />
  <router-view />
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
