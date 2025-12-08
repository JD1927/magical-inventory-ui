import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import type { FormGroup } from '@angular/forms';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidations } from '@common/utils';
import type { ICreateInventoryMovementForm } from '@inventory/models/inventory.model';
import { Dispatcher } from '@ngrx/signals/events';
import { CreateSupplierStore } from '@suppliers/store';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-in-inventory-movement-form',
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
  templateUrl: './inventory-movement-form.html',
  styleUrl: './inventory-movement-form.css',
})
export class InventoryMovementForm {
  inventoryMovementForm!: FormGroup<ICreateInventoryMovementForm>;
  formValidations = inject(FormValidations);
  createSupplierStore = inject(CreateSupplierStore);
  dispatcher = inject(Dispatcher);
  // Form Builder
  private fb: FormBuilder = inject(FormBuilder);
  private dialogRef = inject(DynamicDialogRef<InventoryMovementForm>);

  constructor() {
    this.initializeMovementForm();
  }

  private initializeMovementForm(): void {
    this.inventoryMovementForm = this.fb.group({
      productId: new FormControl<string>('', {
        nonNullable: true,
        validators: Validators.compose([Validators.required]),
      }),
      quantity: new FormControl<number>(1, {
        nonNullable: true,
        validators: Validators.compose([Validators.required, Validators.min(1)]),
      }),
      purchasePrice: new FormControl<number>(1, {
        nonNullable: true,
        validators: Validators.compose([Validators.required, Validators.min(1)]),
      }),
      profitMarginPercentage: new FormControl<number | null>(null, {
        validators: Validators.compose([Validators.min(100), Validators.max(300)]),
      }),
      discountPercent: new FormControl<number | null>(null, {
        validators: Validators.compose([Validators.min(0), Validators.max(100)]),
      }),
      salePrice: new FormControl<number | null>(null, {
        validators: Validators.compose([Validators.min(1)]),
      }),
      supplierId: new FormControl<string | null>(null, {
        validators: [],
      }),
    });
  }

  onSubmitMovement(): void {
    if (!this.inventoryMovementForm.valid) return;
  }

  onCancel(): void {
    if (!this.dialogRef) return;
    this.dialogRef.close();
  }
}
