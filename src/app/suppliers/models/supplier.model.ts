import type { FormControl } from '@angular/forms';

export interface ISupplier {
  id: string;
  name: string;
  description?: string;
  nit?: string;
  address?: string;
  contactNumber?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateSupplierDto {
  name: string;
  description?: string;
  nit?: string;
  address?: string;
  contactNumber?: string;
  email?: string;
}

export interface ICreateSupplierForm {
  name: FormControl<string>;
  description: FormControl<string>;
  nit: FormControl<string | null>;
  address: FormControl<string | null>;
  contactNumber: FormControl<string | null>;
  email: FormControl<string | null>;
}

export type IUpdateSupplierDto = Partial<ICreateSupplierDto>;
