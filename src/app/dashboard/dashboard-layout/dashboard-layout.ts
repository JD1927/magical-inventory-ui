import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { BreadcrumbComponent, TopBar } from '../../common/components';

@Component({
  selector: 'app-dashboard-layout',
  imports: [CommonModule, RippleModule, TopBar, RouterOutlet, BreadcrumbComponent],
  template: `
    <main class="flex flex-col h-screen">
      <nav class="fixed w-full">
        <app-top-bar />
      </nav>
      <section class="flex-grow pt-22 px-10 pb-16 overflow-auto">
        <div class="-mt-8 -ml-4">
          <app-breadcrumb />
        </div>
        <router-outlet />
      </section>
    </main>
  `,
})
export class DashboardLayout {}
