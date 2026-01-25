import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import type { ICategory } from '@categories/models/category.model';
import { TruncatePipe } from '@common/pipes';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-categories-table',
  imports: [CommonModule, TableModule, TruncatePipe, Tag, Button, Tooltip],
  templateUrl: './categories-table.html',
  styleUrl: './categories-table.css',
})
export class CategoriesTable {
  categories = input.required<ICategory[]>();
  updateCategory = output<string>();
  deleteCategory = output<{ categoryId: string; event: Event }>();

  onDelete(categoryId: string, event: Event): void {
    this.deleteCategory.emit({ categoryId, event });
  }
}
