<template>
  <v-container>
    <v-layout row>
      <div>
        <div>
          <v-btn type="submit" color="primary" @click="click1"
            >Cargar imagenes</v-btn
          >
          <input
            type="file"
            ref="input1"
            style="display: none"
            @change="previewImage"
            accept="image/*"
          />
        </div>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export default {
  name: "UploadImage",
  data() {
    return {
      img1: "",
      imageData: null,
    };
  },
  props: ["slug", "images"],
  methods: {
    create() {},
    click1() {
      this.$refs.input1.click();
    },
    previewImage(event) {
      this.img1 = URL.createObjectURL(event.target.files[0]);
      this.imageData = event.target.files[0];
      this.$emit("image", {
        url: this.img1,
        image: this.imageData,
      });
      this.img1 = "";
      this.imageData = null;
    },
    onUpload() {
      //this.img1 = null;

      const storage = getStorage();
      const storageRef = ref(storage, `${this.imageData.name}`);
      uploadBytes(storageRef, this.imageData).then(() => {
        getDownloadURL(storageRef)
          .then((url) => {
            console.log("URL de descarga de la imagen:", url);
          })
          .catch((error) => {
            console.error("Error al obtener la URL de descarga:", error);
          });
        console.log("Uploaded!");
      });
    },
    findAndDelete() {
      const storage = getStorage();

      // Reference to the file you want to delete
      const fileRef = ref(storage, this.imageData.name);

      // Delete the file
      deleteObject(fileRef)
        .then(() => {
          console.log("File deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting file:", error);
        });
      this.img1 = null;
    },
  },
};
</script>
