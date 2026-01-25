import { CommonModule } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { FormGroup } from '@angular/forms';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidations } from '@common/utils';
import { Dispatcher, Events } from '@ngrx/signals/events';
import type {
  ICreateSupplierDto,
  ICreateSupplierForm,
  ISupplier,
} from '@suppliers/models/supplier.model';
import {
  createNewSupplierApiEvents,
  CreateSupplierStore,
  getSupplierByApiEvents,
  updateSupplierApiEvents,
} from '@suppliers/store';
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
  events = inject(Events);
  // Form Builder
  private fb: FormBuilder = inject(FormBuilder);
  private dialogRef = inject(DynamicDialogRef<SupplierForm>);

  constructor() {
    this.initializeForm();
    this.listenToFormEvents();
    effect(() => {
      const supplierId = this.supplierId();
      if (!supplierId) return;
      this.dispatcher.dispatch(getSupplierByApiEvents.getBy(supplierId));
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

  private listenToFormEvents(): void {
    this.events
      .on(getSupplierByApiEvents.gottenBySuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload: supplier }) => this.setFormData(supplier));
  }

  private setFormData(supplier: ISupplier): void {
    const { name, description, nit, address, contactNumber, email } = supplier;
    // Set supplier name
    this.supplierForm.controls['name'].setValue(name);
    this.supplierForm.controls['name'].updateValueAndValidity();
    // Set supplier description
    this.supplierForm.controls['description'].setValue(description || '');
    this.supplierForm.controls['description'].updateValueAndValidity();
    // Set supplier NIT
    this.supplierForm.controls['nit'].setValue(nit || null);
    this.supplierForm.controls['nit'].updateValueAndValidity();
    // Set supplier address
    this.supplierForm.controls['address'].setValue(address || null);
    this.supplierForm.controls['address'].updateValueAndValidity();
    // Set supplier contactNumber
    this.supplierForm.controls['contactNumber'].setValue(contactNumber || null);
    this.supplierForm.controls['contactNumber'].updateValueAndValidity();
    // Set supplier email
    this.supplierForm.controls['email'].setValue(email || null);
    this.supplierForm.controls['email'].updateValueAndValidity();
  }

  onSubmit(): void {
    if (!this.supplierForm.valid) return;
    // Get supplier fields
    const { name, description, address, contactNumber, email, nit } = this.supplierForm.value;
    // Create DTO for create/update
    const dto = {
      name: name ?? '',
      description: description ?? '',
      nit: nit ?? '',
      address: address ?? '',
      contactNumber: contactNumber ?? '',
      email: email ?? '',
    };
    const supplierId = this.supplierId();
    // Handle create/update events
    const event = supplierId
      ? updateSupplierApiEvents.update({ id: supplierId, dto: dto })
      : createNewSupplierApiEvents.create(dto);
    this.dispatcher.dispatch(event);
  }

  onCancel(): void {
    if (!this.dialogRef) return;
    this.dialogRef.close();
  }
}
