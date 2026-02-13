import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ELimitSettings } from '@common/models/pagination.model';
import { environment } from '@environments/environment';
import type {
  ICreateProductDto,
  IProduct,
  IProductListResponse,
  IUpdateProductDto,
} from '@products/models/product.model';
import type { Observable } from 'rxjs';

const API_PRODUCTS = `${environment.apiUrl}/products`;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http: HttpClient = inject(HttpClient);

  getAll(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(API_PRODUCTS);
  }

  getAllWithParams(
    limit: number = ELimitSettings.DEFAULT,
    offset = 0,
    term?: string,
  ): Observable<IProductListResponse> {
    const params: any = { limit, offset };
    if (term) params.term = term;
    return this.http.get<IProductListResponse>(API_PRODUCTS, { params });
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

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${API_PRODUCTS}/${id}`);
  }
}
