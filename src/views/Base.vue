<template>
  <ion-page>
    <ion-tabs>
      <ion-tab-bar slot="bottom" color="dark" :selectedTab="tab">
        <ion-tab-button tab="birthdays" href="/user/birthdays">
          <ion-icon :icon="alarmOutline" />
          <ion-label>Cumpleaños</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="contacts" href="/user/contacts">
          <ion-icon :icon="peopleCircleOutline" />
          <ion-label>Contactos</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="gifts" href="/user/gifts">
          <ion-icon :icon="giftOutline" />
          <ion-label>Regalos</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="account" href="/user/account">
          <ion-icon :icon="personCircleOutline" />
          <ion-label>Cuenta</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage } from '@ionic/vue';
import { ellipse, square, triangle, alarmOutline, peopleCircleOutline, personCircleOutline, giftOutline } from 'ionicons/icons';

export default {
  name: 'Tabs',
  components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage },
  setup() {
    return {
      ellipse,
      square,
      triangle,
      alarmOutline,
      peopleCircleOutline,
      personCircleOutline,
      giftOutline,
    }
  },
  data: () => ({
    tab: 'contacts',
  }),
  async mounted() {
    const { value } = await this.$storage.get({ key: 'accessToken' });
    if (!value) return;
    this.axios.defaults.headers.common['Authorization'] = `Bearer ${value}`;
  },
}
</script>
