import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import type { IProductListResponse } from '@products/models/product.model';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-products-table',
  imports: [CommonModule, TableModule, TagModule, ButtonModule, TooltipModule],
  templateUrl: './products-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsTable {
  productListResponse = input.required<IProductListResponse>();
  updateProduct = output<string>();
  deleteProduct = output<{ productId: string; event: Event }>();
  items = signal([
    {
      label: 'Options',
      items: [
        {
          label: 'Refresh',
          icon: 'pi pi-refresh',
        },
        {
          label: 'Export',
          icon: 'pi pi-upload',
        },
      ],
    },
  ]);

  onDelete(productId: string, event: Event): void {
    this.deleteProduct.emit({ productId, event });
  }
}
