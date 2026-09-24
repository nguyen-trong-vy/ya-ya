//feat/footer(11)

import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, Heart, ShieldCheck } from 'lucide-react';
import { CATEGORIES_DATA } from '../data/bakeryData';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#2C1810',
      color: '#E6D7CD',
      padding: '4.5rem 1.5rem 2rem 1.5rem',
      borderTop: '4px solid #D97706'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '3rem',
        marginBottom: '3rem'
      }}>
        {/* Cột 1: Thông tin thương hiệu */}
        <div>
          <span style={{
            fontFamily: 'var(--font-brand), "Pacifico", cursive',
            fontSize: '2.2rem',
            color: '#FFFFFF',
            display: 'block',
            marginBottom: '1rem'
          }}>
            Yuu Cake
          </span>
          <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: '#C7B4A7', marginBottom: '1.5rem' }}>
            Tiệm Bánh Của Vy - Nơi trao gửi những khoảnh khắc ngọt ngào qua từng chiếc bánh được làm bằng tất cả niềm đam mê và nghệ thuật thủ công tinh tế.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F59E0B', fontSize: '0.9rem', fontWeight: '600' }}>
            <ShieldCheck size={18} />
            <span>100% Nguyên liệu tươi & chuẩn an toàn</span>
          </div>
        </div>

        {/* Cột 2: Danh mục bánh */}
        <div>
          <h4 style={{
            fontFamily: 'var(--font-heading)',
            color: '#FFFFFF',
            fontSize: '1.2rem',
            fontWeight: '700',
            marginBottom: '1.25rem'
          }}>
            Danh mục bánh
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {CATEGORIES_DATA.map(cat => (
              <li key={cat.id}>
                <Link
                  to={`/categories/${cat.slug}`}
                  style={{
                    color: '#C7B4A7',
                    textDecoration: 'none',
                    fontSize: '0.92rem',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#F59E0B'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#C7B4A7'}
                >
                  › {cat.name} ({cat.count} món)
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 3: Liên hệ & Đặt bánh */}
        <div>
          <h4 style={{
            fontFamily: 'var(--font-heading)',
            color: '#FFFFFF',
            fontSize: '1.2rem',
            fontWeight: '700',
            marginBottom: '1.25rem'
          }}>
            Liên hệ đặt bánh
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.92rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Phone size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: '700', color: '#FFFFFF' }}>Hotline đặt bánh:</div>
                <a href="tel:0944100001" style={{ color: '#F59E0B', textDecoration: 'none', fontWeight: '700' }}>
                  0944 100 001
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <MapPin size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: '700', color: '#FFFFFF' }}>Địa chỉ tiệm:</div>
                <span style={{ color: '#C7B4A7' }}>Phục vụ giao hàng nhanh trong bán kính 2km</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Clock size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: '700', color: '#FFFFFF' }}>Giờ mở cửa:</div>
                <span style={{ color: '#C7B4A7' }}>08:00 - 21:30 (Tất cả các ngày trong tuần)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cột 4: Cam kết dịch vụ */}
        <div>
          <h4 style={{
            fontFamily: 'var(--font-heading)',
            color: '#FFFFFF',
            fontSize: '1.2rem',
            fontWeight: '700',
            marginBottom: '1.25rem'
          }}>
            Chính sách giao hàng
          </h4>
          <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: '#C7B4A7', marginBottom: '1rem' }}>
            🛵 <strong>Miễn phí vận chuyển</strong> trong phạm vi 2km.
          </p>
          <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: '#C7B4A7', marginBottom: '1rem' }}>
            🎂 Bánh kem sinh nhật được đóng hộp bảo quản lạnh kỹ lưỡng, tặng kèm nến số và dao dĩa chuyên dụng.
          </p>
          <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: '#C7B4A7' }}>
            💌 Nhận viết chữ và thông điệp yêu thương lên thiệp handmade miễn phí.
          </p>
        </div>
      </div>

      {/* Dòng bản quyền dưới đáy */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        borderTop: '1px solid #3F261B',
        paddingTop: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.88rem',
        color: '#9E887B'
      }}>
        <div>
          © {new Date().getFullYear()} <strong>Tiệm Bánh Của Vy (Yuu Cake)</strong>. All rights reserved.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          Được làm với tình yêu ngọt ngào <Heart size={15} color="#EF4444" fill="#EF4444" /> và vị bánh tươi ngon.
        </div>
      </div>
    </footer>
  );
}
