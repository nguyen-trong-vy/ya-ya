//feat/dat-hang(07)

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../api/orderApi';
import {
  ShoppingBag,
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Truck,
  ArrowLeft,
  Loader2
} from 'lucide-react';

const TIME_SLOTS = [
  '08:00 - 10:00 (Buổi sáng)',
  '10:00 - 12:00 (Trưa)',
  '14:00 - 16:00 (Đầu giờ chiều)',
  '16:00 - 18:00 (Cuối giờ chiều)',
  '18:00 - 20:30 (Buổi tối)'
];

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Lấy ngày hôm nay định dạng YYYY-MM-DD làm giá trị min
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    recipient_name: user?.full_name || '',
    recipient_phone: user?.phone || '',
    recipient_email: user?.email || '',
    delivery_address: '',
    delivery_date: todayStr,
    delivery_time_slot: TIME_SLOTS[1],
    greeting_card_message: ''
  });

  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tự động điền thông tin nếu user đã đăng nhập
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        recipient_name: prev.recipient_name || user.full_name || '',
        recipient_phone: prev.recipient_phone || user.phone || '',
        recipient_email: prev.recipient_email || user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMsg(null);
  };

  const hasItems = cartItems.length > 0 && cartTotal > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0 || cartTotal <= 0) {
      setErrorMsg('Giỏ hàng của bạn đang trống. Vui lòng chọn bánh trước khi đặt hàng.');
      return;
    }

    if (!formData.recipient_name.trim() || !formData.recipient_phone.trim() || !formData.delivery_address.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao nhận bánh.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      // Chuẩn bị payload khớp Schema OrderCreate
      const payload = {
        recipient_name: formData.recipient_name.trim(),
        recipient_phone: formData.recipient_phone.trim(),
        recipient_email: formData.recipient_email ? formData.recipient_email.trim() : null,
        delivery_address: formData.delivery_address.trim(),
        delivery_date: formData.delivery_date,
        delivery_time_slot: formData.delivery_time_slot,
        greeting_card_message: formData.greeting_card_message ? formData.greeting_card_message.trim() : null,
        items: cartItems.map(item => ({
          product_id: item.product.id && item.product.id.length > 20 ? item.product.id : null,
          product_slug: item.product.slug,
          product_name: item.product.name,
          unit_price: Number(item.product.price),
          quantity: Number(item.quantity)
        }))
      };

      const result = await createOrder(payload);

      // Dọn sạch giỏ hàng
      clearCart();

      // Chuyển sang trang đặt hàng thành công
      navigate(`/order-success/${result.id}`, { state: { order: result } });
    } catch (err) {
      console.error('Lỗi khi đặt hàng:', err);
      setErrorMsg(err.message || 'Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FDFBF7', minHeight: '100vh', padding: '3rem 1.5rem 6rem' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        {/* Nút quay lại */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#78655A',
            textDecoration: 'none',
            fontSize: '0.92rem',
            fontWeight: '600',
            marginBottom: '1.5rem'
          }}
        >
          <ArrowLeft size={16} />
          <span>Tiếp tục chọn thêm bánh</span>
        </Link>

        {/* Tiêu đề trang */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 3.5vw, 2.5rem)',
            color: '#3D1C06',
            margin: '0 0 0.5rem 0',
            fontWeight: '700'
          }}>
            Thông Tin Đặt Bánh & Thanh Toán
          </h1>
          <p style={{ color: '#6E5648', fontSize: '1rem', margin: 0 }}>
            Hoàn tất thông tin nhận hàng để Yuu Cake chuẩn bị những chiếc bánh thơm ngon nhất cho bạn
          </p>
        </div>

        {/* Bố cục 2 Cột */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          {/* CỘT TRÁI: FORM ĐIỀN THÔNG TIN */}
          <form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(69, 26, 3, 0.05)',
              border: '1px solid #F3EDE8',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}
          >
            <h3 style={{
              margin: '0 0 0.25rem 0',
              fontFamily: 'var(--font-heading)',
              fontSize: '1.3rem',
              color: '#3D1C06',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <MapPin size={20} color="#D97706" />
              <span>Địa chỉ & Thời gian nhận bánh</span>
            </h3>

            {/* Thông báo lỗi nếu có */}
            {errorMsg && (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#DC2626',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Họ tên & SĐT */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: '#451A03', marginBottom: '0.4rem' }}>
                  Họ tên người nhận <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="text"
                  name="recipient_name"
                  value={formData.recipient_name}
                  onChange={handleChange}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #E5D7CC',
                    outline: 'none',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: '#451A03', marginBottom: '0.4rem' }}>
                  Số điện thoại nhận bánh <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="tel"
                  name="recipient_phone"
                  value={formData.recipient_phone}
                  onChange={handleChange}
                  placeholder="Ví dụ: 0944100001"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #E5D7CC',
                    outline: 'none',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: '#451A03', marginBottom: '0.4rem' }}>
                Email nhận hóa đơn & xác nhận
              </label>
              <input
                type="email"
                name="recipient_email"
                value={formData.recipient_email}
                onChange={handleChange}
                placeholder="email@example.com"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #E5D7CC',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            {/* Địa chỉ nhận */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: '#451A03', marginBottom: '0.4rem' }}>
                Địa chỉ giao nhận bánh chi tiết <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                name="delivery_address"
                value={formData.delivery_address}
                onChange={handleChange}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #E5D7CC',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            {/* Ngày giao & Khung giờ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: '#451A03', marginBottom: '0.4rem' }}>
                  Ngày giao bánh <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="date"
                  name="delivery_date"
                  min={todayStr}
                  value={formData.delivery_date}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #E5D7CC',
                    outline: 'none',
                    fontSize: '0.95rem',
                    backgroundColor: '#FFFFFF'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: '#451A03', marginBottom: '0.4rem' }}>
                  Khung giờ nhận bánh <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <select
                  name="delivery_time_slot"
                  value={formData.delivery_time_slot}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #E5D7CC',
                    outline: 'none',
                    fontSize: '0.95rem',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  {TIME_SLOTS.map((slot, idx) => (
                    <option key={idx} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Lời chúc ghi thiệp tặng kèm */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: '#451A03', marginBottom: '0.4rem' }}>
                Lời chúc thiệp tặng kèm (Tùy chọn, tối đa 250 ký tự)
              </label>
              <textarea
                name="greeting_card_message"
                value={formData.greeting_card_message}
                onChange={handleChange}
                maxLength={250}
                rows={3}
                placeholder="Nhập lời chúc yêu thương để tiệm viết nắn nót lên thiệp gửi tặng người nhận..."
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #E5D7CC',
                  outline: 'none',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  resize: 'none'
                }}
              />
            </div>

            {/* Phương thức thanh toán cố định DIRECT_MEETUP */}
            <div style={{
              backgroundColor: '#FDF8F3',
              borderRadius: '14px',
              padding: '1.25rem',
              border: '1px solid #F3EDE8'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <CheckCircle size={18} color="#166534" />
                <span style={{ fontWeight: '700', color: '#451A03', fontSize: '0.95rem' }}>
                  Phương thức thanh toán: Trực tiếp khi gặp mặt (DIRECT_MEETUP)
                </span>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#78655A', margin: 0, lineHeight: 1.5 }}>
                💵 Bạn chỉ cần chuẩn bị tiền mặt và thanh toán trực tiếp cho nhân viên giao hàng hoặc chủ tiệm khi nhận được bánh đúng giờ hẹn.
              </p>
            </div>

            {/* Nút gửi đơn hàng */}
            <button
              type="submit"
              disabled={isSubmitting || !hasItems}
              style={{
                backgroundColor: hasItems ? '#451A03' : '#A89990',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '1rem',
                fontSize: '1.05rem',
                fontWeight: '700',
                cursor: hasItems && !isSubmitting ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: hasItems ? '0 6px 18px rgba(69, 26, 3, 0.25)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Đang xử lý đơn hàng...</span>
                </>
              ) : (
                <span>Xác nhận đặt bánh ngay</span>
              )}
            </button>
          </form>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '1.75rem',
            boxShadow: '0 4px 20px rgba(69, 26, 3, 0.05)',
            border: '1px solid #F3EDE8',
            position: 'sticky',
            top: '90px'
          }}>
            <h3 style={{
              margin: '0 0 1.25rem 0',
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              color: '#3D1C06',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>Tóm tắt đơn hàng</span>
              <span style={{ fontSize: '0.85rem', color: '#8A7366', fontWeight: '500' }}>
                ({cartItems.length} món)
              </span>
            </h3>

            {/* Danh sách món */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.875rem',
              maxHeight: '280px',
              overflowY: 'auto',
              marginBottom: '1.25rem',
              paddingRight: '4px'
            }}>
              {cartItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src={item.product.image || item.product.image_url}
                    alt={item.product.name}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      backgroundColor: '#FDFBF7'
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      color: '#2C1810',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {item.product.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#8A7366' }}>
                      {item.quantity} x {Number(item.product.price).toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#451A03' }}>
                    {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #F3EDE8', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: '#78655A' }}>
                <span>Tạm tính tiền bánh:</span>
                <span style={{ fontWeight: '600', color: '#2C1810' }}>{cartTotal.toLocaleString('vi-VN')}đ</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: '#78655A' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Truck size={16} color="#166534" />
                  <span>Phí giao hàng (phạm vi 2km):</span>
                </span>
                <span style={{ fontWeight: '700', color: '#166534' }}>MIỄN PHÍ</span>
              </div>

              <div style={{
                borderTop: '1px dashed #E5D7CC',
                paddingTop: '0.875rem',
                marginTop: '0.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: '700', fontSize: '1.05rem', color: '#3D1C06' }}>Tổng thanh toán:</span>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.45rem',
                  fontWeight: '800',
                  color: '#451A03'
                }}>
                  {cartTotal.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
