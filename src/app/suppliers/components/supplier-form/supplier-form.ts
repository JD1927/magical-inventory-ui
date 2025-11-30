import { CommonModule } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import type { FormGroup } from '@angular/forms';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidations } from '@common/utils';
import { Dispatcher } from '@ngrx/signals/events';
import type { ICreateSupplierDto, ICreateSupplierForm } from '@suppliers/models/supplier.model';
import { createNewSupplierApiEvents, CreateSupplierStore } from '@suppliers/store';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

export interface ISupplierFormResult {
  supplierId?: string;
  createSupplierDto: ICreateSupplierDto;
}

@Component({
  selector: 'app-supplier-form',
  imports: [
    ButtonModule,
    CommonModule,
    FloatLabel,
    InputNumberModule,
    InputTextModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
    TextareaModule,
    ToggleSwitchModule,
  ],
  templateUrl: './supplier-form.html',
  styleUrl: './supplier-form.css',
})
export class SupplierForm {
  supplierId = input<string | undefined>(undefined);
  supplierForm!: FormGroup<ICreateSupplierForm>;
  formValidations = inject(FormValidations);
  createSupplierStore = inject(CreateSupplierStore);
  dispatcher = inject(Dispatcher);
  // Form Builder
  private fb: FormBuilder = inject(FormBuilder);
  private dialogRef = inject(DynamicDialogRef<SupplierForm>);

  constructor() {
    this.initializeForm();
    effect(() => {
      const id = this.supplierId();
      console.log('🚀 ~ SupplierForm ~ constructor ~ id:', id);
    });
  }

  private initializeForm(): void {
    this.supplierForm = this.fb.group({
      name: new FormControl<string>('', {
        nonNullable: true,
        validators: Validators.compose([Validators.required, Validators.minLength(3)]),
      }),
      description: new FormControl<string>('', {
        nonNullable: true,
        validators: Validators.compose([Validators.minLength(3), Validators.maxLength(500)]),
      }),
      nit: new FormControl<string | null>('', {
        validators: Validators.compose([
          Validators.minLength(9),
          Validators.maxLength(9),
          Validators.pattern(/^\d{9}$/),
        ]),
      }),
      address: new FormControl<string | null>('', {
        validators: Validators.compose([Validators.minLength(3), Validators.maxLength(500)]),
      }),
      contactNumber: new FormControl<string | null>('', {
        validators: Validators.compose([
          Validators.minLength(7),
          Validators.maxLength(10),
          Validators.pattern(/\d/),
        ]),
      }),
      email: new FormControl<string | null>('', {
        validators: Validators.compose([Validators.maxLength(500), Validators.email]),
      }),
    });
  }

  onSubmit(): void {
    if (!this.supplierForm.valid) return;

    const { name, description, address, contactNumber, email, nit } = this.supplierForm.value;

    const createSupplierDto: ICreateSupplierDto = {
      name: name ?? '',
      description: description ?? '',
      nit: nit ?? '',
      address: address ?? '',
      contactNumber: contactNumber ?? '',
      email: email ?? '',
    };

    this.handleFormSubmit({ supplierId: this.supplierId(), createSupplierDto });
  }

  private handleFormSubmit(formResult: ISupplierFormResult): void {
    if (!formResult?.supplierId) {
      this.dispatcher.dispatch(createNewSupplierApiEvents.create(formResult.createSupplierDto));
    }
    this.supplierForm.reset();
  }

  onCancel(): void {
    if (!this.dialogRef) return;
    this.dialogRef.close();
  }
}
