<template>
  <div class="w-full h-full p-9">
    <div class="w-full pb-5 flex justify-between items-center">
      <div class="text-3xl font-bold">Contactos</div>
      <ion-icon size="large" :icon="addCircle" @click="add"></ion-icon>
    </div>
    <div class="w-full h-full">
      <div class="w-full h-full justify-center items-center flex flex-col" v-show="total < 1">
        <h1 class="text-6xl font-bold opacity-40 pb-1">Vacío!</h1>
        <h2 class="text-1xl font-normal opacity-75">Empieza añadiendo un contacto.</h2>
        <h1 class="text-7xl font-bold opacity-40 -mt-5">...</h1>
      </div>
      <div class="w-full h-full">
        <ion-list class="bg-transparent">
          <ion-item v-for="(item, index) in contacts" :key="index" class="bg-transparent flex flex-col justify-center w-full">
            <ion-avatar style="width: 40px;">
              <img :alt="index" class="bg-cover h-full border-white border-4 rounded-full" :src="('photo' in item) ? `${hostname}/images/${item.photo.name}` : ''">
            </ion-avatar>
            <ion-label style="margin-left: 20px; width: calc(100% - 40px)">
              <div class="w-full text-white text-xl font-semibold">{{ item.name }}</div>
              <div class="text-xs text-white w-full opacity-70 flex items-center">
                <ion-icon :icon="call" class="mr-3" />
                <p class="overflow-ellipsis overflow-hidden"><a :href="`tel:${item.phone || ''}`">{{ item.phone || '' }}</a></p>
              </div>
            </ion-label>
          </ion-item>
        </ion-list>
      </div>
    </div>
    <ion-modal
        :is-open="modalNewContact"
        @onDidDismiss="modalNewContact = false"
      >
      <Modal>
        <div class="w-full h-full bg-black p-8">
          <div class="text-2xl font-bold text-white pb-10"> Crear nuevo contacto</div>
          <div class="w-full flex flex-col justify-between" style="height: calc(100% - 4rem);">
              <div class="w-full flex flex-col">
              <ion-item color="dark">
                <ion-label position="stacked">Nombre</ion-label>
                <ion-input
                    v-model="contact.name"
                    type="text"
                    autocorrect="on"
                    placeholder="John Doe"
                ></ion-input>
              </ion-item>
              <ion-item color="dark">
                <ion-label position="stacked">Correo electrónico</ion-label>
                <ion-input
                    v-model="contact.email"
                    type="email"
                    autocorrect="off"
                    inputmode="email"
                    pattern="email"
                    placeholder="john@email.com"
                    size="email"
                ></ion-input>
              </ion-item>
              <ion-item color="dark">
                <ion-label position="stacked">Número de teléfono</ion-label>
                <ion-input
                    v-model="contact.phone"
                    autocorrect="off"
                    placeholder="+56 9449 5682 18"
                ></ion-input>
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
                  @click="modalNewContact = false"
                  fill="clear"
                  class="bg-red-500 rounded text-white">
                Cancelar
              </ion-button>
              <ion-button
                  @click="saveContact"
                  fill="clear"
                  class="bg-green-500 rounded text-white">
                Crear contacto
              </ion-button>
            </div>
          </div>
        </div>
      </Modal>
    </ion-modal>
  </div>
</template>

<script>
import { IonList, IonItem, IonAvatar, IonLabel, IonIcon, IonModal, IonInput, IonButton } from '@ionic/vue';
import { call, addCircle, camera } from 'ionicons/icons';
import Modal from '@/components/Modal.vue';

export default  {
  name: 'Contacts',
  components: {
    IonAvatar, IonList, IonItem, IonLabel, IonIcon, Modal, IonModal, IonInput, IonButton
  },
  setup() {
    return {
      call,
      addCircle,
      camera
    }
  },
  data: () => ({
    modalNewContact: false,
    contacts: [],
    total: 0,
    page: 0,
    contact: {
      name: '',
      email: '',
      phone: '',
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
    await this.loadContacts();

  },
  methods: {
    async loadContacts() {
      const { data } = await this.axios.get('/contacts?$populate[0]=photo');
      this.contacts = data.data;
      this.total = data.total;
      this.page = data.skip;
    },
    add() {
      this.modalNewContact = true;
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
      this.contact.photo = result.data._id;
    },
    async saveContact() {
      const { name, email, photo, phone } = this.contact;
      const sendObject = {
        name,
        email,
        phone,
      };
      if (photo) sendObject.photo = photo;
      await this.axios.post('/contacts', sendObject);
      await this.loadContacts();
      this.modalNewContact = false;
    }
  }
}
</script>
