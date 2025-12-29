import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import type { FormGroup } from '@angular/forms';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormValidations } from '@common/utils';
import type {
  ICreateInInventoryMovementDto,
  ICreateInventoryMovementForm,
  ICreateOutInventoryMovementDto,
  IInventoryRecord,
} from '@inventory/models/inventory.model';
import {
  DISCOUNT_PERCENT_VALIDATORS,
  EMovementType,
  PRODUCT_ID_VALIDATORS,
  PROFIT_MARGIN_PERCENTAGE_VALIDATORS,
  PURCHASE_PRICE_VALIDATORS,
  QUANTITY_VALIDATORS,
  SALE_PRICE_VALIDATORS,
  SUPPLIER_ID_VALIDATORS,
} from '@inventory/models/inventory.model';
import {
  CreateInventoryMovementStore,
  createNewInInventoryMovementApiEvents,
  createNewOutInventoryMovementApiEvents,
  InventoryStore,
} from '@inventory/store';
import { Dispatcher } from '@ngrx/signals/events';
import { SuppliersStore } from '@suppliers/store';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
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
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    TextareaModule,
    ToggleSwitchModule,
    SelectButtonModule,
  ],
  templateUrl: './inventory-movement-form.html',
  styleUrl: './inventory-movement-form.css',
})
export class InventoryMovementForm {
  inventoryMovementForm!: FormGroup<ICreateInventoryMovementForm>;
  formValidations = inject(FormValidations);
  inventoryStore = inject(InventoryStore);
  supplierStore = inject(SuppliersStore);
  createInventoryMovementStore = inject(CreateInventoryMovementStore);
  // Map Inventory Records to Products using the Product property
  dispatcher = inject(Dispatcher);
  products = computed(() =>
    this.inventoryStore
      .inventoryRecords()
      .map((record: IInventoryRecord) => ({ ...record, ...record.product })),
  );
  movementType = EMovementType.IN;
  options: any[] = [
    { label: EMovementType.IN.toString(), value: EMovementType.IN },
    { label: EMovementType.OUT.toString(), value: EMovementType.OUT },
  ];

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
        validators: PRODUCT_ID_VALIDATORS,
      }),
      quantity: new FormControl<number>(1, {
        nonNullable: true,
        validators: QUANTITY_VALIDATORS,
      }),
      purchasePrice: new FormControl<number | null>(1000, {
        validators: PURCHASE_PRICE_VALIDATORS,
      }),
      profitMarginPercentage: new FormControl<number | null>(100, {
        validators: PROFIT_MARGIN_PERCENTAGE_VALIDATORS,
      }),
      discountPercent: new FormControl<number | null>(0, {
        validators: DISCOUNT_PERCENT_VALIDATORS,
      }),
      salePrice: new FormControl<number | null>(null, {
        validators: SALE_PRICE_VALIDATORS,
      }),
      supplierId: new FormControl<string | null>(null, {
        validators: SUPPLIER_ID_VALIDATORS,
      }),
    });
  }

  onSubmitMovement(): void {
    if (!this.inventoryMovementForm.valid) return;
    // Extract form values
    const {
      productId,
      quantity,
      purchasePrice,
      profitMarginPercentage,
      salePrice,
      discountPercent,
      supplierId,
    } = this.inventoryMovementForm.value;
    // Validate required fields
    if (!productId) throw new Error('Product ID is required');
    // Create DTO based on movement type
    if (this.movementType === EMovementType.IN) {
      const inMovementDto: ICreateInInventoryMovementDto = {
        productId,
        quantity: quantity ?? 1,
        purchasePrice: purchasePrice ?? 1,
        profitMarginPercentage: profitMarginPercentage ?? null,
        salePrice: salePrice ?? null,
        supplierId: supplierId ?? null,
      };
      this.dispatcher.dispatch(createNewInInventoryMovementApiEvents.createIn(inMovementDto));
    } else {
      const outMovementDto: ICreateOutInventoryMovementDto = {
        productId,
        quantity: quantity ?? 1,
        discountPercent: discountPercent ?? null,
        supplierId: supplierId ?? null,
      };
      this.dispatcher.dispatch(createNewOutInventoryMovementApiEvents.createOut(outMovementDto));
    }
  }

  onCancel(): void {
    if (!this.dialogRef) return;
    this.dialogRef.close();
  }

  onMovementTypeChange({ value }: any): void {
    this.inventoryMovementForm.reset();
    if (value === EMovementType.IN) {
      // Clear OUT movement validators
      this.inventoryMovementForm.controls['discountPercent'].setValidators(null);
      this.inventoryMovementForm.controls['discountPercent'].updateValueAndValidity();
      // Set IN movement validators and default values
      // Purchase Price
      this.inventoryMovementForm.controls['purchasePrice'].setValidators(PURCHASE_PRICE_VALIDATORS);
      this.inventoryMovementForm.controls['purchasePrice'].setValue(1000);
      this.inventoryMovementForm.controls['purchasePrice'].updateValueAndValidity();
      // Profit Margin Percentage
      this.inventoryMovementForm.controls['profitMarginPercentage'].setValidators(
        PROFIT_MARGIN_PERCENTAGE_VALIDATORS,
      );
      this.inventoryMovementForm.controls['profitMarginPercentage'].setValue(100);
      this.inventoryMovementForm.controls['profitMarginPercentage'].updateValueAndValidity();
      // Sale Price
      this.inventoryMovementForm.controls['salePrice'].setValidators(SALE_PRICE_VALIDATORS);
      this.inventoryMovementForm.controls['salePrice'].setValue(null);
      this.inventoryMovementForm.controls['salePrice'].updateValueAndValidity();
      // Set supplierId as optional
      this.inventoryMovementForm.controls['supplierId'].setValue(null);
      this.inventoryMovementForm.controls['supplierId'].setValidators(null);
      this.inventoryMovementForm.controls['supplierId'].updateValueAndValidity();
    } else {
      // Clear IN movement validators
      // Purchase Price
      this.inventoryMovementForm.controls['purchasePrice'].setValidators(null);
      this.inventoryMovementForm.controls['purchasePrice'].updateValueAndValidity();
      // Profit Margin Percentage
      this.inventoryMovementForm.controls['profitMarginPercentage'].setValidators(null);
      this.inventoryMovementForm.controls['profitMarginPercentage'].updateValueAndValidity();
      // Sale Price
      this.inventoryMovementForm.controls['salePrice'].setValidators(null);
      this.inventoryMovementForm.controls['salePrice'].updateValueAndValidity();
      // Set supplierId as optional
      this.inventoryMovementForm.controls['supplierId'].setValidators(null);
      this.inventoryMovementForm.controls['supplierId'].updateValueAndValidity();
      // Set OUT movement validators and default values
      this.inventoryMovementForm.controls['discountPercent'].setValidators(
        DISCOUNT_PERCENT_VALIDATORS,
      );
      this.inventoryMovementForm.controls['discountPercent'].setValue(null);
      this.inventoryMovementForm.controls['discountPercent'].updateValueAndValidity();
    }
    this.inventoryMovementForm.updateValueAndValidity();
  }

  isInvalid(controlName: string): boolean {
    return this.formValidations.isInvalid(this.inventoryMovementForm, controlName);
  }
}
