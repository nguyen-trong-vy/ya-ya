//feat/admin-dashboard(12)

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSwitchAccount = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: '#FDFBF7',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        background: '#FFFFFF',
        borderRadius: '20px',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        border: '1px solid #FEE2E2',
        boxShadow: '0 10px 25px -5px rgba(220, 38, 38, 0.08)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#FEE2E2',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#DC2626',
          marginBottom: '1.25rem'
        }}>
          <ShieldAlert size={36} />
        </div>

        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: '800',
          color: '#991B1B',
          margin: '0 0 0.75rem 0'
        }}>
          403 - Quyền Truy Cập Bị Từ Chối
        </h1>

        <p style={{
          fontSize: '0.95rem',
          color: '#78716C',
          lineHeight: 1.6,
          margin: '0 0 1.5rem 0'
        }}>
          Khu vực này yêu cầu đặc quyền <strong>Quản trị viên (Admin)</strong>. Tài khoản hiện tại của bạn (<strong>{user?.email}</strong> - quyền: <strong>{user?.role}</strong>) không có quyền truy cập.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.7rem 1.25rem',
              borderRadius: '10px',
              background: '#451A03',
              color: '#FFFFFF',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}
          >
            <ArrowLeft size={16} />
            Về Trang Chủ
          </Link>

          <button
            onClick={handleSwitchAccount}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.7rem 1.25rem',
              borderRadius: '10px',
              border: '1px solid #FECACA',
              background: '#FEF2F2',
              color: '#DC2626',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} />
            Đăng nhập tài khoản khác
          </button>
        </div>
      </div>
    </div>
  );
}