//feat/SPNB-CTSP(04) - giao diện người dùng


import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye } from 'lucide-react';
import { PRODUCTS_DATA } from '../data/bakeryData';
import { getProducts } from '../api/catalogApi';
import { useCart } from '../context/CartContext';

export default function FeaturedProducts({ onQuickView }) {
  const { addToCart } = useCart();

  const [featuredProducts, setFeaturedProducts] = useState(() =>
    PRODUCTS_DATA.filter(p => ['p-sn-1', 'p-sn-2', 'p-cc-1', 'p-dn-1'].includes(p.id))
  );

  // Tải dữ liệu 4 sản phẩm nổi bật từ Supabase
  useEffect(() => {
    let isMounted = true;
    async function loadFeatured() {
      try {
        const data = await getProducts();
        if (isMounted && data && Array.isArray(data) && data.length > 0) {
          // Lọc 4 sản phẩm theo slug mẫu: Socola Cherry, Socola Mềm mịn, Cupcake đào, Donut socola
          const targetSlugs = [
            'banh-sinh-nhat-socola-cherry',
            'banh-socola-mem-min',
            'banh-cupcake-dao',
            'banh-donut-socola'
          ];
          const matched = data.filter(p => targetSlugs.includes(p.slug));
          if (matched.length > 0) {
            setFeaturedProducts(matched.map(p => ({
              id: p.id,
              name: p.name,
              slug: p.slug,
              price: p.price,
              formattedPrice: `${Number(p.price).toLocaleString('vi-VN')}đ`,
              description: p.description,
              image: p.image_url || '/images/sản phẩm nổi bật/banh sinh nhat.avif',
              categoryName: p.category_name
            })));
          }
        }
      } catch (err) {
        console.warn('Sử dụng 4 sản phẩm nổi bật mặc định', err);
      }
    }
    loadFeatured();
    return () => { isMounted = false; };
  }, []);

  return (
    <section
      id="featured"
      style={{
        backgroundColor: '#FBF7F4',
        padding: '5rem 1.5rem',
        borderTop: '1px solid #F3EDE8'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Tiêu đề & phụ đề */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{
            color: '#3D1C06',
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
            fontWeight: '700',
            margin: '0 0 0.5rem 0',
            letterSpacing: '-0.02em'
          }}>
            Sản phẩm nổi bật
          </h2>

          <p style={{
            color: '#6E5648',
            fontSize: '1.05rem',
            margin: 0,
            fontWeight: '400'
          }}>
            Một số sản phẩm bán chạy trên YuuCake
          </p>
        </div>

        {/* Lưới 4 sản phẩm nổi bật chuẩn mẫu trang chủ 4.png */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.75rem'
        }}>
          {featuredProducts.map(product => (
            <div
              key={product.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 16px rgba(69, 26, 3, 0.05)',
                border: '1px solid #F3EDE8',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(69, 26, 3, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(69, 26, 3, 0.05)';
              }}
            >
              {/* Nút Xem nhanh (Quick view eye icon) */}
              <button
                onClick={() => onQuickView(product)}
                title="Xem nhanh chi tiết"
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  border: '1px solid #EFEAE6',
                  color: '#451A03',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 2,
                  transition: 'all 0.2s'
                }}
              >
                <Eye size={16} />
              </button>

              {/* Vùng ảnh sản phẩm */}
              <div
                onClick={() => onQuickView(product)}
                style={{
                  width: '100%',
                  height: '210px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  marginBottom: '1rem',
                  overflow: 'hidden'
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    maxWidth: '90%',
                    maxHeight: '190px',
                    objectFit: 'contain',
                    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onError={(e) => {
                    e.target.src = '/images/sản phẩm nổi bật/banh sinh nhat.avif';
                  }}
                />
              </div>

              {/* Thông tin sản phẩm */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3
                  onClick={() => onQuickView(product)}
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.15rem',
                    fontWeight: '700',
                    color: '#2C1810',
                    margin: '0 0 0.5rem 0',
                    lineHeight: 1.3,
                    cursor: 'pointer',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {product.name}
                </h3>

                <p style={{
                  fontSize: '0.86rem',
                  color: '#78655A',
                  lineHeight: 1.5,
                  margin: '0 0 1rem 0',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  flex: 1
                }}>
                  {product.description}
                </p>

                {/* Giá tiền nổi bật */}
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: '800',
                  color: '#451A03',
                  marginBottom: '1rem',
                  fontFamily: 'var(--font-heading)'
                }}>
                  {product.formattedPrice || `${product.price.toLocaleString('vi-VN')}đ`}
                </div>

                {/* Nút Thêm vào giỏ màu nâu socola chuẩn mẫu 4 */}
                <button
                  onClick={() => addToCart(product, 1)}
                  style={{
                    width: '100%',
                    backgroundColor: '#5C2C16',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.7rem 1rem',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 8px rgba(92, 44, 22, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#451A03';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#5C2C16';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <ShoppingBag size={17} />
                  <span>Thêm vào giỏ</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}