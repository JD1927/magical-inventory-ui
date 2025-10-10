import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageHeader } from '@common/components';
import type { IProductFormResult } from '@products/components';
import type { ICreateProductDto } from '@products/models/product.model';
import { ProductDialogService, ProductService } from '@products/services';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-products-page',
  imports: [RouterOutlet, PageHeader, ButtonModule, DynamicDialogModule],
  providers: [ProductDialogService, DialogService],
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
  productService = inject(ProductService);

  onNewProduct(): void {
    this.productDialogService.openProductDialog();
    this.productDialogService.productDialogRef?.onClose.subscribe(
      ({ productId, createProductDto }: IProductFormResult) => {
        this.handleFormSubmit(productId, createProductDto);
      },
    );
  }

  handleFormSubmit(productId: string | undefined, createProductDto: ICreateProductDto): void {
    if (productId) {
      return;
    }
    this.createNewProduct(createProductDto);
  }

  createNewProduct(createProductDto: ICreateProductDto): void {
    this.productService.create(createProductDto).subscribe({
      next: (product) => {
        console.log('Product created:', product);
      },
      error: (error) => {
        console.error('Error creating product:', error);
      },
    });
  }
}
