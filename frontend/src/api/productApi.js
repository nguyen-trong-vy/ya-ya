//feat/quan-ly-banh-danh-sach(14)

import { fetchClient } from './fetchClient';

/**
 * Tính năng 5.1: Admin xem danh sách bánh có phân trang
 * @param {Object} params - { page?: number, limit?: number, category_id?: string, search?: string }
 */
export async function getAdminProducts(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);
  if (params.category_id && params.category_id !== 'all') {
    query.append('category_id', params.category_id);
  }
  if (params.search && params.search.trim()) {
    query.append('search', params.search.trim());
  }

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return await fetchClient(`/products/admin-list${queryString}`, {
    method: 'GET',
  });
}
