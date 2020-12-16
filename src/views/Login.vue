<template>
  <div class="login-container -mt-10">
    <img alt="upper-logo" :src="require('@/images/upper-logo.png')" style="width: 90px;" class="pb-4"/>
    <img alt="logo" :src="require('@/images/HappyBirthapp.svg')" class="pb-2"/>
    <p class="text-xs pb-10">Nunca vuelvas a olvidar un cumpleaños.</p>
    <div class="overflow-hidden rounded-md pb-5">
      <ion-item color="dark">
        <ion-label position="stacked">Correo electrónico</ion-label>
        <ion-input
            v-model="email"
            type="email"
            autocorrect="off"
            inputmode="email"
            pattern="email"
            placeholder="john@email.com"
            size="email"
        ></ion-input>
      </ion-item>
      <ion-item color="dark">
          <ion-label position="stacked">Contraseña</ion-label>
          <ion-input
              v-model="password"
              type="password"
              autocorrect="off"
              placeholder="***********"
          ></ion-input>
        </ion-item>
    </div>
    <ion-button
        @click="authenticate"
        fill="clear"
        style="max-width: 250px;"
        class="w-full bg-purple-600 rounded text-white">
      Acceder
    </ion-button>
    <ion-alert
      :is-open="alert"
      header="Ooops!"
      message="Correo electrónico o contraseña, inválido."
      :buttons="['Ok']"
      @onDidDismiss="alert = false"
    >
    </ion-alert>
  </div>
</template>

<script>
import { IonItem, IonInput, IonLabel, IonButton, IonAlert } from '@ionic/vue';
import { useRouter } from 'vue-router';

export default  {
  name: 'Login',
  components: { IonItem, IonInput, IonLabel, IonButton, IonAlert },
  data: () => ({
    email: '',
    password: '',
    alert: false
  }),
  setup() {
    const router = useRouter();
    return { router };
  },
  async mounted() {
    const { value } = await this.$storage.get({ key: 'accessToken' });
    if (value) return this.router.push('/user/birthdays');
    const { value: userStored } = await this.$storage.get({ key: 'profile' });
    if (!userStored) return;
    const { email } = JSON.parse(userStored);
    this.email = email;
  },
  methods: {
    async authenticate() {
      try {
        const response = await this.axios.post('/auth/login', { strategy: 'local', email: this.email, password: this.password });
        const { accessToken, user } = response.data;
        this.axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        this.$storage.set({ key: 'accessToken', value: accessToken });
        this.$storage.set({ key: 'profile', value: JSON.stringify(user) });
        await this.$toast.show({text: 'Sesión iniciada'});
        await this.router.push('/user/birthdays');
      } catch (e) {
        this.alert = true;
        this.password = '';
      }
    }
  },
}
</script>

<style>
.login-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 5%;
}
</style>
