import { CommonModule } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { FormGroup } from '@angular/forms';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import type { ICategory, ICreateCategoryForm } from '@categories/models/category.model';
import {
  CreateCategoryStore,
  createNewCategoryApiEvents,
  getCategoryByApiEvents,
  GetCategoryByStore,
  updateCategoryApiEvents,
  UpdateCategoryStore,
} from '@categories/store';
import { FormValidations } from '@common/utils';
import { Dispatcher, Events } from '@ngrx/signals/events';
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
  updateCategoryStore = inject(UpdateCategoryStore);
  getCategoryByStore = inject(GetCategoryByStore);
  dispatcher = inject(Dispatcher);
  events = inject(Events);
  dialogRef = inject(DynamicDialogRef<CategoryForm>);
  // Form Builder
  private fb: FormBuilder = inject(FormBuilder);

  constructor() {
    this.initializeForm();
    this.listenToFormEvents();
    effect(() => {
      const categoryId = this.categoryId();
      if (!categoryId) return;
      this.dispatcher.dispatch(getCategoryByApiEvents.getBy(categoryId));
    });
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

  private listenToFormEvents(): void {
    this.events
      .on(getCategoryByApiEvents.gottenBySuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload: category }) => this.setFormData(category));
  }

  private setFormData(category: ICategory): void {
    const { name, description, isMain } = category;
    // Name
    this.categoryForm.controls.name.setValue(name);
    this.categoryForm.controls.name.updateValueAndValidity();
    // Description
    this.categoryForm.controls.description.setValue(description ?? '');
    this.categoryForm.controls.description.updateValueAndValidity();
    // Main category?
    this.categoryForm.controls.isMain.setValue(isMain);
    this.categoryForm.controls.isMain.updateValueAndValidity();
  }

  onSubmit(): void {
    if (!this.categoryForm.valid) return;
    // Get dto values
    const { name, description, isMain } = this.categoryForm.value;
    // Build DTO
    const dto = {
      name: name ?? '',
      description: description ?? '',
      isMain: isMain ?? true,
    };
    const categoryId = this.categoryId();
    // Handle update/create event
    const event = categoryId
      ? updateCategoryApiEvents.update({ id: categoryId, dto: dto })
      : createNewCategoryApiEvents.create(dto);
    this.dispatcher.dispatch(event);
  }

  onCancel(): void {
    if (!this.dialogRef) return;
    this.dialogRef.close();
  }
}
