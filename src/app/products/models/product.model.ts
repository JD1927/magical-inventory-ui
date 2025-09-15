import type { ICategory } from '../../categories/models/category.model';

export interface IProduct {
  id: string;
  name: string;
  description?: string;
  salePrice?: number;
  currentPurchasePrice?: number;
  minStock: number;
  isActive: boolean;
  mainCategory: ICategory;
  secondaryCategory: ICategory;
  createdAt: Date;
  updatedAt: Date;
}
