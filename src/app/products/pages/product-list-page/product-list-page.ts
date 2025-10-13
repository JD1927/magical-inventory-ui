import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Dispatcher, Events } from '@ngrx/signals/events';
import { ProductsTable } from '@products/components';
import {
  deleteProductApiEvents,
  DeleteProductStore,
  getAllProductsApiEvents,
  ProductsStore,
} from '@products/store';

@Component({
  selector: 'app-product-list-page',
  imports: [CommonModule, ProductsTable],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListPage {
  productsStore = inject(ProductsStore);
  deleteProductStore = inject(DeleteProductStore);
  dispatcher = inject(Dispatcher);
  events = inject(Events);

  constructor() {
    this.dispatcher.dispatch(getAllProductsApiEvents.load());
    effect(() => {
      const errorMessage = this.productsStore.errorMessage();
      if (errorMessage) {
        console.error('Error loading products:', errorMessage);
      }
    });
    this.listenToProductListChanges();
  }

  listenToProductListChanges(): void {
    this.events
      .on(deleteProductApiEvents.deletedSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.dispatcher.dispatch(getAllProductsApiEvents.load());
      });
  }

  onDeleteProduct(productId: string): void {
    this.dispatcher.dispatch(deleteProductApiEvents.delete(productId));
  }
}
