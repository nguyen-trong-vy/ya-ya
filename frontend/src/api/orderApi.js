//feat/dat-hang(07)
//feat/ho-so-va-lich-su-don(08)
//feat/quan-ly-don-hang(13)

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

//feat/quan-ly-don-hang(13)
/**
 * Tính năng 4.2: Admin xem toàn bộ danh sách đơn hàng
 * @param {Object} params - { order_status, payment_status }
 */
export async function getAdminOrders(params = {}) {
  const query = new URLSearchParams();
  if (params.order_status) query.append('order_status', params.order_status);
  if (params.payment_status) query.append('payment_status', params.payment_status);

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return await fetchClient(`/orders${queryString}`, {
    method: 'GET',
  });
}

//feat/quan-ly-don-hang(13)
/**
 * Tính năng 4.3: Admin xác nhận đã nhận tiền khi gặp mặt (DIRECT_MEETUP)
 * @param {string} orderId
 */
export async function confirmOrderPayment(orderId) {
  return await fetchClient(`/orders/${orderId}/confirm-payment`, {
    method: 'PUT',
  });
}

//feat/quan-ly-don-hang(13)
/**
 * Tính năng 4.2: Admin cập nhật trạng thái đơn hàng (PENDING, CONFIRMED, DELIVERING, COMPLETED, CANCELLED)
 * @param {string} orderId
 * @param {string} orderStatus
 */
export async function updateOrderStatus(orderId, orderStatus) {
  return await fetchClient(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ order_status: orderStatus }),
  });
}

