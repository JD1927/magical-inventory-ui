import { inject, Injectable } from '@angular/core';
import { CategoryForm } from '@categories/components';
import { ConfirmationService } from 'primeng/api';
import type { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryDialogService {
  dialogService: DialogService = inject(DialogService);
  confirmationService: ConfirmationService = inject(ConfirmationService);
  dialogRef: DynamicDialogRef<CategoryForm> | null = null;

  openDialog(categoryId?: string): DynamicDialogRef<CategoryForm> | null {
    this.dialogRef = this.dialogService.open(CategoryForm, {
      modal: true,
      draggable: false,
      header: categoryId ? 'Edit Category' : 'Create Category',
      width: '50%',
      inputValues: { categoryId },
      baseZIndex: 10000,
      breakpoints: { '960px': '70%', '640px': '100%' },
    });

    return this.dialogRef;
  }

  openDeleteConfirmationDialog(event: Event): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        header: 'Confirmation',
        message: 'Are you sure you want to delete this category?',
        icon: 'pi pi-exclamation-triangle',
        closable: true,
        closeOnEscape: true,
        modal: true,
        acceptButtonProps: { severity: 'danger', label: 'Delete', icon: 'pi pi-trash' },
        rejectButtonProps: { severity: 'secondary', label: 'Cancel', icon: 'pi pi-times' },
        accept: () => {
          subscriber.next(true);
          subscriber.complete();
        },
        reject: () => {
          subscriber.next(false);
          subscriber.complete();
        },
      });
    });
  }

  closeDialog(): void {
    if (!this.dialogRef) return;

    this.dialogRef.close();
  }
}
