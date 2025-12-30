import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoriesTable } from '@categories/components';
import {
  CategoriesStore,
  DeleteCategoryStore,
  deleteCategoryApiEvents,
  getAllCategoriesApiEvents,
} from '@categories/store';
import { Dispatcher, Events } from '@ngrx/signals/events';

@Component({
  selector: 'app-category-list-page',
  imports: [CommonModule, CategoriesTable],
  templateUrl: './category-list-page.html',
  styleUrl: './category-list-page.css',
})
export class CategoryListPage {
  categoriesStore = inject(CategoriesStore);
  deleteCategoryStore = inject(DeleteCategoryStore);
  dispatcher = inject(Dispatcher);
  events = inject(Events);

  constructor() {
    this.dispatcher.dispatch(getAllCategoriesApiEvents.load());
    this.listenToCategoryListChanges();
  }

  listenToCategoryListChanges(): void {
    this.events
      .on(deleteCategoryApiEvents.deletedSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.dispatcher.dispatch(getAllCategoriesApiEvents.load());
      });
  }

  onDeleteCategory(categoryId: string): void {
    this.dispatcher.dispatch(deleteCategoryApiEvents.delete(categoryId));
  }
}
