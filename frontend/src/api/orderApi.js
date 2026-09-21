//feat/dat-hang(07)
//feat/ho-so-va-lich-su-don(08)

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

//feat/ho-so-va-lich-su-don(08)
/**
 * Lấy danh sách lịch sử các đơn hàng của khách hàng đang đăng nhập
 */
export async function getMyOrders() {
  return await fetchClient('/orders/my-orders', {
    method: 'GET',
  });
}

