//feat/them-vao-gio(06)
// có kèm đn-đk

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, User, LogOut, ChevronDown } from 'lucide-react';
import { CATEGORIES_DATA } from '../data/bakeryData';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isHome = location.pathname === '/';

  return (
    <header style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #EFEAE6',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 2px 10px rgba(69, 26, 3, 0.04)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Brand Logo - Yuu Cake */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            color: '#3D1C06'
          }}
        >
          <span style={{
            fontFamily: 'var(--font-brand), "Pacifico", cursive',
            fontSize: '1.9rem',
            fontWeight: '700',
            letterSpacing: '-0.02em',
            color: '#3D1C06',
            textShadow: '0 1px 2px rgba(69,26,3,0.1)'
          }}>
            Yuu Cake
          </span>
        </Link>

        {/* Navigation Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem'
        }}>
          {/* Trang chủ */}
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              padding: '0.45rem 1.1rem',
              borderRadius: '8px',
              backgroundColor: isHome ? '#E2B89D' : 'transparent',
              color: '#3D1C06',
              fontWeight: isHome ? '700' : '600',
              fontSize: '0.98rem',
              transition: 'all 0.2s'
            }}
          >
            Trang chủ
          </Link>

          {/* Sản phẩm Dropdown Menu */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.45rem 0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: '#3D1C06',
                fontWeight: location.pathname.startsWith('/categories') ? '700' : '600',
                backgroundColor: location.pathname.startsWith('/categories') ? '#E2B89D' : 'transparent',
                fontSize: '0.98rem',
                cursor: 'pointer',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}
            >
              <span>Sản phẩm</span>
              <ChevronDown
                size={16}
                style={{
                  transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }}
              />
            </button>

            {/* Dropdown Menu xổ xuống */}
            {isDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                width: '230px',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                boxShadow: '0 12px 30px rgba(69, 26, 3, 0.12)',
                border: '1px solid #F0E8E2',
                padding: '0.5rem',
                zIndex: 60,
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}>
                <Link
                  to="/categories"
                  onClick={() => setIsDropdownOpen(false)}
                  style={{
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: '#451A03',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    backgroundColor: '#FDFBF7'
                  }}
                >
                  ✨ Xem tất cả bánh
                </Link>
                <div style={{ height: '1px', backgroundColor: '#F3EDE8', margin: '4px 0' }} />
                {CATEGORIES_DATA.map(cat => (
                  <Link
                    key={cat.id || cat.slug}
                    to={`/categories/${cat.slug}`}
                    onClick={() => setIsDropdownOpen(false)}
                    style={{
                      padding: '0.55rem 0.85rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: '#4A2818',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FDFBF7'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span>{cat.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#A89990' }}>({cat.count})</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right Action: Cart Button & Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Nút Giỏ Hàng với Badge số lượng màu đỏ */}
          <button
            onClick={() => setIsCartOpen(true)}
            title="Xem giỏ hàng"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: '#5C2C16',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              transition: 'transform 0.15s, background-color 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#451A03'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#5C2C16'}
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                fontSize: '0.7rem',
                fontWeight: '800',
                minWidth: '18px',
                height: '18px',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                border: '2px solid #FFFFFF',
                boxShadow: '0 2px 5px rgba(220, 38, 38, 0.4)'
              }}>
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {/* User Auth Info / Nút Đăng nhập */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#451A03' }}>
                {user?.full_name || 'Khách hàng'}
              </span>
              <button
                onClick={handleLogout}
                title="Đăng xuất"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.4rem',
                  cursor: 'pointer',
                  color: '#78655A',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                backgroundColor: '#5C2C16',
                color: '#FFFFFF',
                padding: '0.5rem 1.1rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 2px 8px rgba(92, 44, 22, 0.2)'
              }}
            >
              <User size={16} />
              <span>Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}