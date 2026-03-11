import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import type {
  IDashboardSummary,
  ISalesOverTimeEntry,
  ITopProduct,
  IStockAlert,
  IStockByCategory,
} from '../../models/dashboard.model';

export interface IDashboardLoadedPayload {
  summary: IDashboardSummary;
  salesOverTime: ISalesOverTimeEntry[];
  topProducts: ITopProduct[];
  stockAlerts: IStockAlert[];
  stockByCategory: IStockByCategory[];
}

export const dashboardApiEvents = eventGroup({
  source: 'Dashboard API',
  events: {
    load: type<void>(),
    loadedSuccess: type<IDashboardLoadedPayload>(),
    loadedFailure: type<string>(),
  },
});
