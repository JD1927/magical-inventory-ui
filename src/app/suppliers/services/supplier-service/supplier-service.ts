import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import type {
  ICreateSupplierDto,
  ISupplier,
  IUpdateSupplierDto,
} from '@suppliers/models/supplier.model';
import type { Observable } from 'rxjs';

const API_SUPPLIERS = `${environment.apiUrl}/suppliers`;

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private http: HttpClient = inject(HttpClient);

  getAllSuppliers(): Observable<ISupplier[]> {
    return this.http.get<ISupplier[]>(API_SUPPLIERS);
  }

  getById(id: string): Observable<ISupplier> {
    return this.http.get<ISupplier>(`${API_SUPPLIERS}/${id}`);
  }

  create(dto: ICreateSupplierDto): Observable<ISupplier> {
    return this.http.post<ISupplier>(API_SUPPLIERS, dto);
  }

  update(id: string, dto: IUpdateSupplierDto): Observable<ISupplier> {
    return this.http.patch<ISupplier>(`${API_SUPPLIERS}/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete(`${API_SUPPLIERS}/${id}`);
  }
}
