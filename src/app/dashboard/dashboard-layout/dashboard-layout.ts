import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbComponent, MenuBar } from '@dashboard/components';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-dashboard-layout',
  imports: [CommonModule, RippleModule, MenuBar, RouterOutlet, BreadcrumbComponent],
  template: `
    <main class="flex flex-col h-screen">
      <nav class="fixed w-full z-100">
        <app-menu-bar />
      </nav>
      <section class="flex-grow pt-22 px-10 pb-16 overflow-auto">
        <div class="-ml-4">
          <app-breadcrumb />
        </div>
        <router-outlet />
      </section>
    </main>
  `,
})
export class DashboardLayout {}
