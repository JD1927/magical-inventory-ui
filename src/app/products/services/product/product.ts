import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import type { CreateProductDto } from '../../dto/create-product.dto';
import type { UpdateProductDto } from '../../dto/update-product.dto';
import type { IProduct } from '../../models/product.model';

const PAGE_LIMIT = 10;

const API_PRODUCTS = `${environment.apiUrl}/products`;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);

  getAll(limit = PAGE_LIMIT, offset = 0) {
    return this.http.get<IProduct[]>(API_PRODUCTS, { params: { limit, offset } });
  }

  getById(id: string) {
    return this.http.get<IProduct>(`${API_PRODUCTS}/${id}`);
  }

  create(dto: CreateProductDto) {
    return this.http.post<IProduct>(API_PRODUCTS, dto);
  }

  update(id: string, dto: UpdateProductDto) {
    return this.http.patch<IProduct>(`${API_PRODUCTS}/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete(`${API_PRODUCTS}/${id}`);
  }
}
