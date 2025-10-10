import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { TruncatePipe } from '@common/pipes';
import type { IProduct } from '@products/models/product.model';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-products-table',
  imports: [CommonModule, TableModule, TruncatePipe, TagModule],
  templateUrl: './products-table.html',
})
export class ProductsTable {
  products = input.required<IProduct[]>();
}
