import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbComponent, MenuBar } from '@dashboard/components';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-dashboard-layout',
  imports: [CommonModule, RippleModule, MenuBar, RouterOutlet, BreadcrumbComponent],
  template: `
    <main class="flex flex-col h-dvh scroll-smooth overflow-x-hidden">
      <nav class="w-full">
        <app-menu-bar />
      </nav>
      <section class="flex-grow pt-4 px-10 pb-12">
        <div class="-ml-4">
          <app-breadcrumb />
        </div>
        <div>
          <router-outlet />
        </div>
      </section>
    </main>
  `,
})
export class DashboardLayout {}
