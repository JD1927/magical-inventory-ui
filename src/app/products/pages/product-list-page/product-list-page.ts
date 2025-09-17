import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product-service/product-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-product-list-page',
  imports: [CommonModule, TableModule],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.css',
})
export class ProductListPage {
  productService = inject(ProductService);

  products = toSignal(this.productService.getAll(), { initialValue: [] });
}
