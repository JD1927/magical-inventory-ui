import { CommonModule } from '@angular/common';
import type { Signal } from '@angular/core';
import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import type { FormGroup } from '@angular/forms';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import type { ICategory } from '@categories/models/category.model';
import { CategoryService } from '@categories/services';
import { Dispatcher, Events } from '@ngrx/signals/events';
import type { ICreateProductDto, ICreateProductForm } from '@products/models/product.model';
import {
  createNewProductApiEvents,
  CreateProductStore,
  getAllProductsApiEvents,
} from '@products/store';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

export interface IProductFormResult {
  productId?: string;
  createProductDto: ICreateProductDto;
}

@Component({
  selector: 'app-product-form',
  imports: [
    ButtonModule,
    CheckboxModule,
    CommonModule,
    FloatLabel,
    InputNumberModule,
    InputTextModule,
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
  categoryService = inject(CategoryService);
  // Categories
  mainCategories: Signal<ICategory[]> = toSignal(this.categoryService.getAllCategories(true), {
    initialValue: [],
  });
  secondaryCategories: Signal<ICategory[]> = toSignal(
    this.categoryService.getAllCategories(false),
    {
      initialValue: [],
    },
  );

  // Store, Events & Dispatcher
  createProductStore = inject(CreateProductStore);
  dispatcher = inject(Dispatcher);
  events = inject(Events);

  // Form Builder & Dialog
  private fb: FormBuilder = inject(FormBuilder);
  private productDialogRef = inject(DynamicDialogRef);

  constructor() {
    this.initializeForm();
    effect(() => {
      const id = this.productId();
      console.log('🚀 ~ ProductForm ~ constructor ~ id:', id);
    });

    this.listenToCreationEvents();
  }

  private initializeForm(): void {
    this.productForm = this.fb.group(
      {
        name: new FormControl<string>('', {
          nonNullable: true,
          validators: Validators.compose([Validators.required, Validators.minLength(3)]),
        }),
        description: new FormControl<string>('', {
          nonNullable: true,
          validators: Validators.maxLength(500),
        }),
        mainCategory: new FormControl<ICategory | null>(null, Validators.required),
        secondaryCategory: new FormControl<ICategory | null>(null),
        minStock: new FormControl<number>(1, { nonNullable: true, validators: Validators.min(1) }),
        isActive: new FormControl<boolean>(true, {
          nonNullable: true,
          validators: Validators.required,
        }),
      },
      { updateOn: 'blur' },
    );
  }

  private listenToCreationEvents(): void {
    // Move subscription to constructor for proper injection context
    this.events
      .on(createNewProductApiEvents.createdSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        // Refresh product list and close dialog
        this.dispatcher.dispatch(getAllProductsApiEvents.load());
        this.productDialogRef.close();
      });

    this.events
      .on(createNewProductApiEvents.createdFailure)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload }) => {
        console.error(payload);
      });
  }

  onSubmit(): void {
    if (!this.productForm.valid) return;
    // Create DTO from form value
    const { mainCategory, secondaryCategory, name, description, minStock, isActive } =
      this.productForm.value;

    const createProductDto: ICreateProductDto = {
      name: name ?? '',
      description: description ?? '',
      minStock: minStock ?? 1,
      isActive: isActive ?? true,
      mainCategoryId: mainCategory?.id ?? null,
      secondaryCategoryId: secondaryCategory?.id ?? null,
    };

    this.handleFormSubmit({ productId: this.productId(), createProductDto });
  }

  private handleFormSubmit(productFormResult: IProductFormResult): void {
    if (!productFormResult?.productId) {
      this.dispatcher.dispatch(
        createNewProductApiEvents.create(productFormResult.createProductDto),
      );
    }
  }

  onCancel(): void {
    if (!this.productDialogRef) return;
    this.productDialogRef.close();
  }
}
