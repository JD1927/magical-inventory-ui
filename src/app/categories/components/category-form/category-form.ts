import { CommonModule } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { FormGroup } from '@angular/forms';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import type { ICreateCategoryDto, ICreateCategoryForm } from '@categories/models/category.model';
import {
  CreateCategoryStore,
  createNewCategoryApiEvents,
  getAllCategoriesApiEvents,
} from '@categories/store';
import { FormValidations } from '@common/utils';
import { Dispatcher, Events } from '@ngrx/signals/events';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

export interface ICategoryFormResult {
  categoryId?: string;
  createCategoryDto: ICreateCategoryDto;
}

@Component({
  selector: 'app-category-form',
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
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm {
  categoryId = input<string | undefined>(undefined);
  categoryForm!: FormGroup<ICreateCategoryForm>;
  formValidations = inject(FormValidations);
  createCategoryStore = inject(CreateCategoryStore);
  dispatcher = inject(Dispatcher);
  events = inject(Events);
  // Form Builder
  private fb: FormBuilder = inject(FormBuilder);

  constructor() {
    this.initializeForm();
    effect(() => {
      const id = this.categoryId();
      console.log('🚀 ~ CategoryForm ~ constructor ~ id:', id);
    });

    this.listenToCreationEvents();
  }

  private initializeForm(): void {
    this.categoryForm = this.fb.group({
      name: new FormControl<string>('', {
        nonNullable: true,
        validators: Validators.compose([Validators.required, Validators.minLength(3)]),
      }),
      description: new FormControl<string>('', {
        nonNullable: true,
        validators: Validators.compose([Validators.minLength(3), Validators.maxLength(500)]),
      }),
      isMain: new FormControl<boolean>(true, {
        nonNullable: true,
      }),
    });
  }

  private listenToCreationEvents() {
    // Move subscription to constructor for proper injection context
    // TODO: Move events to category list page
    this.events
      .on(createNewCategoryApiEvents.createdSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        // Refresh product list
        this.dispatcher.dispatch(getAllCategoriesApiEvents.load());
      });

    this.events
      .on(createNewCategoryApiEvents.createdFailure)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload }) => {
        console.error(payload);
      });
  }

  onSubmit(): void {
    if (!this.categoryForm.valid) return;

    const { name, description, isMain } = this.categoryForm.value;

    const createCategoryDto: ICreateCategoryDto = {
      name: name ?? '',
      description: description ?? '',
      isMain: isMain ?? true,
    };

    this.handleFormSubmit({ categoryId: this.categoryId(), createCategoryDto });
  }

  private handleFormSubmit(productFormResult: ICategoryFormResult): void {
    if (!productFormResult?.categoryId) {
      this.dispatcher.dispatch(
        createNewCategoryApiEvents.create(productFormResult.createCategoryDto),
      );
    }
    this.categoryForm.reset();
  }
}
