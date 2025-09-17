import { CommonModule } from '@angular/common';
import type { OnDestroy, OnInit } from '@angular/core';
import { Component, inject, signal } from '@angular/core';
import type { Data, UrlSegment } from '@angular/router';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription, tap } from 'rxjs';
import type { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, Breadcrumb, RouterModule],
  template: `<p-breadcrumb [model]="breadcrumbItems()" />`,
  styles: `
    :host {
      --p-breadcrumb-background: transparent; /* New background color */
    }
  `,
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  breadcrumbItems = signal<MenuItem[]>([]);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private breadcrumbs$ = Subscription.EMPTY;

  ngOnInit(): void {
    // Initial breadcrumb setup
    this.updateBreadcrumbs();

    // Subscribe to router events
    this.breadcrumbs$ = this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        tap(() => this.updateBreadcrumbs()),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.breadcrumbs$.unsubscribe();
  }

  private updateBreadcrumbs(): void {
    const crumbs: MenuItem[] = this.buildBreadcrumb(this.activatedRoute.root);
    this.breadcrumbItems.set(crumbs);
  }

  private buildBreadcrumb(
    route: ActivatedRoute,
    routerLink = '',
    breadcrumbs: MenuItem[] = [],
  ): MenuItem[] {
    for (const child of route.children) {
      const urlSegments: UrlSegment[] = child.snapshot.url;
      // If there are no URL segments, don't append anything to the URL
      if (urlSegments.length === 0) return this.buildBreadcrumb(child, routerLink, breadcrumbs);
      // Build the route URL to this point
      const routeURL = urlSegments.map((segment: UrlSegment) => segment.path).join('/');
      // Append to the existing URL
      routerLink += `/${routeURL}`;
      const data: Data = child.snapshot.data;
      // Validate the custom data property "breadcrumb" is specified on the route
      const label = data['label'] as string;
      const icon = data['icon'] as string;
      if (!label && !icon) {
        throw new Error(`Route with URL '${routeURL}' is missing breadcrumb data`);
      }
      // Add breadcrumb
      breadcrumbs.push({ label, icon, routerLink });
      // Recursively build breadcrumb for the next level
      return this.buildBreadcrumb(child, routerLink, breadcrumbs);
    }
    return breadcrumbs;
  }
}
