//feat/SPNB-CTSP(04)


import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Star, Heart, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductModal({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(44, 24, 16, 0.65)',
      backdropFilter: 'blur(6px)',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '720px',
        width: '100%',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #E7DDD4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            color: '#451A03'
          }}
        >
          <X size={18} />
        </button>

        {/* Product Image Column */}
        <div style={{
          flex: '1 1 300px',
          backgroundColor: '#FDFBF7',
          padding: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRight: '1px solid #F3EDE8'
        }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              maxWidth: '100%',
              maxHeight: '280px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 12px 20px rgba(69, 26, 3, 0.15))',
              transition: 'transform 0.3s'
            }}
          />
        </div>

        {/* Product Details Column */}
        <div style={{
          flex: '1 1 340px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#FCE7D7',
              color: '#92400E',
              fontSize: '0.8rem',
              fontWeight: '700',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              marginBottom: '0.75rem'
            }}>
              {product.categoryName}
            </div>

            <h3 style={{
              margin: '0 0 0.5rem 0',
              fontSize: '1.45rem',
              fontWeight: '800',
              color: '#3D1C06',
              fontFamily: 'var(--font-heading)',
              lineHeight: 1.25
            }}>
              {product.name}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', color: '#F59E0B' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#F59E0B" />
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', color: '#78655A', fontWeight: '600' }}>
                {product.rating || '5.0'} (Đã bán {product.sold || 99}+)
              </span>
            </div>

            <div style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              color: '#451A03',
              marginBottom: '1rem',
              fontFamily: 'var(--font-heading)'
            }}>
              {product.formattedPrice || `${product.price.toLocaleString('vi-VN')}đ`}
            </div>

            <p style={{
              fontSize: '0.92rem',
              color: '#5C4A3E',
              lineHeight: 1.6,
              marginBottom: '1.5rem'
            }}>
              {product.description}
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              marginBottom: '1.5rem',
              fontSize: '0.85rem',
              color: '#166534'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#166534" />
                <span>Nguyên liệu tươi mới trong ngày, không chất bảo quản</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#166534" />
                <span>Tặng kèm thiệp & bộ nến cao cấp theo yêu cầu</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {/* Quantity Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F7F3EF',
              borderRadius: '12px',
              border: '1px solid #E7DDD4',
              padding: '0.25rem'
            }}>
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.5rem 0.75rem',
                  cursor: 'pointer',
                  color: '#451A03'
                }}
              >
                <Minus size={16} />
              </button>
              <span style={{
                padding: '0 0.75rem',
                fontWeight: '700',
                fontSize: '1rem',
                color: '#451A03'
              }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.5rem 0.75rem',
                  cursor: 'pointer',
                  color: '#451A03'
                }}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAdd}
              style={{
                flex: 1,
                backgroundColor: '#451A03',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '0.85rem 1.25rem',
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(69, 26, 3, 0.25)',
                transition: 'all 0.2s'
              }}
            >
              <ShoppingBag size={18} />
              <span>Thêm vào giỏ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}