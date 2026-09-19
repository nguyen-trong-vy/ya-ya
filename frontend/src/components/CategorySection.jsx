//feat/danh-muc(05)


import React from 'react';
import { CATEGORIES_DATA } from '../data/bakeryData';
import { useNavigate } from 'react-router-dom';

export default function CategorySection() {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/categories/${category.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      id="categories"
      style={{
        backgroundColor: '#FBF7F4',
        padding: '4.5rem 1.5rem',
        borderTop: '1px solid #F3EDE8'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
        {/* Tiêu đề mục */}
        <h2 style={{
          color: '#3D1C06',
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
          fontWeight: '700',
          margin: '0 0 0.5rem 0',
          letterSpacing: '-0.02em'
        }}>
          Danh mục sản phẩm
        </h2>

        {/* Phụ đề */}
        <p style={{
          color: '#6E5648',
          fontSize: '1.05rem',
          margin: '0 0 3.5rem 0',
          fontWeight: '400'
        }}>
          Các sản phẩm mà YuuCake cung cấp cho khách hàng
        </p>

        {/* Lưới danh mục 5 món bánh */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2.5rem',
          flexWrap: 'wrap'
        }}>
          {CATEGORIES_DATA.map((cat) => {
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  width: '210px',
                  padding: '1rem 0.5rem',
                  borderRadius: '16px',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className="category-card"
              >
                {/* Vùng ảnh 3D nổi tách nền */}
                <div style={{
                  width: '180px',
                  height: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  position: 'relative'
                }}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      filter: 'drop-shadow(0 14px 20px rgba(69, 26, 3, 0.12))'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.12) translateY(-6px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1) translateY(0)';
                    }}
                  />
                </div>

                {/* Tên danh mục chữ đậm màu nâu socola */}
                <h3 style={{
                  color: '#3D1C06',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  margin: 0,
                  transition: 'color 0.2s',
                  letterSpacing: '-0.01em'
                }}>
                  {cat.name}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}