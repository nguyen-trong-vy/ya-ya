//feat/admin-dashboard(12)

import { fetchClient } from './fetchClient';

/**
 * Tính năng 6.1: Lấy báo cáo thống kê doanh thu và các chỉ số KPI cho Dashboard Admin
 * @returns {Promise<Object>} { total_revenue, completed_orders, pending_orders, total_orders, total_active_products, daily_revenue, recent_orders }
 */
export async function getRevenueStatistics() {
  return await fetchClient('/statistics/revenue', {
    method: 'GET',
  });
}
