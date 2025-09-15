import type { ICategory } from '../../categories/models/category.model';

export interface IProduct {
  id: string;
  name: string;
  description?: string;
  salePrice: number;
  currentPurchasePrice: number;
  minStock: number;
  isActive: boolean;
  mainCategory: ICategory;
  secondaryCategory: ICategory;
  createdAt: Date;
  updatedAt: Date;
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
