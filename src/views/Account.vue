<template>
  <div class="w-full h-full p-9">
   <div class="w-full pb-5 flex justify-between items-center">
      <div class="text-3xl font-bold">Cuenta</div>
      <ion-icon size="large" :icon="logOut" @click="logout"></ion-icon>
    </div>
    <div class="w-full h-full">

    </div>
  </div>
</template>

<script>
import { IonIcon } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { logOut } from 'ionicons/icons';

export default  {
  name: 'Account',
  components: {
    IonIcon
  },
  data: () => ({

  }),
  setup() {
    const router = useRouter();
    return {
      logOut,
      router
    };
  },
  methods: {
    async logout() {
      await this.$storage.remove({ key: 'accessToken' });
      await this.router.push('/authenticate');
    }
  }

}
</script>
