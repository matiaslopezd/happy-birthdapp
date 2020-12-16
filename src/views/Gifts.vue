<template>
  <div class="w-full h-full p-9">
    <div class="w-full pb-5 flex justify-between items-center">
      <div class="text-3xl font-bold">Regalos</div>
      <ion-icon size="large" :icon="addCircle" @click="add"></ion-icon>
    </div>
    <div class="w-full h-full">
      <div class="w-full h-full justify-center items-center flex flex-col" v-show="total < 1">
        <h1 class="text-6xl font-bold opacity-40 pb-1">Vacío!</h1>
        <h2 class="text-1xl font-normal opacity-75">Empieza añadiendo un regalo.</h2>
        <h1 class="text-7xl font-bold opacity-40 -mt-5">...</h1>
      </div>
      <div class="w-full h-full">
        <ion-list class="bg-transparent">
          <ion-item v-for="(item, index) in list" :key="index" class="bg-transparent flex flex-col justify-center w-full">
            <ion-avatar style="width: 40px;">
              <img :alt="index" class="bg-cover h-full border-white border-4 rounded-full" :src="('photo' in item) ? `${hostname}/images/${item.photo.name}` : ''">
            </ion-avatar>
            <ion-label style="margin-left: 20px; width: calc(100% - 40px)">
              <div class="w-full text-white text-xl font-semibold">{{ item.title }}</div>
              <div class="text-xs text-white w-full opacity-70">
                <p class="block overflow-ellipsis overflow-hidden underline"><a :href="item.url || ''" target="_blank">{{ item.url || '' }}</a></p>
                <p class="overflow-ellipsis overflow-hidden flex items-center">
                  <ion-icon :icon="chevronForward"></ion-icon>
                  {{ item.description || '' }}
                </p>
              </div>
            </ion-label>
          </ion-item>
        </ion-list>
      </div>
    </div>
    <ion-modal
        :is-open="modalAdd"
        @onDidDismiss="modalAdd = false"
      >
      <Modal>
        <div class="w-full h-full bg-black p-8">
          <div class="text-2xl font-bold text-white pb-10"> Crear nuevo regalo</div>
          <div class="w-full flex flex-col justify-between" style="height: calc(100% - 4rem);">
              <div class="w-full flex flex-col">
              <ion-item color="dark">
                <ion-label position="stacked">Título</ion-label>
                <ion-input
                    v-model="entity.title"
                    type="text"
                    autocorrect="on"
                    placeholder="Chocolates Italianos-Franceses"
                ></ion-input>
              </ion-item>
              <ion-item color="dark">
                <ion-label position="stacked">URL</ion-label>
                <ion-input
                    v-model="entity.url"
                    type="url"
                    autocorrect="off"
                    inputmode="url"
                    pattern="url"
                    placeholder="https://store.com/product/34343..."
                    size="url"
                ></ion-input>
              </ion-item>
              <ion-item color="dark">
                <ion-label position="stacked">Descripción</ion-label>
                <ion-textarea
                    v-model="entity.description"
                    autocorrect="off"
                    placeholder="Tienen almendras y avellanas."
                ></ion-textarea>
              </ion-item>
              <ion-item color="dark">
                <ion-label position="stacked">Foto</ion-label>
                <ion-button
                  @click="takePhoto"
                  class="w-full"
                  size="large"
                  fill="dark">
                  <ion-icon class="text-white mr-4" :icon="camera"></ion-icon><div class="text-xl text-white font-semibold">Subir foto</div>
              </ion-button>
              </ion-item>
            </div>
            <div class="w-full flex justify-between items-center">
              <ion-button
                  @click="modalAdd = false"
                  fill="clear"
                  class="bg-red-500 rounded text-white">
                Cancelar
              </ion-button>
              <ion-button
                  @click="save"
                  fill="clear"
                  class="bg-green-500 rounded text-white">
                Añadir regalo
              </ion-button>
            </div>
          </div>
        </div>
      </Modal>
    </ion-modal>
  </div>
</template>

<script>
import { IonList, IonItem, IonAvatar, IonLabel, IonIcon, IonModal, IonInput, IonButton, IonTextarea } from '@ionic/vue';
import { call, addCircle, camera, chevronForward } from 'ionicons/icons';
import Modal from '@/components/Modal.vue';

export default  {
  name: 'Gifts',
  components: {
    IonAvatar, IonList, IonItem, IonLabel, IonIcon, Modal, IonModal, IonInput, IonButton, IonTextarea
  },
  setup() {
    return {
      call,
      addCircle,
      camera,
      chevronForward
    }
  },
  data: () => ({
    modalAdd: false,
    list: [],
    total: 0,
    page: 0,
    entity: {
      title: '',
      url: '',
      description: '',
      photo: '',
    }
  }),
  computed: {
    hostname() {
      return this.$baseURL;
    }
  },
  async mounted() {
    const { value } = await this.$storage.get({ key: 'accessToken' });
    if (!value) return;
    this.axios.defaults.headers.common['Authorization'] = `Bearer ${value}`;
    await this.load();

  },
  methods: {
    async load() {
      const { data } = await this.axios.get('/gifts?$populate[0]=photo');
      this.list = data.data;
      this.total = data.total;
      this.page = data.skip;
    },
    add() {
      this.modalAdd = true;
    },
    async takePhoto() {
      function DataURIToBlob(dataURI) {
        const splitDataURI = dataURI.split(',')
        const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
        const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

        const ia = new Uint8Array(byteString.length)
        for (let i = 0; i < byteString.length; i++)
            ia[i] = byteString.charCodeAt(i)

        return new Blob([ia], { type: mimeString })
      }


      const image = await this.$camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: this.$cameraResultType.DataUrl
      });
      // image.webPath will contain a path that can be set as an image src.
      // You can access the original file using image.path, which can be
      // passed to the Filesystem API to read the raw data of the image,
      // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
      const formData = new FormData();
      formData.append('img', DataURIToBlob(image.dataUrl), 'image.jpg');
      const result = await this.axios.post('/files', formData, { headers: { 'content-type': 'multipart/form-data' } });
      this.entity.photo = result.data._id;
    },
    async save() {
      const { title, url, description, photo } = this.entity;
      const sendObject = {
        title,
        url,
        description
      };
      if (photo) sendObject.photo = photo;
      await this.axios.post('/gifts', sendObject);
      await this.load();
      this.modalAdd = false;
    }
  }
}
</script>
