import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { createNewProductApiEvents, getAllProductsApiEvents } from '@app/products/store';
import { PageHeader } from '@common/components';
import { Dispatcher, Events } from '@ngrx/signals/events';
import { ProductDialogService } from '@products/services';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-products-page',
  imports: [RouterOutlet, PageHeader, ButtonModule, DynamicDialogModule, TooltipModule],
  providers: [ProductDialogService, DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header title="Products" description="Manage your product inventory">
      <div class="ml-auto flex gap-2">
        <button type="button" pButton (click)="onNewProduct()" pTooltip="New Product">
          <i class="pi pi-plus" pButtonIcon></i>
          <span class="hidden md:inline-block" pButtonLabel>New Product</span>
        </button>
      </div>
    </app-page-header>
    <div class="card page-content">
      <router-outlet />
    </div>
  `,
})
export class ProductsPage {
  productDialogService = inject(ProductDialogService);
  dispatcher = inject(Dispatcher);
  events = inject(Events);

  constructor() {
    this.listenToCreationEvents();
  }

  onNewProduct(): void {
    this.productDialogService.openDialog();
  }

  private listenToCreationEvents(): void {
    // Move subscription to constructor for proper injection context
    this.events
      .on(createNewProductApiEvents.createdSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        // Refresh product list and close dialog
        this.dispatcher.dispatch(getAllProductsApiEvents.load());
        this.productDialogService.closeDialog();
      });

    this.events
      .on(createNewProductApiEvents.createdFailure)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload }) => {
        console.error(payload);
      });
  }
}
