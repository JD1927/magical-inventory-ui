import type { FormControl } from '@angular/forms';
import type { IProduct } from '@products/models/product.model';
import type { ISupplier } from '@suppliers/models/supplier.model';

export enum EMovementType {
  IN = 'IN',
  OUT = 'OUT',
}

export interface IInventoryRecord {
  id: string;
  product: IProduct;
  stock: number;
  averageCost: number;
  updatedAt: string;
}

export interface ICreateInInventoryMovementDto {
  productId: string;
  quantity: number;
  purchasePrice: number;
  profitMarginPercentage?: number;
  salePrice?: number;
  supplierId?: string;
}

export interface ICreateOutInventoryMovementDto {
  productId: string;
  quantity: number;
  discountPercent?: number;
  supplierId?: string;
}

export interface IInventoryMovement {
  id: string;
  product: IProduct;
  type: EMovementType;
  quantity: number;
  purchasePrice: number | null;
  salePrice: number;
  supplier: ISupplier | null;
  createdAt: string;
}

export interface ICreateInventoryMovementForm {
  productId: FormControl<string>;
  quantity: FormControl<number>;
  purchasePrice: FormControl<number>;
  profitMarginPercentage: FormControl<number | null>;
  discountPercent: FormControl<number | null>;
  salePrice: FormControl<number | null>;
  supplierId: FormControl<string | null>;
}

export interface ICreateInventoryMovementResult {
  inventory: IInventoryRecord;
  movement: IInventoryMovement;
}
