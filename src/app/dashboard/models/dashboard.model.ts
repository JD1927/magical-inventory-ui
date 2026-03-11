export interface IDashboardSummary {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  totalCategories: number;
  totalSuppliers: number;
  totalStockUnits: number;
  totalInventoryValue: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
}

export interface ISalesOverTimeEntry {
  month: string; // 'YYYY-MM'
  revenue: number;
  cost: number;
  profit: number;
}

export interface ITopProduct {
  productId: string;
  productName: string;
  productSku: string;
  totalSoldQuantity: number;
  totalRevenue: number;
  totalProfit: number;
}

export interface IStockAlert {
  inventoryId: string;
  productId: string;
  productName: string;
  productSku: string;
  currentStock: number;
  minStock: number;
  deficit: number;
  lastUpdated: string;
}

export interface IStockByCategory {
  categoryName: string;
  totalStock: number;
  totalValue: number;
}

export interface IDashboardData {
  summary: IDashboardSummary | null;
  salesOverTime: ISalesOverTimeEntry[];
  topProducts: ITopProduct[];
  stockAlerts: IStockAlert[];
  stockByCategory: IStockByCategory[];
}
