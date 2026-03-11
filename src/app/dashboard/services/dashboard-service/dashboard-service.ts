import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import type { Observable } from 'rxjs';
import type {
  IDashboardSummary,
  ISalesOverTimeEntry,
  ITopProduct,
  IStockAlert,
  IStockByCategory,
} from '../../models/dashboard.model';

const API_DASHBOARD = `${environment.apiUrl}/dashboard`;

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http: HttpClient = inject(HttpClient);

  getSummary(): Observable<IDashboardSummary> {
    return this.http.get<IDashboardSummary>(`${API_DASHBOARD}/summary`);
  }

  getSalesOverTime(months = 6): Observable<ISalesOverTimeEntry[]> {
    const params = new HttpParams().set('months', months);
    return this.http.get<ISalesOverTimeEntry[]>(`${API_DASHBOARD}/sales-over-time`, { params });
  }

  getTopProducts(limit = 5): Observable<ITopProduct[]> {
    const params = new HttpParams().set('limit', limit);
    return this.http.get<ITopProduct[]>(`${API_DASHBOARD}/top-products`, { params });
  }

  getStockAlerts(): Observable<IStockAlert[]> {
    return this.http.get<IStockAlert[]>(`${API_DASHBOARD}/stock-alerts`);
  }

  getStockByCategory(): Observable<IStockByCategory[]> {
    return this.http.get<IStockByCategory[]>(`${API_DASHBOARD}/stock-by-category`);
  }
}
