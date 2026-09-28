//feat/SPNB-CTSP(04) - Giao diện sản phẩm nổi bật bán chạy theo thống kê CSDL

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, Flame, Sparkles, Star, Loader2 } from 'lucide-react';
import { getFeaturedProducts } from '../api/productApi';
import { useCart } from '../context/CartContext';

export default function FeaturedProducts({ onQuickView }) {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tải danh sách 4 sản phẩm bán chạy nhất theo thống kê từ Backend
  useEffect(() => {
    let isMounted = true;
    async function loadFeatured() {
      try {
        setLoading(true);
        const data = await getFeaturedProducts(4);
        if (isMounted && data && Array.isArray(data) && data.length > 0) {
          setFeaturedProducts(data.map(p => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            formattedPrice: `${Number(p.price).toLocaleString('vi-VN')}đ`,
            description: p.description,
            image: p.image_url || '/images/sản phẩm nổi bật/banh sinh nhat.avif',
            image_url: p.image_url,
            categoryName: p.category_name || 'Bánh ngọt',
            categorySlug: p.category_slug,
            sold_count: p.sold_count || 0
          })));
        }
      } catch (err) {
        console.warn('Không thể nạp sản phẩm nổi bật từ API:', err);
      } finally {
        if (isMounted) setLoading(false);
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
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: '#FEE2E2',
            color: '#DC2626',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontWeight: '800',
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <Flame size={14} />
            <span>Thực Đơn Được Yêu Thích Nhất</span>
          </div>

          <h2 style={{
            color: '#3D1C06',
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
            fontWeight: '700',
            margin: '0 0 0.5rem 0',
            letterSpacing: '-0.02em'
          }}>
            Sản phẩm bán chạy nhất
          </h2>

          <p style={{
            color: '#6E5648',
            fontSize: '1.05rem',
            margin: 0,
            fontWeight: '400'
          }}>
            Những chiếc bánh thơm ngon được khách hàng lựa chọn nhiều nhất theo thống kê đơn hàng
          </p>
        </div>

        {/* Trạng thái đang tải */}
        {loading && featuredProducts.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 1rem',
            gap: '1rem',
            color: '#8A7366'
          }}>
            <Loader2 size={36} className="animate-spin" color="#D97706" />
            <p style={{ fontSize: '0.95rem', fontWeight: '600' }}>
              Đang thống kê các món bánh bán chạy nhất...
            </p>
          </div>
        ) : (
          /* Lưới 4 sản phẩm nổi bật bán chạy nhất */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.75rem'
          }}>
            {featuredProducts.map((product, idx) => (
              <div
                key={product.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
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
                  e.currentTarget.style.boxShadow = '0 14px 30px rgba(69, 26, 3, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(69, 26, 3, 0.05)';
                }}
              >
                {/* Huy hiệu Bán Chạy / Mới Ra Lò */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  backgroundColor: product.sold_count > 0 ? '#DC2626' : '#D97706',
                  color: '#FFFFFF',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  boxShadow: product.sold_count > 0 ? '0 3px 10px rgba(220, 38, 38, 0.35)' : '0 3px 10px rgba(217, 119, 6, 0.35)',
                  zIndex: 2
                }}>
                  {product.sold_count > 0 ? (
                    <>
                      <Flame size={13} />
                      <span>Top {idx + 1} Bán chạy</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} />
                      <span>Món mới ra lò</span>
                    </>
                  )}
                </div>

                {/* Nút Xem nhanh (Quick view eye icon) */}
                <button
                  onClick={() => onQuickView(product)}
                  title="Xem nhanh chi tiết"
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #EFEAE6',
                    color: '#451A03',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 2,
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#451A03';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                    e.currentTarget.style.color = '#451A03';
                  }}
                >
                  <Eye size={17} />
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
                    overflow: 'hidden',
                    borderRadius: '14px',
                    backgroundColor: '#FDFBF7'
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      maxWidth: '92%',
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
                  {/* Danh mục & Số lượng đã bán */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.45rem',
                    gap: '0.5rem'
                  }}>
                    <span style={{
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      color: '#92400E',
                      backgroundColor: '#FEF3C7',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '8px',
                      border: '1px solid #FDE68A',
                      whiteSpace: 'nowrap'
                    }}>
                      {product.categoryName}
                    </span>
                    <span style={{
                      fontSize: '0.78rem',
                      color: '#8A7366',
                      fontWeight: '600'
                    }}>
                      {product.sold_count > 0 ? `Đã bán ${product.sold_count} chiếc` : '⭐ 5.0'}
                    </span>
                  </div>

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
                    {product.formattedPrice || `${Number(product.price).toLocaleString('vi-VN')}đ`}
                  </div>

                  {/* Nút Thêm vào giỏ */}
                  <button
                    onClick={() => addToCart(product, 1)}
                    style={{
                      width: '100%',
                      backgroundColor: '#5C2C16',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
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
        )}
      </div>
    </section>
  );
}