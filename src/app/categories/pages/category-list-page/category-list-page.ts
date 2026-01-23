import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoriesTable } from '@categories/components';
import { CategoryDialogService } from '@categories/services';
import {
  CategoriesStore,
  DeleteCategoryStore,
  deleteCategoryApiEvents,
  getAllCategoriesApiEvents,
  updateCategoryApiEvents,
} from '@categories/store';
import { Dispatcher, Events } from '@ngrx/signals/events';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-category-list-page',
  imports: [CommonModule, CategoriesTable],
  template: `
    <app-categories-table
      [categories]="categoriesStore.categories()"
      (updateCategory)="onUpdateCategory($event)"
      (deleteCategory)="onDeleteCategory($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryListPage implements OnInit {
  categoriesStore = inject(CategoriesStore);
  deleteCategoryStore = inject(DeleteCategoryStore);
  categoryDialogService = inject(CategoryDialogService);
  dispatcher = inject(Dispatcher);
  events = inject(Events);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);

  constructor() {
    effect(() => {
      const errorMessage = this.categoriesStore.errorMessage();
      if (errorMessage) {
        console.error('Error loading categories:', errorMessage);
      }
    });
    this.listenToCategoryListChanges();
  }

  ngOnInit(): void {
    this.dispatcher.dispatch(getAllCategoriesApiEvents.load());
  }

  private listenToCategoryListChanges(): void {
    this.events
      .on(deleteCategoryApiEvents.deletedSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload: successMessage }) => {
        this.confirmationService.close();
        this.messageService.add({
          severity: 'success',
          summary: 'Delete Operation',
          detail: successMessage,
        });
        this.dispatcher.dispatch(getAllCategoriesApiEvents.load());
      });
    this.events
      .on(deleteCategoryApiEvents.deletedFailure)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload: errorMessage }) => {
        this.confirmationService.close();
        this.messageService.add({
          severity: 'error',
          summary: 'Delete Operation',
          detail: errorMessage,
        });
        this.dispatcher.dispatch(getAllCategoriesApiEvents.load());
      });
    this.events
      .on(updateCategoryApiEvents.updatedSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload: category }) => {
        // Refresh category list and close dialog
        this.dispatcher.dispatch(getAllCategoriesApiEvents.load());
        this.messageService.add({
          severity: 'success',
          summary: 'Update Operation',
          detail: `${category.name} was updated successfully!`,
        });
        this.categoryDialogService.closeDialog();
      });

    this.events
      .on(updateCategoryApiEvents.updatedFailure)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload }) => {
        console.error(payload);
      });
  }

  onUpdateCategory(categoryId: string): void {
    this.categoryDialogService.openDialog(categoryId);
  }

  onDeleteCategory({ categoryId, event }: { categoryId: string; event: Event }): void {
    const result = this.categoryDialogService.openDeleteConfirmationDialog(event);
    // Handle confirmation response
    result.subscribe((isConfirmation: boolean) => {
      if (!isConfirmation) return;
      this.dispatcher.dispatch(deleteCategoryApiEvents.delete(categoryId));
    });
  }
}
