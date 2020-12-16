<template>
  <ion-page>
    <ion-content color="dark">
      <div class="w-full h-full p-9">
       <div class="w-full pb-10 flex justify-between items-center">
          <div class="text-3xl font-bold">Cuenta</div>
          <ion-icon size="large" :icon="logOut" @click="logout"></ion-icon>
        </div>
        <div class="w-full h-full">
          <div class="w-full flex items-center">
            <div
                :style='{ "background-image": `url("${hostname}/images/${img}")`, width: "80px", height: "80px"}'
                class="bg-cover border-white border-4 rounded-full bg-center"
                @click="takePhoto"
            ></div>
            <div class="ml-4">
              <div class="text-2xl font-bold">{{ name }}</div>
              <div class="text-sm font-normal">{{ email }}</div>
            </div>
          </div>
          <div class="w-full pt-10">
          <div class="border-gray-100 border-t p-2 pt-5 pb-5 flex items-center justify-between">
            <div>Total de cumpleaños en tu cuenta</div> <div class="font-semibold">{{total.birthdays}}</div>
          </div>
          <div class="border-gray-100 border-t p-2 pt-5 pb-5 flex items-center justify-between">
            <div>Total de contactos en tu cuenta</div> <div class="font-semibold">{{total.contacts}}</div>
          </div>
          <div class="border-gray-100 border-t p-2 pt-5 pb-5 flex items-center justify-between">
            <div>Total de gifts en tu cuenta</div> <div class="font-semibold">{{total.gifts}}</div>
          </div>
        </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonIcon, IonPage, IonContent } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { logOut } from 'ionicons/icons';

export default  {
  name: 'Account',
  components: {
    IonIcon,
    IonPage,
    IonContent
  },
  data: () => ({
    id: '',
    img: '',
    imgId: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    total: {
      birthdays: 0,
      contacts: 0,
      gifts: 0,
    }
  }),
  setup() {
    const router = useRouter();
    return {
      logOut,
      router
    };
  },
  async mounted() {
    const { value } = await this.$storage.get({ key: 'accessToken' });
    if (!value) return;
    this.axios.defaults.headers.common['Authorization'] = `Bearer ${value}`;
    await this.load();
    this.total.birthdays = await this.count('/birthdays');
    this.total.contacts = await this.count('/contacts');
    this.total.gifts = await this.count('/gifts');
  },
  computed: {
    hostname() {
      return this.$baseURL;
    }
  },
  methods: {
    async load() {
      const { value } = await this.$storage.get({ key: 'profile' });
      if (!value) return;
      const { photo, name, email, _id } = JSON.parse(value);
      this.name = name;
      this.email = email;
      this.id = _id;
      this.imgId = (typeof photo === 'object') ? photo._id : photo;
      this.img = (typeof photo === 'object') ? photo.name : photo;
      const result = (typeof photo === 'string') ? (await this.axios.get(`/files/${photo}`)).data : photo;
      this.img = result.name;
    },
    async logout() {
      await this.$storage.remove({ key: 'accessToken' });
      await this.router.push('/authenticate');
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
      this.img = result.data.name;
      this.imgId = result.data._id;
      await this.save();
    },
    async save() {
      const sendObject = {
        name: this.name,
        email: this.email,
        photo: this.imgId
      };
      if (this.password) sendObject.password = this.password;
      const result = await this.axios.patch(`/users/${this.id}`, sendObject);
      await this.$storage.set({ key: 'profile', value: JSON.stringify(result.data) });
    },
    async count(endpoint = '') {
      const response = await this.axios.get(`${endpoint}?$limit=0`);
      return response.data.total;
    }
  }

}
</script>
