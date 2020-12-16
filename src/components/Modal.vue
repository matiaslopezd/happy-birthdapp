<template>
  <ion-content class="w-full h-full">
    <slot></slot>
  </ion-content>
</template>

<script>
import { IonContent } from '@ionic/vue';

export default {
  name: 'Modal',
  components: { IonContent }
};
</script>
