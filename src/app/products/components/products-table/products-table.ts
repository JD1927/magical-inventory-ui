import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { TruncatePipe } from '@common/pipes';
import type { IProduct } from '@products/models/product.model';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-products-table',
  imports: [CommonModule, TableModule, TruncatePipe, TagModule, Button],
  templateUrl: './products-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsTable {
  products = input.required<IProduct[]>();
  deleteProduct = output<string>();
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
}
