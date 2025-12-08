import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import type {
  ICreateInInventoryMovementDto,
  ICreateInventoryMovementResult,
  ICreateOutInventoryMovementDto,
  IInventoryRecord,
  IInventoryMovement,
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

  getAllInventoryMovements(): Observable<IInventoryMovement[]> {
    return this.http.get<IInventoryMovement[]>(`${API_INVENTORY}/movements`);
  }

  createInMovement(dto: ICreateInInventoryMovementDto): Observable<ICreateInventoryMovementResult> {
    return this.http.post<ICreateInventoryMovementResult>(`${API_INVENTORY}/movements/in`, dto);
  }

  createOutMovement(
    dto: ICreateOutInventoryMovementDto,
  ): Observable<ICreateInventoryMovementResult> {
    return this.http.post<ICreateInventoryMovementResult>(`${API_INVENTORY}/movements/out`, dto);
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
}
