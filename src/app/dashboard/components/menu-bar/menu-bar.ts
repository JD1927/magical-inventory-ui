import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ColorSchemeService } from '@app/common/utils/color-scheme/color-scheme';
import { PrimeIcons, type MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';

import { AuthService } from '@app/core/auth/auth.service';
import { computed } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-menu-bar',
  imports: [CommonModule, MenubarModule, AvatarModule, Button, Tooltip],
  template: `
    <div class="card">
      <p-menubar [model]="menuItems()">
        <ng-template #start>
          <h3 class="ml-8 text-xl font-bold pt-4 pb-4">Magical Inventory</h3>
        </ng-template>
        <ng-template #end>
          <p-button
            class="mr-4"
            [icon]="colorSchemeService.isDarkMode() ? 'pi pi-sun' : 'pi pi-moon'"
            [text]="true"
            pTooltip="Toggle color scheme"
            tooltipPosition="bottom"
            aria-label="Toggle color scheme"
            (click)="colorSchemeService.onToggleDarkMode()"
          />
          <p-button
            icon="pi pi-sign-out"
            aria-label="Logout"
            pTooltip="Logout"
            tooltipPosition="bottom"
            [severity]="'danger'"
            [outlined]="true"
            size="small"
            (click)="logout()"
          />
        </ng-template>
      </p-menubar>
    </div>
  `,
})
export class MenuBar {
  private authService = inject(AuthService);
  colorSchemeService = inject(ColorSchemeService);

  menuItems = computed(() => {
    const items = [...TOP_BAR_MENU_ITEMS];
    if (this.authService.user()?.role === 'admin') {
      items.push({
        automationId: 'users-item',
        label: 'Users',
        icon: PrimeIcons.USERS,
        routerLink: '/dashboard/users',
      });
    }
    return items;
  });

  logout(): void {
    this.authService.logout();
  }
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
  {
    automationId: 'suppliers-item',
    label: 'Suppliers',
    icon: PrimeIcons.SHOP,
    routerLink: '/dashboard/suppliers',
  },
  {
    automationId: 'inventory-item',
    label: 'Inventory',
    icon: PrimeIcons.WAREHOUSE,
    routerLink: '/dashboard/inventory',
    iconClass: 'text-(--p-primary-400)',
  },
];
