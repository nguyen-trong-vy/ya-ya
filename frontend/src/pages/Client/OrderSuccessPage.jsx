//feat/dat-hang(07)

import React, { useEffect } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  ShoppingBag
} from 'lucide-react';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  // Bắn pháo hoa confetti khi vào trang
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D97706', '#F59E0B', '#10B981', '#451A03', '#F472B6']
      });
    } catch {
      // bỏ qua
    }
  }, []);

  return (
    <div style={{ backgroundColor: '#FDFBF7', minHeight: '100vh', padding: '4rem 1.5rem 6rem' }}>
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: '0 8px 30px rgba(69, 26, 3, 0.08)',
        border: '1px solid #F3EDE8',
        textAlign: 'center'
      }}>
        {/* Icon thành công */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: '#ECFDF5',
          color: '#10B981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <CheckCircle2 size={42} />
        </div>

        <span style={{
          fontSize: '0.85rem',
          fontWeight: '700',
          color: '#166534',
          backgroundColor: '#DCFCE7',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          display: 'inline-block',
          marginBottom: '0.75rem'
        }}>
          ĐÃ TIẾP NHẬN ĐƠN HÀNG
        </span>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(1.8rem, 3vw, 2.3rem)',
          color: '#3D1C06',
          margin: '0 0 0.75rem 0',
          fontWeight: '700'
        }}>
          Cảm Ơn Bạn Đã Đặt Bánh Tại Yuu Cake!
        </h1>

        <p style={{ color: '#6E5648', fontSize: '1rem', lineHeight: 1.6, margin: '0 0 2rem 0' }}>
          Đơn hàng của bạn đã được chuyển tới bếp của Vy. Chúng tôi sẽ chuẩn bị những nguyên liệu tươi mới nhất để làm bánh và giao đến đúng giờ hẹn!
        </p>

        {/* Khung chi tiết đơn */}
        <div style={{
          backgroundColor: '#FDFBF7',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid #EFEAE6',
          textAlign: 'left',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid #EAE2DB',
            marginBottom: '1rem'
          }}>
            <span style={{ fontSize: '0.9rem', color: '#78655A', fontWeight: '600' }}>Mã đơn hàng:</span>
            <span style={{
              fontFamily: 'monospace',
              fontWeight: '700',
              color: '#451A03',
              backgroundColor: '#FFFFFF',
              padding: '0.25rem 0.6rem',
              borderRadius: '6px',
              border: '1px solid #E5D7CC',
              fontSize: '0.85rem'
            }}>
              {orderId || order?.id || 'YUU-ORDER'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3D1C06' }}>
              <MapPin size={16} color="#D97706" />
              <span><strong>Địa chỉ giao:</strong> {order?.delivery_address || 'Địa chỉ đã ghi nhận'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3D1C06' }}>
              <Calendar size={16} color="#D97706" />
              <span><strong>Ngày giao:</strong> {order?.delivery_date}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3D1C06' }}>
              <Clock size={16} color="#D97706" />
              <span><strong>Khung giờ:</strong> {order?.delivery_time_slot}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3D1C06' }}>
              <Phone size={16} color="#D97706" />
              <span><strong>Người nhận:</strong> {order?.recipient_name} ({order?.recipient_phone})</span>
            </div>

            {order?.greeting_card_message && (
              <div style={{
                backgroundColor: '#FFFBEB',
                borderRadius: '8px',
                padding: '0.65rem 0.85rem',
                border: '1px solid #FDE68A',
                fontSize: '0.88rem',
                color: '#92400E',
                marginTop: '0.25rem'
              }}>
                💌 <strong>Lời chúc thiệp:</strong> "{order.greeting_card_message}"
              </div>
            )}
          </div>

          {/* Hộp số tiền thanh toán gặp mặt */}
          <div style={{
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px dashed #E5D7CC',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontWeight: '700', color: '#451A03', fontSize: '1rem' }}>
                Số tiền cần thanh toán khi nhận bánh:
              </div>
              <div style={{ fontSize: '0.8rem', color: '#78655A' }}>
                Phương thức: Trực tiếp khi gặp mặt (DIRECT_MEETUP)
              </div>
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              fontWeight: '800',
              color: '#D97706'
            }}>
              {order?.total_amount ? `${Number(order.total_amount).toLocaleString('vi-VN')}đ` : 'Theo hóa đơn'}
            </div>
          </div>
        </div>

        {/* Nút hành động duy nhất */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link
            to="/"
            style={{
              backgroundColor: '#451A03',
              color: '#FFFFFF',
              textDecoration: 'none',
              padding: '0.8rem 1.8rem',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(69, 26, 3, 0.25)'
            }}
          >
            <ShoppingBag size={18} />
            <span>Quay về Trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
