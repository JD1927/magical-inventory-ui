import type { FormControl } from '@angular/forms';

export interface ICategory {
  id: string;
  name: string;
  description?: string;
  isMain: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateCategoryDto {
  name: string;
  description?: string;
  isMain: boolean;
}

export interface ICreateCategoryForm {
  name: FormControl<string>;
  description: FormControl<string>;
  isMain: FormControl<boolean>;
}

export type IUpdateCategoryDto = Partial<ICreateCategoryDto>;
