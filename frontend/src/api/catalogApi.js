//feat/SPNB-CTSP(04)
// -> feat/danh-muc(05)
import fetchClient from './fetchClient';

/**
 * Lấy danh sách toàn bộ danh mục sản phẩm từ Backend FastAPI (Supabase)
 */
export async function getCategories() {
  return await fetchClient('/categories');
}

/**
 * Lấy danh sách sản phẩm từ Backend FastAPI (Supabase)
 * @param {Object} params - { category?: string }
 */
export async function getProducts(params = {}) {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'all') {
    query.append('category', params.category);
  }

  const queryString = query.toString();
  const endpoint = queryString ? `/products?${queryString}` : '/products';

  return await fetchClient(endpoint);
}