import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbComponent, MenuBar } from '@dashboard/components';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-dashboard-layout',
  imports: [CommonModule, RippleModule, MenuBar, RouterOutlet, BreadcrumbComponent, ToastModule, ConfirmDialogModule],
  template: `
    <main class="flex flex-col h-dvh scroll-smooth overflow-x-hidden">
      <nav class="w-full">
        <app-menu-bar />
      </nav>
      <section class="grow pt-4 px-10 pb-12">
        <div class="-ml-4">
          <app-breadcrumb />
        </div>
        <div>
          <p-confirmdialog />
          <p-toast />
          <router-outlet />
        </div>
      </section>
    </main>
  `,
})
export class DashboardLayout { }
