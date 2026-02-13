import type { FormControl } from '@angular/forms';
import type { ICategory } from '@categories/models/category.model';

export interface IProduct {
  id: string;
  name: string;
  sku: string;
  description?: string;
  salePrice: number;
  currentPurchasePrice: number;
  minStock: number;
  isActive: boolean;
  mainCategory: ICategory;
  secondaryCategory: ICategory;
  createdAt: string;
  updatedAt: string;
}

export interface IProductListResponse {
  limit: number;
  offset: number;
  term?: string;
  products: IProduct[];
  totalRecords: number;
}

export interface ICreateProductForm {
  name: FormControl<string>;
  description: FormControl<string>;
  minStock: FormControl<number>;
  mainCategoryId: FormControl<string | null>;
  secondaryCategoryId: FormControl<string | null>;
  isActive: FormControl<boolean>;
}

export interface ICreateProductDto {
  name: string;
  description?: string;
  minStock: number;
  mainCategoryId: string | null;
  secondaryCategoryId: string | null;
  isActive: boolean;
}

export type IUpdateProductDto = Partial<ICreateProductDto>;
