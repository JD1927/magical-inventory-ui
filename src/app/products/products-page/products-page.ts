import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageHeader } from '../../common/components/page-header/page-header';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-products-page',
  imports: [RouterOutlet, PageHeader, ButtonModule],
  template: `
    <app-page-header title="Products" description="Manage your product inventory">
      <div class="ml-auto flex gap-2">
        <p-button label="New Product" icon="pi pi-plus" />
      </div>
    </app-page-header>
    <div class="card">
      <router-outlet />
    </div>
  `,
})
export class ProductsPage {}
