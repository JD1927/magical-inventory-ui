import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { DashboardStore } from '@dashboard/store/dashboard.store';
import { dashboardApiEvents } from '@dashboard/store/events/dashboard-api-events';
import { Dispatcher } from '@ngrx/signals/events';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import {
  getKpiCards,
  getSalesChartData,
  getSalesChartOptions,
  getTopProductsChartData,
  getTopProductsChartOptions,
  getStockByCategoryChartData,
  getDoughnutChartOptions,
} from '../utils/dashboard.utils';

@Component({
  selector: 'app-home-page',
  imports: [
    CommonModule,
    CurrencyPipe,
    ChartModule,
    CardModule,
    TableModule,
    TagModule,
    SkeletonModule,
  ],
  templateUrl: './home-page.html',
})
export class HomePage implements OnInit {
  store = inject(DashboardStore);
  dispatcher = inject(Dispatcher);

  ngOnInit(): void {
    this.dispatcher.dispatch(dashboardApiEvents.load());
  }

  // KPI Cards
  kpiCards = computed(() => getKpiCards(this.store.summary()));

  // Sales Over Time Chart
  salesChartData = computed(() => getSalesChartData(this.store.salesOverTime()));
  salesChartOptions = getSalesChartOptions();

  // Top Products Chart
  topProductsChartData = computed(() => getTopProductsChartData(this.store.topProducts()));
  topProductsChartOptions = getTopProductsChartOptions();

  // Stock by Category (Doughnut)
  stockByCategoryChartData = computed(() => getStockByCategoryChartData(this.store.stockByCategory()));
  doughnutChartOptions = getDoughnutChartOptions();
}
