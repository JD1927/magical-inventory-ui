import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageHeader } from '@common/components';

@Component({
  selector: 'app-categories-page',
  imports: [CommonModule, RouterOutlet, PageHeader],
  template: `
    <app-page-header title="Categories" description="Manage your product categories" />
    <div class="card">
      <router-outlet />
    </div>
  `,
})
export class CategoriesPage {}
