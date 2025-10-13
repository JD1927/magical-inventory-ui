import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageHeader } from '@common/components';
import { ProductDialogService } from '@products/services';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-products-page',
  imports: [RouterOutlet, PageHeader, ButtonModule, DynamicDialogModule],
  providers: [ProductDialogService, DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header title="Products" description="Manage your product inventory">
      <div class="ml-auto flex gap-2">
        <p-button label="New Product" icon="pi pi-plus" (onClick)="onNewProduct()" />
      </div>
    </app-page-header>
    <div class="card">
      <router-outlet />
    </div>
  `,
})
export class ProductsPage {
  productDialogService = inject(ProductDialogService);

  onNewProduct(): void {
    this.productDialogService.openProductDialog();
  }
}
