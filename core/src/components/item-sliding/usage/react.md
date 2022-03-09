```tsx
import React from 'react';
import { IonList, IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption, IonIcon, IonNote } from '@ionic/react';

import { heart, trash, star, archive, ellipsisHorizontal, ellipsisVertical } from 'ionicons/icons';

export const ItemSlidingExample: React.FC = () => (
<IonList>
  {/* Sliding item with text options on both sides */}
  <IonItemSliding>
    <IonItemOptions side="start">
      <IonItemOption onClick={() => console.log('favorite clicked')}>Favorite</IonItemOption>
      <IonItemOption color="danger" onClick={() => console.log('share clicked')}>Share</IonItemOption>
    </IonItemOptions>

    <IonItem>
      <IonLabel>Item Options</IonLabel>
    </IonItem>

    <IonItemOptions side="end">
      <IonItemOption onClick={() => console.log('unread clicked')}>Unread</IonItemOption>
    </IonItemOptions>
  </IonItemSliding>

  {/* Sliding item with expandable options on both sides */}
  <IonItemSliding>
    <IonItemOptions side="start">
      <IonItemOption color="danger" expandable>
        Delete
      </IonItemOption>
    </IonItemOptions>

    <IonItem>
      <IonLabel>Expandable Options</IonLabel>
    </IonItem>

    <IonItemOptions side="end">
      <IonItemOption color="tertiary" expandable>
        Archive
      </IonItemOption>
    </IonItemOptions>
  </IonItemSliding>

  {/* Multi-line sliding item with icon options on both sides */}
  <IonItemSliding id="item100">
    <IonItem href="#">
      <IonLabel>
        <h2>HubStruck Notifications</h2>
        <p>A new message in your network</p>
        <p>Oceanic Next has joined your network</p>
      </IonLabel>
      <IonNote slot="end">
        10:45 AM
      </IonNote>
    </IonItem>

    <IonItemOptions side="start">
      <IonItemOption>
        <IonIcon slot="icon-only" icon={heart} />
      </IonItemOption>
    </IonItemOptions>

    <IonItemOptions side="end">
      <IonItemOption color="danger">
        <IonIcon slot="icon-only" icon={trash} />
      </IonItemOption>
      <IonItemOption>
        <IonIcon slot="icon-only" icon={star} />
      </IonItemOption>
    </IonItemOptions>
  </IonItemSliding>

  {/* Sliding item with icon start options on end side */}
  <IonItemSliding>
    <IonItem>
      <IonLabel>
        Sliding Item, Icons Start
      </IonLabel>
    </IonItem>
    <IonItemOptions>
      <IonItemOption color="primary">
        <IonIcon slot="start" ios={ellipsisHorizontal} md={ellipsisVertical}></IonIcon>
        More
      </IonItemOption>
      <IonItemOption color="secondary">
        <IonIcon slot="start" icon={archive} />
        Archive
      </IonItemOption>
    </IonItemOptions>
  </IonItemSliding>

  {/* Sliding item with icon end options on end side */}
  <IonItemSliding>
    <IonItem>
      <IonLabel>
        Sliding Item, Icons End
      </IonLabel>
    </IonItem>
    <IonItemOptions>
      <IonItemOption color="primary">
        <IonIcon slot="end" ios={ellipsisHorizontal} md={ellipsisVertical}></IonIcon>
        More
      </IonItemOption>
      <IonItemOption color="secondary">
        <IonIcon slot="end" icon={archive} />
        Archive
      </IonItemOption>
    </IonItemOptions>
  </IonItemSliding>

  {/* Sliding item with icon top options on end side */}
  <IonItemSliding>
    <IonItem>
      <IonLabel>
        Sliding Item, Icons Top
      </IonLabel>
    </IonItem>
    <IonItemOptions>
      <IonItemOption color="primary">
        <IonIcon slot="top" ios={ellipsisHorizontal} md={ellipsisVertical}></IonIcon>
        More
      </IonItemOption>
      <IonItemOption color="secondary">
        <IonIcon slot="top" icon={archive} />
        Archive
      </IonItemOption>
    </IonItemOptions>
  </IonItemSliding>

  {/* Sliding item with icon bottom options on end side */}
  <IonItemSliding>
    <IonItem>
      <IonLabel>
        Sliding Item, Icons Bottom
      </IonLabel>
    </IonItem>
    <IonItemOptions>
      <IonItemOption color="primary">
        <IonIcon slot="bottom" ios={ellipsisHorizontal} md={ellipsisVertical}></IonIcon>
        More
      </IonItemOption>
      <IonItemOption color="secondary">
        <IonIcon slot="bottom" icon={archive} />
        Archive
      </IonItemOption>
    </IonItemOptions>
  </IonItemSliding>
</IonList>
);
```
