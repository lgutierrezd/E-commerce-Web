<template>
  <v-card>
    <v-tabs v-model="tab" bg-color="primary">
      <v-tab v-for="n in configLength" :key="n" :value="n">
        Config {{ n }}
      </v-tab>
    </v-tabs>
    <v-card-text class="text-center">
      <v-btn :disabled="!configLength" variant="text" @click="removeTabConfig">
        Remove Tab
      </v-btn>
      <v-divider class="mx-4" vertical></v-divider>
      <v-btn variant="text" @click="createTabConfig"> Add Tab </v-btn>

      <v-window v-model="tab" v-if="localProduct.config.length > 0">
        <v-window-item v-for="c in this.configLength" :key="c" :value="c">
          <v-row>
            <v-col cols="8" md="5" lg="4">
              <v-text-field
                v-model="localProduct.config[tab - 1].price"
                label="Precio"
                outlined
              ></v-text-field>
              <v-text-field
                v-model="localProduct.config[tab - 1].productionPrice"
                label="Precio Costo"
                outlined
              ></v-text-field>
              <v-text-field
                v-model="localProduct.config[tab - 1].description"
                label="Descripcion del producto"
                outlined
              ></v-text-field>

              <v-color-picker
                v-model="localProduct.config[tab - 1].hexColor"
                :modes="['rgba', 'hexa']"
                elevation="15"
              ></v-color-picker>
              <v-switch
                v-model="localProduct.config[tab - 1].isActive"
                :label="
                  product.config[tab - 1].isActive ? 'Activo' : 'Inactivo'
                "
                class="isActive"
              ></v-switch>
            </v-col>
            <v-col v-if="product.config.length > 0">
              <UploadImage @image="getImageData" />
              <draggable
                v-model="localProduct.config[tab - 1].images"
                :move="checkMove"
                @start="dragging = true"
                @end="dragging = false"
                item-key="id"
                class="dragArea list-group w-full grid-layout"
              >
                <template #item="{ element }">
                  <v-card max-width="160" max-height="250">
                    <v-img
                      :src="element.url"
                      max-width="100"
                      max-height="100"
                      aspect-ratio="1"
                    ></v-img>
                    <v-card-text>{{
                      productReponse.slug + "_config_" + tab + "_" + element.id
                    }}</v-card-text>
                    <v-card-actions
                      ><v-img
                        :src="trash"
                        max-width="24"
                        max-height="24"
                        class="img-list"
                        contain
                        @click="removeImage(element.id)"
                      ></v-img
                    ></v-card-actions>
                  </v-card>
                </template>
              </draggable>
            </v-col>
          </v-row>
          <v-btn
            type="submit"
            color="primary"
            @click="addConfiguration(tab - 1)"
            >Agregar configuracion</v-btn
          >
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script>
import UploadImage from "./UploadImage.vue";
import draggable from "vuedraggable";
import trash from "@/assets/trash.png";
import { configProduct } from "./productData.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
export default {
  data() {
    return {
      dragOptions: {
        animation: 150, // Adjust animation speed as needed
      },
      trash,
      dragging: false,
      configProduct,
      localProduct: { ...this.product },
      configLength: 0,
      tab: 0,
      isCreatingProductFinished: false,
      showAlert: false,
      showGreenAlert: false,
      alertText: "",
      greenAlertText: "",
    };
  },
  props: ["product", "productReponse"],
  components: {
    UploadImage,
    draggable,
  },
  methods: {
    createTabConfig() {
      var config = { ...this.configProduct };
      config.images = [];
      this.localProduct.config.push(config);
      this.configLength++;
      if (this.configLength === 1) {
        this.tab = 1;
      }
    },
    removeTabConfig() {
      //NECESITA REFINAMIENTO
      this.configLength--;
      const currTab = this.tab - 1;
      this.localProduct.config.splice(currTab, 1);
    },
    getImageData(data) {
      data.id = this.localProduct.config[this.tab - 1].images.length;
      this.localProduct.config[this.tab - 1].images.push(data);
    },
    removeImage(index) {
      if (
        this.localProduct.config[this.tab - 1] &&
        this.localProduct.config[this.tab - 1].images
      ) {
        if (
          index >= 0 &&
          index < this.localProduct.config[this.tab - 1].images.length
        ) {
          this.localProduct.config[this.tab - 1].images.splice(index, 1);
          var resetCount = 0;
          this.localProduct.config[this.tab - 1].images.forEach((i) => {
            i.id = resetCount++;
          });
        } else {
          console.log("no remove");
        }
      } else {
        console.log("todo false");
      }
    },
    checkMove: function (e) {
      window.console.log("Future index: " + e.draggedContext.futureIndex);
    },
    onUpload(slug, index, image, config) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const storageRef = ref(
          storage,
          `${slug}/config${config}_${slug}_index${index}`
        );

        uploadBytes(storageRef, image.image)
          .then(() => {
            getDownloadURL(storageRef)
              .then((url) => {
                console.log("URL de descarga de la imagen:", url);
                resolve(url); // Resuelve la promesa con la URL
              })
              .catch((error) => {
                console.error("Error al obtener la URL de descarga:", error);
                reject(error); // Rechaza la promesa con el error
              });
          })
          .catch((error) => {
            console.error("Error al cargar la imagen:", error);
            reject(error); // Rechaza la promesa con el error
          });
      });
    },
    uploadImagesToFirebase(slug, config, images) {
      const promises = images.map((image, index) =>
        this.onUpload(slug, config, image, index)
      );

      return Promise.all(promises);
    },
    async addConfiguration(config) {
      this.productReponse.slug;

      if (this.localProduct.config[config]) {
        const prom = await this.uploadImagesToFirebase(
          this.productReponse.slug,
          config,
          this.localProduct.config[config].images
        );
        if (prom.length > 0) {
          // this.localProduct.config[config].images = [];
          this.localProduct.config[config].images = prom.slice();

          axios
            .post(
              `api/v1/products/config/${this.productReponse._id}`,
              this.localProduct.config[config],
              {
                withCredentials: true,
              }
            )
            .then((responses) => {
              if (responses.data.status === "success") {
                console.log("paso agregar config product");
              }
            })
            .catch(() => {
              // console.error("Error creating product:", error);
              this.showAlert = true;
              this.alertText = "Error procesando la solicitud.";
            });
        }
      }
    },
  },
};
</script>
