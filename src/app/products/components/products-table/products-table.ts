import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import type { IProductListResponse } from '@products/models/product.model';
import { ButtonModule } from 'primeng/button';
import type { TableLazyLoadEvent } from 'primeng/table';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import type { IPaginationDto } from '@common/models';
import { ELimitSettings } from '@common/models';

@Component({
  selector: 'app-products-table',
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ButtonModule,
    TooltipModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './products-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsTable {
  productListResponse = input.required<IProductListResponse>();
  updateProduct = output<string>();
  deleteProduct = output<{ productId: string; event: Event }>();
  search = output<string>();
  paginate = output<IPaginationDto>();

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => this.search.emit(term));
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    const offset: number = event.first || 0;
    const limit: number = event.rows || ELimitSettings.DEFAULT;
    this.paginate.emit({ offset, limit });
  }
  items = signal([
    {
      label: 'Options',
      items: [
        {
          label: 'Refresh',
          icon: 'pi pi-refresh',
        },
        {
          label: 'Export',
          icon: 'pi pi-upload',
        },
      ],
    },
  ]);

  onDelete(productId: string, event: Event): void {
    this.deleteProduct.emit({ productId, event });
  }

  onSearch(event: Event): void {
    const term: string = (event.target as HTMLInputElement).value;
    this.searchSubject.next(term);
  }

  onClearSearch(): void {
    this.searchSubject.next('');
  }
}
