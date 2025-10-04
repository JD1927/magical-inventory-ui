import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, untracked } from '@angular/core';
import type { IPaginationDto } from '../../../common/models/pagination.model';
import { ProductsTable } from '../../components';
import type { IProduct } from '../../models/product.model';
import { PAGE_LIMIT, ProductService } from '../../services/product-service/product-service';

@Component({
  selector: 'app-product-list-page',
  imports: [CommonModule, ProductsTable],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.css',
})
export class ProductListPage {
  productService = inject(ProductService);
  products = signal<IProduct[]>([]);
  pagination = signal<IPaginationDto>({ limit: PAGE_LIMIT, offset: 0 });

  constructor() {
    effect(() => {
      const pagination = this.pagination();

      untracked(() => {
        this.getAllProducts(pagination);
      });
    });
  }

  getAllProducts(pagination: IPaginationDto): void {
    // Pagination DTO
    const { limit, offset } = pagination;
    // Get all products by pagination
    this.productService.getAll(limit, offset).subscribe({
      next: (products: IProduct[]) => {
        this.products.set([...products]);
      },
      error: (err: any) => {
        console.log('🚀 ~ ProductListPage ~ getAllProducts ~ err:', err);
      },
    });
  }
}
