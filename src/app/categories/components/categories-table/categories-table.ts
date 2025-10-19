import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import type { ICategory } from '@categories/models/category.model';
import { TruncatePipe } from '@common/pipes';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-categories-table',
  imports: [CommonModule, TableModule, TruncatePipe, Tag, Button],
  templateUrl: './categories-table.html',
  styleUrl: './categories-table.css',
})
export class CategoriesTable {
  categories = input.required<ICategory[]>();
  deleteCategory = output<string>();
}
