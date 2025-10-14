import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { PrimeIcons, type MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-menu-bar',
  imports: [CommonModule, MenubarModule, AvatarModule],
  template: `
    <div class="card">
      <p-menubar [model]="menuItems()">
        <ng-template #start>
          <h3 class="ml-8 text-xl font-bold pt-4 pb-4">Magical Inventory</h3>
        </ng-template>
        <ng-template #end>
          <p-avatar label="M" class="mr-2" shape="circle" />
        </ng-template>
      </p-menubar>
    </div>
  `,
})
export class MenuBar {
  menuItems = signal<MenuItem[]>(TOP_BAR_MENU_ITEMS);
}

export const TOP_BAR_MENU_ITEMS: MenuItem[] = [
  {
    automationId: 'home-item',
    label: 'Home',
    icon: PrimeIcons.HOME,
    routerLink: '/dashboard/home',
  },
  {
    automationId: 'products-item',
    label: 'Products',
    icon: PrimeIcons.SPARKLES,
    routerLink: '/dashboard/products',
  },
  {
    automationId: 'categories-item',
    label: 'Categories',
    icon: PrimeIcons.TAGS,
    routerLink: '/dashboard/categories',
  },
];
