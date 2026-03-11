import {
  IDashboardSummary,
  ISalesOverTimeEntry,
  ITopProduct,
  IStockByCategory,
} from '../models/dashboard.model';

// Helper for KPI styling using Tailwind classes
const KPI_COLORS = {
  emerald: { bg: 'bg-emerald-400/15', text: 'text-emerald-400' },
  blue: { bg: 'bg-blue-500/15', text: 'text-blue-500' },
  violet: { bg: 'bg-purple-500/15', text: 'text-purple-500' },
  amber: { bg: 'bg-amber-400/15', text: 'text-amber-400' },
  red: { bg: 'bg-red-500/15', text: 'text-red-500' },
  slate: { bg: 'bg-slate-400/15', text: 'text-slate-400' },
};

export function getKpiCards(summary: IDashboardSummary | null) {
  if (!summary) return null;

  return [
    {
      title: 'Total Products',
      value: summary.totalProducts,
      sub: `${summary.activeProducts} active / ${summary.inactiveProducts} inactive`,
      icon: 'pi pi-box',
      color: KPI_COLORS.emerald,
      format: 'number',
    },
    {
      title: 'Stock Units',
      value: summary.totalStockUnits,
      sub: 'Total units across all products',
      icon: 'pi pi-warehouse',
      color: KPI_COLORS.blue,
      format: 'number',
    },
    {
      title: 'Inventory Value',
      value: summary.totalInventoryValue,
      sub: 'Based on average cost (COGS)',
      icon: 'pi pi-receipt',
      color: KPI_COLORS.violet,
      format: 'currency',
    },
    {
      title: 'Total Revenue',
      value: summary.totalRevenue,
      sub: 'All-time outbound sales',
      icon: 'pi pi-dollar',
      color: KPI_COLORS.amber,
      format: 'currency',
    },
    {
      title: 'Total Profit',
      value: summary.totalProfit,
      sub: 'Revenue minus cost of goods (COGS)',
      icon: 'pi pi-chart-bar',
      color: summary.totalProfit >= 0 ? KPI_COLORS.emerald : KPI_COLORS.red,
      format: 'currency',
    },
    {
      title: 'Suppliers',
      value: summary.totalSuppliers,
      sub: `${summary.totalCategories} categories registered`,
      icon: 'pi pi-truck',
      color: KPI_COLORS.slate,
      format: 'number',
    },
  ];
}

export function getSalesChartData(entries: ISalesOverTimeEntry[]) {
  const labels = entries.map((e) => e.month);
  return {
    labels,
    datasets: [
      {
        type: 'bar',
        label: 'Revenue',
        data: entries.map((e) => e.revenue),
        backgroundColor: 'rgba(52, 211, 153, 0.7)',
        borderColor: 'rgba(52, 211, 153, 1)',
        borderWidth: 1,
        borderRadius: 4,
        order: 2,
      },
      {
        type: 'bar',
        label: 'Cost (COGS)',
        data: entries.map((e) => e.cost),
        backgroundColor: 'rgba(148, 163, 184, 0.5)',
        borderColor: 'rgba(148, 163, 184, 1)',
        borderWidth: 1,
        borderRadius: 4,
        order: 3,
      },
      {
        type: 'line',
        label: 'Profit',
        data: entries.map((e) => e.profit),
        borderColor: 'rgba(251, 191, 36, 1)',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(251, 191, 36, 1)',
        tension: 0.4,
        fill: false,
        order: 1,
      },
    ],
  };
}

export function getSalesChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8', font: { family: 'Inter, sans-serif', size: 12 } },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const val: number = ctx.parsed.y;
            return ` ${ctx.dataset.label}: $${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#64748b' },
        grid: { color: 'rgba(100,116,139,0.15)' },
      },
      y: {
        ticks: {
          color: '#64748b',
          callback: (v: number) =>
            '$' + v.toLocaleString('en-US', { minimumFractionDigits: 0 }),
        },
        grid: { color: 'rgba(100,116,139,0.15)' },
      },
    },
  };
}

export function getTopProductsChartData(products: ITopProduct[]) {
  return {
    labels: products.map((p) => p.productName),
    datasets: [
      {
        label: 'Units Sold',
        data: products.map((p) => p.totalSoldQuantity),
        backgroundColor: [
          'rgba(52, 211, 153, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(52, 211, 153, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };
}

export function getTopProductsChartOptions() {
  return {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${ctx.parsed.x} units sold`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#64748b' },
        grid: { color: 'rgba(100,116,139,0.15)' },
      },
      y: {
        ticks: { color: '#94a3b8', font: { size: 12 } },
        grid: { display: false },
      },
    },
  };
}

export function getStockByCategoryChartData(cats: IStockByCategory[]) {
  return {
    labels: cats.map((c) => c.categoryName),
    datasets: [
      {
        data: cats.map((c) => c.totalStock),
        backgroundColor: [
          'rgba(52, 211, 153, 0.85)',
          'rgba(59, 130, 246, 0.85)',
          'rgba(168, 85, 247, 0.85)',
          'rgba(251, 191, 36, 0.85)',
          'rgba(239, 68, 68, 0.85)',
          'rgba(99, 102, 241, 0.85)',
          'rgba(20, 184, 166, 0.85)',
          'rgba(245, 158, 11, 0.85)',
        ],
        borderColor: 'rgba(15,23,42,0.6)',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };
}

export function getDoughnutChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94a3b8', padding: 16, font: { family: 'Inter, sans-serif', size: 12 } },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${ctx.label}: ${ctx.parsed} units`,
        },
      },
    },
  };
}
