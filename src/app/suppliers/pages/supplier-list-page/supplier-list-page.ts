import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Dispatcher, Events } from '@ngrx/signals/events';
import { SuppliersTable } from '@suppliers/components';
import {
  deleteSupplierApiEvents,
  DeleteSupplierStore,
  getAllSuppliersApiEvents,
  SuppliersStore,
} from '@suppliers/store';

@Component({
  selector: 'app-category-list-page',
  imports: [CommonModule, SuppliersTable],
  templateUrl: './supplier-list-page.html',
  styleUrl: './supplier-list-page.css',
})
export class SupplierListPage {
  suppliersStore = inject(SuppliersStore);
  deleteSupplierStore = inject(DeleteSupplierStore);
  dispatcher = inject(Dispatcher);
  events = inject(Events);

  constructor() {
    this.dispatcher.dispatch(getAllSuppliersApiEvents.load());
    this.listenToCategoryListChanges();
  }

  listenToCategoryListChanges(): void {
    this.events
      .on(deleteSupplierApiEvents.deletedSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.dispatcher.dispatch(getAllSuppliersApiEvents.load());
      });
  }

  onDeleteSupplier(supplierId: string): void {
    this.dispatcher.dispatch(deleteSupplierApiEvents.delete(supplierId));
  }
}
