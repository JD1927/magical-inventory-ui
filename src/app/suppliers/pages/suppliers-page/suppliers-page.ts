import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { createNewSupplierApiEvents, getAllSuppliersApiEvents } from '@app/suppliers/store';
import { PageHeader } from '@common/components';
import { Dispatcher, Events } from '@ngrx/signals/events';
import { SupplierDialogService } from '@suppliers/services';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-suppliers-page',
  imports: [CommonModule, RouterOutlet, PageHeader, ButtonModule, TooltipModule],
  providers: [SupplierDialogService, DialogService],
  template: `
    <app-page-header title="Suppliers" description="Manage your own suppliers">
      <div class="ml-auto flex gap-2">
        <button type="button" pButton (click)="onNewSupplier()" pTooltip="New Supplier">
          <i class="pi pi-plus" pButtonIcon></i>
          <span class="hidden md:inline-block" pButtonLabel>New Supplier</span>
        </button>
      </div>
    </app-page-header>
    <div class="card page-content">
      <router-outlet />
    </div>
  `,
})
export class SuppliersPage {
  supplierDialogService = inject(SupplierDialogService);
  events = inject(Events);
  dispatcher = inject(Dispatcher);

  constructor() {
    this.listenToCreationEvents();
  }

  onNewSupplier(): void {
    this.supplierDialogService.openDialog();
  }

  private listenToCreationEvents() {
    this.events
      .on(createNewSupplierApiEvents.createdSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload }) => {
        // Refresh supplier list
        console.log('🚀 ~ SuppliersPage ~ listenToCreationEvents ~ payload:', payload);
        this.dispatcher.dispatch(getAllSuppliersApiEvents.load());
        this.supplierDialogService.closeDialog();
      });

    this.events
      .on(createNewSupplierApiEvents.createdFailure)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload }) => {
        console.error(payload);
      });
  }
}
