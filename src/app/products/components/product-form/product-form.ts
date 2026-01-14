import { CommonModule } from '@angular/common';
import type { Signal } from '@angular/core';
import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import type { FormGroup } from '@angular/forms';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateProductStore } from '@app/products/store/update-product.store';
import type { ICategory } from '@categories/models/category.model';
import { CategoryService } from '@categories/services';
import { FormValidations } from '@common/utils';
import { Dispatcher, Events } from '@ngrx/signals/events';
import type { ICreateProductForm, IProduct } from '@products/models/product.model';
import {
  createNewProductApiEvents,
  CreateProductStore,
  getProductByApiEvents,
  GetProductByStore,
  updateProductApiEvents,
} from '@products/store';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-product-form',
  imports: [
    ButtonModule,
    CheckboxModule,
    CommonModule,
    FloatLabel,
    InputNumberModule,
    InputTextModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductForm {
  // Inputs
  productId = input<string | undefined>(undefined);
  // Form
  productForm!: FormGroup<ICreateProductForm>;
  formValidations = inject(FormValidations);
  // Categories
  categoryService = inject(CategoryService);
  mainCategories: Signal<ICategory[]> = toSignal(this.categoryService.getAllCategories(true), {
    initialValue: [],
  });
  secondaryCategories: Signal<ICategory[]> = toSignal(
    this.categoryService.getAllCategories(false),
    { initialValue: [] },
  );

  // Store, Events & Dispatcher
  createProductStore = inject(CreateProductStore);
  updateProductStore = inject(UpdateProductStore);
  getProductBy = inject(GetProductByStore);
  dispatcher = inject(Dispatcher);
  events = inject(Events);

  // Form Builder & Dialog
  private fb: FormBuilder = inject(FormBuilder);
  private dialogRef = inject(DynamicDialogRef<ProductForm>);

  constructor() {
    this.initializeForm();
    this.listenToFormEvents();
    effect(() => {
      const productId = this.productId();
      if (!productId) return;
      this.dispatcher.dispatch(getProductByApiEvents.getBy(productId));
    });
  }

  private initializeForm(): void {
    this.productForm = this.fb.group({
      name: new FormControl<string>('', {
        nonNullable: true,
        validators: Validators.compose([Validators.required, Validators.minLength(3)]),
      }),
      description: new FormControl<string>('', {
        nonNullable: true,
        validators: Validators.compose([Validators.minLength(3), Validators.maxLength(500)]),
      }),
      mainCategoryId: new FormControl<string | null>(null, Validators.required),
      secondaryCategoryId: new FormControl<string | null>(null),
      minStock: new FormControl<number>(1, {
        nonNullable: true,
        validators: Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.max(100),
        ]),
      }),
      isActive: new FormControl<boolean>(true, {
        nonNullable: true,
        validators: Validators.required,
      }),
    });
  }

  private listenToFormEvents(): void {
    this.events
      .on(getProductByApiEvents.gottenBySuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload: product }) => this.setFormData(product));
  }

  private setFormData(product: IProduct): void {
    const { mainCategory, secondaryCategory } = product;
    // Set product name
    this.productForm.controls['name'].setValue(product.name);
    this.productForm.controls['name'].updateValueAndValidity();
    // Set product description
    this.productForm.controls['description'].setValue(product.description || '');
    this.productForm.controls['description'].updateValueAndValidity();
    // Set product mainCategoryId
    this.productForm.controls['mainCategoryId'].setValue(mainCategory?.id || null);
    this.productForm.controls['mainCategoryId'].updateValueAndValidity();
    // Set product secondaryCategoryId
    this.productForm.controls['secondaryCategoryId'].setValue(secondaryCategory?.id || null);
    this.productForm.controls['secondaryCategoryId'].updateValueAndValidity();
    // Set product minStock
    this.productForm.controls['minStock'].setValue(product.minStock);
    this.productForm.controls['minStock'].updateValueAndValidity();
    // Set product isActive
    this.productForm.controls['isActive'].setValue(product.isActive);
    this.productForm.controls['isActive'].updateValueAndValidity();
  }

  onSubmit(): void {
    if (!this.productForm.valid) return;
    // Create DTO from form value
    const { mainCategoryId, secondaryCategoryId, name, description, minStock, isActive } =
      this.productForm.value;

    const dto = {
      name: name ?? '',
      description: description ?? '',
      minStock: minStock ?? 1,
      isActive: isActive ?? true,
      mainCategoryId: mainCategoryId ?? null,
      secondaryCategoryId: secondaryCategoryId ?? null,
    };
    const productId = this.productId();
    // Handle update/create event
    const event = productId
      ? updateProductApiEvents.update({ id: productId, dto: dto })
      : createNewProductApiEvents.create(dto);
    this.dispatcher.dispatch(event);
  }

  onCancel(): void {
    if (!this.dialogRef) return;
    this.dialogRef.close();
  }
}
