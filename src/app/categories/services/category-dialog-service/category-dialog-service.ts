import { inject, Injectable } from '@angular/core';
import { CategoryForm } from '@categories/components';
import type { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';

@Injectable({
  providedIn: 'root',
})
export class CategoryDialogService {
  dialogService: DialogService = inject(DialogService);
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

  closeDialog(): void {
    if (!this.dialogRef) return;

    this.dialogRef.close();
  }
}
