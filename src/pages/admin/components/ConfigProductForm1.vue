<template>
  <div>
    <h3>Nombre</h3>
    <v-text-field
      v-model="localProduct.name"
      label="Nombre"
      outlined
      @input="updateProduct"
    ></v-text-field>
    <h3>Proveedores</h3>
    <v-autocomplete
      chips
      label="Autocomplete"
      v-model="localProduct.selectedSupplier"
      :items="autocompleteSuppliers"
      item-title="name"
      item-value="_id"
      multiple
      return-object
      @update:model-value="updateProduct"
    >
    </v-autocomplete>
    <h3>Marca</h3>
    <v-autocomplete
      chips
      label="Autocomplete"
      v-model="localProduct.selectedBrand"
      :items="autocompleteBrands"
      item-title="name"
      item-value="_id"
      return-object
      @update:model-value="updateProduct"
    >
    </v-autocomplete>
    <h3>Categoria</h3>
    <v-autocomplete
      chips
      label="Autocomplete"
      v-model="localProduct.selectedCategory"
      :items="autocompleteCategories"
      item-title="name"
      item-value="_id"
      return-object
      @update:model-value="updateProduct"
    >
    </v-autocomplete>
  </div>
</template>

<script>
export default {
  props: [
    "product",
    "autocompleteSuppliers",
    "autocompleteBrands",
    "autocompleteCategories",
  ],
  data() {
    return {
      localProduct: { ...this.product },
    };
  },
  methods: {
    updateProduct() {
      this.$emit("product-updated", this.localProduct);
    },
  },
};
</script>
