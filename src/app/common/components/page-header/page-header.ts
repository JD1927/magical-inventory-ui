import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  imports: [CommonModule],
  template: `
    <div class="flex items-start">
      <div class="mb-8">
        <h2 class="text-3xl font-bold leading-tight">{{ title() }}</h2>
        <p class="text-slate-500 text-base">{{ description() }}</p>
      </div>
      <ng-content />
    </div>
  `,
})
export class PageHeader {
  title = input.required<string>();
  description = input('');
}
