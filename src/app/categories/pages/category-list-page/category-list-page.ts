import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
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
  standalone: true,
  imports: [CommonModule, CategoriesTable],
  templateUrl: './category-list-page.html',
  styleUrl: './category-list-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryListPage implements OnInit {
  categoriesStore = inject(CategoriesStore);
  deleteCategoryStore = inject(DeleteCategoryStore);
  dispatcher = inject(Dispatcher);
  events = inject(Events);

  constructor() {
    this.listenToCategoryListChanges();
  }

  ngOnInit(): void {
    this.dispatcher.dispatch(getAllCategoriesApiEvents.load());
  }

  private listenToCategoryListChanges(): void {
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
