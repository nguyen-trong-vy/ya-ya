//feat/them-vao-gio(06)

import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    cartItems,
    cartCount,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 999,
      display: 'flex',
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(44, 24, 16, 0.5)',
      backdropFilter: 'blur(4px)',
      transition: 'all 0.3s ease'
    }}>
      {/* Backdrop overlay click to close */}
      <div
        style={{ flex: 1 }}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer content */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#FFFFFF',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-8px 0 24px rgba(0, 0, 0, 0.15)',
        animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #F3EDE8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FDFBF7'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#451A03',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: '1.15rem',
                fontWeight: '700',
                color: '#451A03',
                fontFamily: 'var(--font-heading)'
              }}>
                Giỏ hàng của bạn
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#78655A' }}>
                {cartCount} sản phẩm đã chọn
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.5rem',
              cursor: 'pointer',
              color: '#78655A',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div style={{
          backgroundColor: '#FFFBEB',
          padding: '0.75rem 1.5rem',
          borderBottom: '1px solid #FEF3C7',
          fontSize: '0.85rem',
          color: '#92400E',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>🛵</span>
          <span><strong>Miễn phí vận chuyển</strong> trong phạm vi 2km cho mọi đơn bánh!</span>
        </div>

        {/* Cart Item List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {cartItems.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: '#A89990'
            }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🧁</div>
              <p style={{ fontSize: '1rem', fontWeight: '600', color: '#574238', marginBottom: '0.5rem' }}>
                Giỏ hàng của bạn đang trống!
              </p>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Hãy chọn cho mình những chiếc bánh thơm ngon ngọt ngào nhé.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{
                  backgroundColor: '#451A03',
                  color: '#FFFFFF',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '10px',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Khám phá Menu bánh
              </button>
            </div>
          ) : (
            cartItems.map(item => (
              <div
                key={item.product.id}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '0.875rem',
                  backgroundColor: '#FDFBF7',
                  borderRadius: '14px',
                  border: '1px solid #F3EDE8',
                  alignItems: 'center'
                }}
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                    backgroundColor: '#FFFFFF'
                  }}
                  onError={(e) => {
                    e.target.src = '/images/danh mục sản phẩm/danh muc san pham 1.avif';
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{
                    margin: '0 0 0.25rem 0',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    color: '#2C1810',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.product.name}
                  </h4>
                  <p style={{
                    margin: '0 0 0.5rem 0',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: '#D97706'
                  }}>
                    {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ
                  </p>

                  {/* Quantity Controls */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E7DDD4',
                    overflow: 'hidden'
                  }}>
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '0.25rem 0.5rem',
                        cursor: 'pointer',
                        color: '#451A03'
                      }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{
                      padding: '0 0.5rem',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: '#451A03'
                    }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '0.25rem 0.5rem',
                        cursor: 'pointer',
                        color: '#451A03'
                      }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  title="Xóa sản phẩm"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    color: '#DC2626',
                    opacity: 0.8
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer with checkout summary */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid #F3EDE8',
            backgroundColor: '#FDFBF7'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <span style={{ fontSize: '0.95rem', color: '#78655A', fontWeight: '500' }}>
                Tổng cộng tạm tính:
              </span>
              <span style={{
                fontSize: '1.35rem',
                fontWeight: '800',
                color: '#451A03',
                fontFamily: 'var(--font-heading)'
              }}>
                {cartTotal.toLocaleString('vi-VN')}đ
              </span>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                navigate('/checkout');
              }}
              style={{
                width: '100%',
                backgroundColor: '#451A03',
                color: '#FFFFFF',
                padding: '0.875rem',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(69, 26, 3, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              <span>Tiến hành đặt bánh ngay</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}