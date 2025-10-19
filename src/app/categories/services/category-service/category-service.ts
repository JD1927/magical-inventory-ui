import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type {
  ICategory,
  ICreateCategoryDto,
  IUpdateCategoryDto,
} from '@categories/models/category.model';
import { environment } from '@environments/environment';
import type { Observable } from 'rxjs';

const API_CATEGORIES = `${environment.apiUrl}/categories`;

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http: HttpClient = inject(HttpClient);

  getAllCategories(isMain?: boolean): Observable<ICategory[]> {
    let params = new HttpParams();
    if (isMain !== undefined) {
      params = params.set('isMain', isMain.toString());
    }
    return this.http.get<ICategory[]>(API_CATEGORIES, { params });
  }

  getById(id: string): Observable<ICategory> {
    return this.http.get<ICategory>(`${API_CATEGORIES}/${id}`);
  }

  create(dto: ICreateCategoryDto): Observable<ICategory> {
    return this.http.post<ICategory>(API_CATEGORIES, dto);
  }

  update(id: string, dto: IUpdateCategoryDto): Observable<ICategory> {
    return this.http.patch<ICategory>(`${API_CATEGORIES}/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete(`${API_CATEGORIES}/${id}`);
  }
}
