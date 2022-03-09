```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'reorder-group-example',
  styleUrl: 'reorder-group-example.css'
})
export class ReorderGroupExample {
  doReorder(ev: any) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  }

  render() {
    return [
      // The reorder gesture is disabled by default, enable it to drag and drop items
      <ion-reorder-group onIonItemReorder={(ev) => this.doReorder(ev)} disabled={false}>
        {/* Default reorder icon, end aligned items */}
        <ion-item>
          <ion-label>
            Item 1
          </ion-label>
          <ion-reorder slot="end"></ion-reorder>
        </ion-item>

        <ion-item>
          <ion-label>
            Item 2
          </ion-label>
          <ion-reorder slot="end"></ion-reorder>
        </ion-item>

        {/* Default reorder icon, start aligned items */}
        <ion-item>
          <ion-reorder slot="start"></ion-reorder>
          <ion-label>
            Item 3
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-reorder slot="start"></ion-reorder>
          <ion-label>
            Item 4
          </ion-label>
        </ion-item>

        {/* Custom reorder icon end items */}
        <ion-item>
          <ion-label>
            Item 5
          </ion-label>
          <ion-reorder slot="end">
            <ion-icon name="pizza"></ion-icon>
          </ion-reorder>
        </ion-item>

        <ion-item>
          <ion-label>
            Item 6
          </ion-label>
          <ion-reorder slot="end">
            <ion-icon name="pizza"></ion-icon>
          </ion-reorder>
        </ion-item>

        {/* Items wrapped in a reorder, entire item can be dragged */}
        <ion-reorder>
          <ion-item>
            <ion-label>
              Item 7
            </ion-label>
          </ion-item>
        </ion-reorder>

        <ion-reorder>
          <ion-item>
            <ion-label>
              Item 8
            </ion-label>
          </ion-item>
        </ion-reorder>
      </ion-reorder-group>
    ]
  }
}
```

### Updating Data

```tsx
import { Component, State, h } from '@stencil/core';

@Component({
  tag: 'reorder-group-example',
  styleUrl: 'reorder-group-example.css'
})
export class ReorderGroupExample {
  @State() items = [1, 2, 3, 4, 5];

  doReorder(ev: any) {
    // Before complete is called with the items they will remain in the
    // order before the drag
    console.log('Before complete', this.items);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. Update the items variable to the
    // new order of items
    this.items = ev.detail.complete(this.items);

    // After complete is called the items will be in the new order
    console.log('After complete', this.items);
  }

  render() {
    return [
      // The reorder gesture is disabled by default, enable it to drag and drop items
      <ion-reorder-group onIonItemReorder={(ev) => this.doReorder(ev)} disabled={false}>

        {this.items.map(item =>
          <ion-item>
            <ion-label>
              Item { item }
            </ion-label>
            <ion-reorder slot="end"></ion-reorder>
          </ion-item>
        )}

      </ion-reorder-group>
    ]
  }
}
```