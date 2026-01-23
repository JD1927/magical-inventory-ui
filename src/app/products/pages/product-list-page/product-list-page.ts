import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductDialogService } from '@app/products/services';
import { Dispatcher, Events } from '@ngrx/signals/events';
import { ProductsTable } from '@products/components';
import {
  deleteProductApiEvents,
  DeleteProductStore,
  getAllProductsApiEvents,
  ProductsStore,
  updateProductApiEvents,
} from '@products/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-product-list-page',
  imports: [CommonModule, ProductsTable, CardModule, ToastModule, ConfirmDialogModule],
  template: `
    <app-products-table
      [productListResponse]="productsStore.productListResponse()"
      (updateProduct)="onUpdateProduct($event)"
      (deleteProduct)="onDeleteProduct($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListPage implements OnInit {
  productsStore = inject(ProductsStore);
  deleteProductStore = inject(DeleteProductStore);
  dispatcher = inject(Dispatcher);
  events = inject(Events);
  productDialogService = inject(ProductDialogService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  constructor() {
    effect(() => {
      const errorMessage = this.productsStore.errorMessage();
      if (errorMessage) {
        console.error('Error loading products:', errorMessage);
      }
    });
    this.listenToProductListChanges();
  }

  ngOnInit(): void {
    this.dispatcher.dispatch(getAllProductsApiEvents.load());
  }

  private listenToProductListChanges(): void {
    this.events
      .on(deleteProductApiEvents.deletedSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload: successMessage }) => {
        this.confirmationService.close();
        this.messageService.add({
          severity: 'success',
          summary: 'Delete Operation',
          detail: successMessage,
        });
        this.dispatcher.dispatch(getAllProductsApiEvents.load());
      });
    this.events
      .on(deleteProductApiEvents.deletedFailure)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload: errorMessage }) => {
        this.confirmationService.close();
        this.messageService.add({
          severity: 'error',
          summary: 'Delete Operation',
          detail: errorMessage,
        });
        this.dispatcher.dispatch(getAllProductsApiEvents.load());
      });
    this.events
      .on(updateProductApiEvents.updatedSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload: product }) => {
        // Refresh product list and close dialog
        this.dispatcher.dispatch(getAllProductsApiEvents.load());
        this.messageService.add({
          severity: 'success',
          summary: 'Update Operation',
          detail: `${product.name} was updated successfully!`,
        });
        this.productDialogService.closeDialog();
      });

    this.events
      .on(updateProductApiEvents.updatedFailure)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload }) => {
        console.error(payload);
      });
  }

  onUpdateProduct(productId: string): void {
    this.productDialogService.openDialog(productId);
  }

  onDeleteProduct({ productId, event }: { productId: string; event: Event }): void {
    const result = this.productDialogService.openDeleteConfirmationDialog(event);
    // Handle confirmation response
    result.subscribe((isConfirmation: boolean) => {
      if (!isConfirmation) return;
      this.dispatcher.dispatch(deleteProductApiEvents.delete(productId));
    });
  }
}
