import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageHeader } from '../../common/components/page-header/page-header';

@Component({
  selector: 'app-products-page',
  imports: [RouterOutlet, PageHeader],
  template: `
    <app-page-header title="Products" description="Manage your product inventory" />
    <div class="card">
      <router-outlet />
    </div>
  `,
})
export class ProductsPage {}
