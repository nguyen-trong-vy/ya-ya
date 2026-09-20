//feat/dat-hang(07)

import { fetchClient } from './fetchClient';

/**
 * Gửi yêu cầu đặt hàng mới (Thanh toán trực tiếp khi gặp mặt - DIRECT_MEETUP)
 * @param {Object} orderData - Dữ liệu người nhận, ngày giao, khung giờ, lời chúc thiệp và mảng items
 */
export async function createOrder(orderData) {
  return await fetchClient('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}
