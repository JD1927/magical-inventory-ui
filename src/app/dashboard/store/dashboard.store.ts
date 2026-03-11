import { inject } from '@angular/core';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { forkJoin, switchMap } from 'rxjs';
import type { HttpErrorResponse } from '@angular/common/http';
import type { IError } from '@app/common/models';
import type { IDashboardData } from '../models/dashboard.model';
import { DashboardService } from '../services/dashboard-service/dashboard-service';
import { dashboardApiEvents } from './events/dashboard-api-events';

interface DashboardState extends IDashboardData {
  loading: boolean;
  errorMessage: string | null;
}

const initialState: DashboardState = {
  summary: null,
  salesOverTime: [],
  topProducts: [],
  stockAlerts: [],
  stockByCategory: [],
  loading: false,
  errorMessage: null,
};

export const DashboardStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withReducer(
    on(dashboardApiEvents.load, (_, state) => ({
      ...state,
      loading: true,
      errorMessage: null,
    })),
    on(dashboardApiEvents.loadedSuccess, ({ payload }, state) => ({
      ...state,
      ...payload,
      loading: false,
      errorMessage: null,
    })),
    on(dashboardApiEvents.loadedFailure, ({ payload: errorMessage }, state) => ({
      ...state,
      loading: false,
      errorMessage,
    })),
  ),
  withEffects(
    (_, events = inject(Events), service = inject(DashboardService)) => ({
      loadDashboard$: events.on(dashboardApiEvents.load).pipe(
        switchMap(() =>
          forkJoin({
            summary: service.getSummary(),
            salesOverTime: service.getSalesOverTime(6),
            topProducts: service.getTopProducts(5),
            stockAlerts: service.getStockAlerts(),
            stockByCategory: service.getStockByCategory(),
          }).pipe(
            mapResponse({
              next: (result) => dashboardApiEvents.loadedSuccess(result),
              error: (error: HttpErrorResponse) => {
                const errorMessage: string =
                  (error.error as IError)?.message || 'Failed to load dashboard data';
                return dashboardApiEvents.loadedFailure(errorMessage);
              },
            }),
          ),
        ),
      ),
    }),
  ),
);
