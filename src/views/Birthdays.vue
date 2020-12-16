<template>
  <ion-page>
    <ion-content color="dark">
      <div class="w-full h-full p-9">
        <div class="w-full pb-5 flex justify-between items-center">
          <div class="text-3xl font-bold">Cumpleaños</div>
          <ion-icon size="large" :icon="addCircle" @click="add"></ion-icon>
        </div>
        <div class="w-full h-full">
          <div class="w-full h-full justify-center items-center flex flex-col" v-show="total < 1">
            <h1 class="text-6xl font-bold opacity-40 pb-1">Vacío!</h1>
            <h2 class="text-1xl font-normal opacity-75">Empieza añadiendo un cumpleaños.</h2>
            <h1 class="text-7xl font-bold opacity-40 -mt-5">...</h1>
          </div>
          <div class="w-full h-full">
            <ion-list class="bg-transparent">
              <ion-item v-for="(item, index) in list" :key="index" class="bg-transparent flex flex-col justify-center w-full">
                <ion-label>
                  <div class="w-full text-white text-xl font-semibold">{{ item.contact.name }}</div>
                  <div class="text-xs text-white w-full opacity-70 flex flex-col">
                    <div class="w-full flex items-center">
                      <ion-icon :icon="calendar" class="mr-2"></ion-icon>
                      <p class="block overflow-ellipsis overflow-hidden">{{ toLocal(item.date) }}</p>
                    </div>
                    <p class="block overflow-ellipsis overflow-hidden">{{ item.gifts.length || '' }} Regalo(s)</p>
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
              <div class="text-2xl font-bold text-white pb-10"> Crear nuevo cumpleaños</div>
              <div class="w-full flex flex-col justify-between" style="height: calc(100% - 4rem);">
                  <div class="w-full flex flex-col">
                  <ion-item color="dark">
                    <ion-label position="stacked">Contacto</ion-label>
                    <ion-select v-model="entity.contact" placeholder="Selecciona el contacto">
                      <ion-select-option v-for="(item, index) in contacts" :key="index" :value="item._id">{{ item.name }}</ion-select-option>
                    </ion-select>
                  </ion-item>
                  <ion-item color="dark">
                    <ion-label position="stacked">Regalos</ion-label>
                    <ion-select multiple="true" cancel-text="Cancelar" ok-text="Listo" v-model="entity.gifts" placeholder="Selecciona uno o varios regalos">
                      <ion-select-option v-for="(item, index) in gifts" :key="index" :value="item._id">{{ item.title }}</ion-select-option>
                    </ion-select>
                  </ion-item>
                  <ion-item color="dark">
                    <ion-label position="stacked">Fecha del cumpleaños</ion-label>
                    <ion-datetime v-model="entity.date" cancel-text="Cancelar" done-text="Ok" display-format="DD-MM-YY" placeholder="Seleccione fecha"></ion-datetime>
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
                    Añadir cumpleaños
                  </ion-button>
                </div>
              </div>
            </div>
          </Modal>
        </ion-modal>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonList, IonItem, IonLabel, IonIcon, IonModal, IonButton, IonSelect, IonSelectOption, IonDatetime, IonPage, IonContent } from '@ionic/vue';
import { call, addCircle, camera, calendar } from 'ionicons/icons';
import Modal from '@/components/Modal.vue';

export default  {
  name: 'Gifts',
  components: {
    IonList, IonItem, IonLabel, IonIcon, Modal, IonModal, IonButton, IonSelect, IonSelectOption, IonDatetime, IonPage, IonContent
  },
  setup() {
    return {
      call,
      addCircle,
      camera,
      calendar
    }
  },
  data: () => ({
    modalAdd: false,
    list: [],
    contacts: [],
    gifts: [],
    total: 0,
    page: 0,
    entity: {
      date: '',
      contact: '',
      gifts: ''
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
      const { data } = await this.axios.get('/birthdays?$populate[0]=contact');
      const { data: dataContacts } = await this.axios.get('/contacts');
      const { data: dataGifts } = await this.axios.get('/gifts');
      this.list = data.data;
      this.total = data.total;
      this.page = data.skip;
      this.contacts = dataContacts.data;
      this.gifts = dataGifts.data;
    },
    add() {
      this.modalAdd = true;
    },
    async save() {
      await this.axios.post('/birthdays', this.entity);
      await this.load();
      this.modalAdd = false;
    },
    toLocal(date) {
      const options = { month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(navigator.language, options);
    }
  }
}
</script>
