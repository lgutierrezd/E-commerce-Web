<!-- eslint-disable vue/no-mutating-props -->
<template>
  <form @submit.prevent="updateProduct">
    <v-text-field
      v-model="selectedProduct.name"
      label="Nombre"
      outlined
    ></v-text-field>

    <v-text-field
      v-model="selectedProduct.price"
      label="Precio"
      outlined
    ></v-text-field>

    <v-text-field
      v-model="selectedProduct.productionPrice"
      label="Precio costo"
      outlined
    ></v-text-field>

    <v-switch
      v-model="selectedProduct.isActive"
      :label="selectedProduct.isActive ? 'Activo' : 'Inactivo'"
      class="isActive"
    ></v-switch>
  </form>
</template>

<script>
export default {
  props: {
    selectedProduct: Object, // Prop para recibir el objeto de producto
  },
  data() {
    return {
      editedProduct: { ...this.selectedProduct }, // Copia del producto para edición
    };
  },
  methods: {
    updateProduct() {
      this.$emit("update", this.editedProduct);
    },
  },
};
</script>
