import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { createNewCategoryApiEvents, getAllCategoriesApiEvents } from '@app/categories/store';
import { CategoryDialogService } from '@categories/services';
import { PageHeader } from '@common/components';
import { Dispatcher, Events } from '@ngrx/signals/events';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-categories-page',
  imports: [CommonModule, RouterOutlet, PageHeader, ButtonModule, Tooltip],
  providers: [CategoryDialogService, DialogService],
  template: `
    <app-page-header title="Categories" description="Manage your product categories">
      <div class="ml-auto flex gap-2">
        <button type="button" pButton (click)="onNewCategory()" pTooltip="New Category">
          <i class="pi pi-plus" pButtonIcon></i>
          <span class="hidden md:inline-block" pButtonLabel>New Category</span>
        </button>
      </div>
    </app-page-header>
    <div class="card page-content">
      <router-outlet />
    </div>
  `,
})
export class CategoriesPage {
  dispatcher = inject(Dispatcher);
  events = inject(Events);
  categoryDialogService = inject(CategoryDialogService);

  constructor() {
    this.listenToCreationEvents();
  }

  onNewCategory(): void {
    this.categoryDialogService.openDialog();
  }

  private listenToCreationEvents(): void {
    // Move subscription to constructor for proper injection context
    this.events
      .on(createNewCategoryApiEvents.createdSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        // Refresh product list and close dialog
        this.dispatcher.dispatch(getAllCategoriesApiEvents.load());
        this.categoryDialogService.closeDialog();
      });

    this.events
      .on(createNewCategoryApiEvents.createdFailure)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload }) => {
        console.error(payload);
      });
  }
}
