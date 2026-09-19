//feat/danh-muc


import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProducts, getCategories } from '../../api/catalogApi';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Eye, ArrowUpDown, ChevronRight, Loader2 } from 'lucide-react';
import ProductModal from '../../components/ProductModal';

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState(slug || 'all');
  const [sortOption, setSortOption] = useState('default');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API Backend FastAPI để lấy 5 danh mục và 22 sản phẩm trực tiếp từ Supabase (100% dữ liệu động)
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        setLoading(true);
        const [catsRes, prodsRes] = await Promise.all([
          getCategories(),
          getProducts()
        ]);

        if (isMounted) {
          if (catsRes && Array.isArray(catsRes)) {
            setCategories(catsRes);
          }
          if (prodsRes && Array.isArray(prodsRes)) {
            const mapped = prodsRes.map(p => ({
              id: p.id,
              categorySlug: p.category_slug,
              categoryName: p.category_name,
              name: p.name,
              slug: p.slug,
              price: p.price,
              formattedPrice: `${Number(p.price).toLocaleString('vi-VN')}đ`,
              description: p.description,
              image: p.image_url || '/images/sản phẩm nổi bật/banh sinh nhat.avif'
            }));
            setProducts(mapped);
          }
        }
      } catch (error) {
        console.error('[CategoryPage] Lỗi truy vấn dữ liệu từ Supabase API:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
    return () => { isMounted = false; };
  }, []);

  // Cập nhật selectedCategory khi param URL thay đổi và cuộn lên đầu trang
  useEffect(() => {
    setSelectedCategory(slug || 'all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleTabChange = (targetSlug) => {
    setSelectedCategory(targetSlug);
    if (targetSlug === 'all') {
      navigate('/categories');
    } else {
      navigate(`/categories/${targetSlug}`);
    }
  };

  // Lọc sản phẩm
  const filteredList = useMemo(() => {
    let list = selectedCategory === 'all'
      ? products
      : products.filter(p => p.categorySlug === selectedCategory);

    if (sortOption === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, selectedCategory, sortOption]);

  const activeCategoryObj = categories.find(c => c.slug === selectedCategory);

  return (
    <div style={{ backgroundColor: '#FDFBF7', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Breadcrumb Header */}
      <div style={{
        backgroundColor: '#F7EFE9',
        borderBottom: '1px solid #EADCCF',
        padding: '2.5rem 1.5rem'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            color: '#78655A',
            marginBottom: '0.75rem'
          }}>
            <Link to="/" style={{ color: '#5C2C16', textDecoration: 'none', fontWeight: '600' }}>
              Trang chủ
            </Link>
            <ChevronRight size={14} />
            <span style={{ color: '#3D1C06', fontWeight: '700' }}>
              {activeCategoryObj ? activeCategoryObj.name : 'Tất cả danh mục bánh'}
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
            color: '#3D1C06',
            margin: '0 0 0.5rem 0',
            fontWeight: '700'
          }}>
            {activeCategoryObj ? activeCategoryObj.name : 'Danh Mục Bánh Ngọt Yuu Cake'}
          </h1>
          <p style={{ color: '#6E5648', fontSize: '1.05rem', margin: 0 }}>
            {activeCategoryObj
              ? (activeCategoryObj.description || `Khám phá các mẫu bánh ${activeCategoryObj.name} tươi ngon tại Yuu Cake`)
              : 'Khám phá thế giới bánh tươi ngon, chế tác thủ công với trọn vẹn yêu thương'}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Bộ lọc Danh mục & Sắp xếp */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '2.5rem'
        }}>
          {/* Tabs danh mục */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleTabChange('all')}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '9999px',
                border: selectedCategory === 'all' ? '1px solid #451A03' : '1px solid #E5D7CC',
                backgroundColor: selectedCategory === 'all' ? '#451A03' : '#FFFFFF',
                color: selectedCategory === 'all' ? '#FFFFFF' : '#451A03',
                fontSize: '0.9rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Tất cả bánh ({products.length})
            </button>

            {categories.map(cat => {
              const isSelected = selectedCategory === cat.slug;
              const count = cat.product_count !== undefined
                ? cat.product_count
                : products.filter(p => p.categorySlug === cat.slug).length;

              return (
                <button
                  key={cat.id || cat.slug}
                  onClick={() => handleTabChange(cat.slug)}
                  style={{
                    padding: '0.55rem 1.25rem',
                    borderRadius: '9999px',
                    border: isSelected ? '1px solid #451A03' : '1px solid #E5D7CC',
                    backgroundColor: isSelected ? '#451A03' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#451A03',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Sắp xếp theo giá */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpDown size={16} color="#78655A" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: '10px',
                border: '1px solid #E5D7CC',
                backgroundColor: '#FFFFFF',
                color: '#3D1C06',
                fontSize: '0.9rem',
                fontWeight: '600',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="default">Sắp xếp: Mặc định</option>
              <option value="price-asc">Giá: Thấp đến cao</option>
              <option value="price-desc">Giá: Cao đến thấp</option>
            </select>
          </div>
        </div>

        {/* Lưới sản phẩm */}
        {loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '320px',
            gap: '1rem',
            color: '#78655A'
          }}>
            <Loader2 size={36} className="animate-spin" style={{ color: '#5C2C16' }} />
            <p style={{ fontSize: '1.05rem', fontWeight: '500' }}>Đang nạp danh sách bánh từ Supabase...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px dashed #E5D7CC',
            color: '#78655A'
          }}>
            <p style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#451A03' }}>
              Chưa có món bánh nào trong danh mục này
            </p>
            <p style={{ fontSize: '0.95rem', margin: 0 }}>
              Vui lòng chọn danh mục khác hoặc quay lại sau!
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.75rem'
          }}>
            {filteredList.map(product => (
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
                {/* Nút Xem nhanh */}
                <button
                  onClick={() => setSelectedProduct(product)}
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
                    zIndex: 2
                  }}
                >
                  <Eye size={16} />
                </button>

                {/* Vùng ảnh sản phẩm */}
                <div
                  onClick={() => setSelectedProduct(product)}
                  style={{
                    width: '100%',
                    height: '200px',
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
                      maxHeight: '180px',
                      objectFit: 'contain',
                      transition: 'transform 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onError={(e) => {
                      e.target.src = '/images/sản phẩm nổi bật/banh sinh nhat.avif';
                    }}
                  />
                </div>

                {/* Chi tiết */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: '#92400E',
                    backgroundColor: '#FCE7D7',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    alignSelf: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    {product.categoryName}
                  </span>

                  <h3
                    onClick={() => setSelectedProduct(product)}
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.15rem',
                      fontWeight: '700',
                      color: '#2C1810',
                      margin: '0 0 0.5rem 0',
                      lineHeight: 1.3,
                      cursor: 'pointer'
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
                    flex: 1
                  }}>
                    {product.description}
                  </p>

                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: '800',
                    color: '#451A03',
                    marginBottom: '1rem',
                    fontFamily: 'var(--font-heading)'
                  }}>
                    {product.formattedPrice || `${product.price.toLocaleString('vi-VN')}đ`}
                  </div>

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
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#451A03'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#5C2C16'}
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

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}