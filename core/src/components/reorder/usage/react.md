```tsx
import React from 'react';
import { IonIcon, IonItem, IonLabel, IonReorder, IonReorderGroup, IonContent } from '@ionic/react';
import { pizza } from 'ionicons/icons';

export const ReorderExample: React.FC = () => (
  <IonContent>
    {/*-- The reorder gesture is disabled by default, enable it to drag and drop items --*/}
    <IonReorderGroup disabled={false}>
      {/*-- Default reorder icon, end aligned items --*/}
      <IonItem>
        <IonLabel>Item 1</IonLabel>
        <IonReorder slot="end" />
      </IonItem>

      <IonItem>
        <IonLabel>Item 2</IonLabel>
        <IonReorder slot="end" />
      </IonItem>

      {/*-- Default reorder icon, start aligned items --*/}
      <IonItem>
        <IonReorder slot="start" />
        <IonLabel>Item 3</IonLabel>
      </IonItem>

      <IonItem>
        <IonReorder slot="start" />
        <IonLabel>Item 4</IonLabel>
      </IonItem>

      {/*-- Custom reorder icon end items --*/}
      <IonItem>
        <IonLabel>Item 5</IonLabel>
        <IonReorder slot="end">
          <IonIcon icon={pizza} />
        </IonReorder>
      </IonItem>

      <IonItem>
        <IonLabel>Item 6</IonLabel>
        <IonReorder slot="end">
          <IonIcon icon={pizza} />
        </IonReorder>
      </IonItem>

      {/*-- Items wrapped in a reorder, entire item can be dragged --*/}
      <IonReorder>
        <IonItem>
          <IonLabel>Item 7</IonLabel>
        </IonItem>
      </IonReorder>

      <IonReorder>
        <IonItem>
          <IonLabel>Item 8</IonLabel>
        </IonItem>
      </IonReorder>
    </IonReorderGroup>
  </IonContent>
);
```
