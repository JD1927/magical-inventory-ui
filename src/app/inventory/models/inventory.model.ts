import { Validators, type FormControl } from '@angular/forms';
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
  profitMarginPercentage: number | null;
  salePrice: number | null;
  supplierId: string | null;
}

export interface ICreateOutInventoryMovementDto {
  productId: string;
  quantity: number;
  discountPercent: number | null;
  supplierId: string | null;
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
  purchasePrice: FormControl<number | null>;
  profitMarginPercentage: FormControl<number | null>;
  discountPercent: FormControl<number | null>;
  salePrice: FormControl<number | null>;
  supplierId: FormControl<string | null>;
}

export interface ICreateInventoryMovementResult {
  inventoryRecord: IInventoryRecord;
  movement: IInventoryMovement;
}

export const PRODUCT_ID_VALIDATORS = Validators.compose([Validators.required]);
export const QUANTITY_VALIDATORS = Validators.compose([Validators.required, Validators.min(1)]);
export const PURCHASE_PRICE_VALIDATORS = Validators.compose([
  Validators.required,
  Validators.min(1),
]);
export const PROFIT_MARGIN_PERCENTAGE_VALIDATORS = Validators.compose([
  Validators.min(100),
  Validators.max(300),
]);
export const DISCOUNT_PERCENT_VALIDATORS = Validators.compose([
  Validators.min(0),
  Validators.max(100),
]);
export const SALE_PRICE_VALIDATORS = Validators.compose([Validators.min(1)]);
export const SUPPLIER_ID_VALIDATORS = null;
