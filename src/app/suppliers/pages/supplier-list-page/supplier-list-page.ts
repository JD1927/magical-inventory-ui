import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Dispatcher, Events } from '@ngrx/signals/events';
import { SuppliersTable } from '@suppliers/components';
import { SupplierDialogService } from '@suppliers/services';
import {
  deleteSupplierApiEvents,
  DeleteSupplierStore,
  getAllSuppliersApiEvents,
  GetSupplierByStore,
  SuppliersStore,
  updateSupplierApiEvents,
  UpdateSupplierStore,
} from '@suppliers/store';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-category-list-page',
  imports: [CommonModule, SuppliersTable],
  template: `
    <app-suppliers-table
      [suppliers]="suppliersStore.suppliers()"
      (updateSupplier)="onUpdateSupplier($event)"
      (deleteSupplier)="onDeleteSupplier($event)"
    />
  `,
})
export class SupplierListPage {
  suppliersStore = inject(SuppliersStore);
  updateSupplierStore = inject(UpdateSupplierStore);
  getSupplierByStore = inject(GetSupplierByStore);
  deleteSupplierStore = inject(DeleteSupplierStore);
  supplierDialogService = inject(SupplierDialogService);
  dispatcher = inject(Dispatcher);
  events = inject(Events);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  constructor() {
    this.dispatcher.dispatch(getAllSuppliersApiEvents.load());
    this.listenToCategoryListChanges();
  }

  private listenToCategoryListChanges(): void {
    this.events
      .on(deleteSupplierApiEvents.deletedSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload: successMessage }) => {
        this.confirmationService.close();
        this.messageService.add({
          severity: 'success',
          summary: 'Delete Operation',
          detail: successMessage,
        });
        this.dispatcher.dispatch(getAllSuppliersApiEvents.load());
      });
    this.events
      .on(deleteSupplierApiEvents.deletedFailure)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload: errorMessage }) => {
        this.confirmationService.close();
        this.messageService.add({
          severity: 'error',
          summary: 'Delete Operation',
          detail: errorMessage,
        });
        this.dispatcher.dispatch(getAllSuppliersApiEvents.load());
      });
    this.events
      .on(updateSupplierApiEvents.updatedSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload: supplier }) => {
        // Refresh supplier list and close dialog
        this.dispatcher.dispatch(getAllSuppliersApiEvents.load());
        this.messageService.add({
          severity: 'success',
          summary: 'Update Operation',
          detail: `${supplier.name} was updated successfully!`,
        });
        this.supplierDialogService.closeDialog();
      });

    this.events
      .on(updateSupplierApiEvents.updatedFailure)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload }) => {
        console.error(payload);
      });
  }

  onUpdateSupplier(supplierId: string): void {
    this.supplierDialogService.openDialog(supplierId);
  }

  onDeleteSupplier({ supplierId, event }: { supplierId: string; event: Event }): void {
    const result = this.supplierDialogService.openDeleteConfirmationDialog(event);
    result.subscribe((isConfirmation: boolean) => {
      if (!isConfirmation) return;
      this.dispatcher.dispatch(deleteSupplierApiEvents.delete(supplierId));
    });
  }
}
