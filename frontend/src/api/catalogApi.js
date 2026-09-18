//feat/SPNB-CTSP(04)


import { fetchClient } from './fetchClient';

/**
 * Lấy danh sách sản phẩm từ Backend FastAPI (Supabase)
 */
export async function getProducts() {
  return await fetchClient('/products');
}