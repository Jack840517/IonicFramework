```html
<template>
  <ion-content>

    <!-- Fixed Floating Action Button that does not scroll with the content -->
    <ion-fab slot="fixed">
      <ion-fab-button>Button</ion-fab-button>
    </ion-fab>

    <!-- Default Floating Action Button that scrolls with the content.-->
    <ion-fab-button>Default</ion-fab-button>

    <!-- Mini -->
    <ion-fab-button size="small">Mini</ion-fab-button>

    <!-- Colors -->
    <ion-fab-button color="primary">Primary</ion-fab-button>
    <ion-fab-button color="secondary">Secondary</ion-fab-button>
    <ion-fab-button color="danger">Danger</ion-fab-button>
    <ion-fab-button color="light">Light</ion-fab-button>
    <ion-fab-button color="dark">Dark</ion-fab-button>

  </ion-content>
</template>

<script>
import { IonContent, IonFab, IonFabButton } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { IonContent, IonFab, IonFabButton }
});
</script>
```
