import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { TruncatePipe } from '@common/pipes';
import type { ISupplier } from '@suppliers/models/supplier.model';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-suppliers-table',
  imports: [CommonModule, TableModule, TruncatePipe, Button, TooltipModule],
  templateUrl: './suppliers-table.html',
  styleUrl: './suppliers-table.css',
})
export class SuppliersTable {
  suppliers = input.required<ISupplier[]>();
  deleteSupplier = output<string>();
}
