import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import type { ICreateProductDto, IProduct, IUpdateProductDto } from '../../models/product.model';

const PAGE_LIMIT = 15;
const INITIAL_OFFSET = 0;
const API_PRODUCTS = `${environment.apiUrl}/products`;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http: HttpClient = inject(HttpClient);

  getAll(limit: number = PAGE_LIMIT, offset: number = INITIAL_OFFSET): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(API_PRODUCTS, { params: { limit, offset } });
  }

  getById(id: string): Observable<IProduct> {
    return this.http.get<IProduct>(`${API_PRODUCTS}/${id}`);
  }

  create(dto: ICreateProductDto): Observable<IProduct> {
    return this.http.post<IProduct>(API_PRODUCTS, dto);
  }

  update(id: string, dto: IUpdateProductDto): Observable<IProduct> {
    return this.http.patch<IProduct>(`${API_PRODUCTS}/${id}`, dto);
  }

  delete(id: string): void {
    this.http.delete(`${API_PRODUCTS}/${id}`);
  }
}
