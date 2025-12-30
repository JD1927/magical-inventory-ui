import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import type {
  ICreateInInventoryMovementDto,
  ICreateInventoryMovementResult,
  ICreateOutInventoryMovementDto,
  IInventoryMovement,
  IInventoryMovementQueryDto,
  IInventoryMovementsResponse,
  IInventoryRecord,
} from '@inventory/models/inventory.model';
import type { Observable } from 'rxjs';

const API_INVENTORY = `${environment.apiUrl}/inventory`;

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private http: HttpClient = inject(HttpClient);

  // getProfitReport(): Observable<IInventoryItem[]> {
  //   return this.http.get<IInventoryItem[]>(`${API_INVENTORY}/profit-report`);
  // }

  getAllInventoryRecords(): Observable<IInventoryRecord[]> {
    return this.http.get<IInventoryRecord[]>(API_INVENTORY);
  }

  getAllInventoryMovements(
    queryDto: IInventoryMovementQueryDto,
  ): Observable<IInventoryMovementsResponse> {
    return this.http.get<IInventoryMovementsResponse>(`${API_INVENTORY}/movements`, {
      params: this.getProductMovementsParams(queryDto),
    });
  }

  createInMovement(dto: ICreateInInventoryMovementDto): Observable<ICreateInventoryMovementResult> {
    return this.http.post<ICreateInventoryMovementResult>(`${API_INVENTORY}/movement/in`, dto);
  }

  createOutMovement(
    dto: ICreateOutInventoryMovementDto,
  ): Observable<ICreateInventoryMovementResult> {
    return this.http.post<ICreateInventoryMovementResult>(`${API_INVENTORY}/movement/out`, dto);
  }

  getInventoryRecordById(id: string): Observable<IInventoryRecord> {
    return this.http.get<IInventoryRecord>(`${API_INVENTORY}/${id}`);
  }

  getMovementById(id: string): Observable<IInventoryMovement> {
    return this.http.get<IInventoryMovement>(`${API_INVENTORY}/movement/${id}`);
  }

  removeInventoryRecordById(id: string): Observable<IInventoryMovement> {
    return this.http.delete<IInventoryMovement>(`${API_INVENTORY}/${id}`);
  }

  undoMovementById(id: string): Observable<IInventoryMovement> {
    return this.http.delete<IInventoryMovement>(`${API_INVENTORY}/movement/${id}`);
  }

  private getProductMovementsParams(dto: IInventoryMovementQueryDto) {
    let params = new HttpParams();
    params = params.set('productId', dto.productId);
    if (dto.startDate) params = params.set('startDate', dto.startDate);
    if (dto.endDate) params = params.set('endDate', dto.endDate);
    if (dto.type) params = params.set('type', dto.type);
    if (dto.orderBy) params = params.set('orderBy', dto.orderBy);
    if (dto.limit || dto.limit === 0) params = params.set('limit', dto.limit);
    if (dto.offset || dto.offset === 0) params = params.set('offset', dto.offset);

    return params;
  }
}
