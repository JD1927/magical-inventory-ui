import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TruncatePipe } from '../../../common/pipes';
import type { IProduct } from '../../models/product.model';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-products-table',
  imports: [CommonModule, TableModule, TruncatePipe, TagModule],
  templateUrl: './products-table.html',
})
export class ProductsTable {
  products = input.required<IProduct[]>();
}
