//feat/dang-nhap(03)
//feat/admin-dashboard(12)


import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../api/authApi';
import { Cake, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, Loader2, ShieldAlert, Info } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Xác định xem người dùng có phải vừa bị đá về từ route được bảo vệ không
  const fromPath = location.state?.from?.pathname;
  const isAdminRequired = fromPath?.startsWith('/admin');
  const redirectWarning = isAdminRequired
    ? 'Khu vực này yêu cầu đăng nhập bằng tài khoản Quản trị viên (Admin).'
    : fromPath
    ? 'Vui lòng đăng nhập để tiếp tục truy cập trang bạn vừa yêu cầu.'
    : null;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // 1. Validation phía client
    const emailClean = formData.email.trim().toLowerCase();
    if (!emailClean) {
      setError('Vui lòng nhập địa chỉ email của bạn.');
      return;
    }

    if (!formData.password) {
      setError('Vui lòng nhập mật khẩu.');
      return;
    }

    // 2. Gửi request đăng nhập
    setLoading(true);
    try {
      const response = await loginUser({
        email: emailClean,
        password: formData.password,
      });

      // 3. Cập nhật AuthContext & localStorage
      login(response.token, response.user);
      setSuccess(`Chào mừng bạn trở lại, ${response.user.full_name}!`);

      // 4. Chuyển hướng sau 1 giây: Nếu là admin chuyển thẳng vào /admin, nếu khách thì về trang trước hoặc trang chủ
      const destination = response.user?.role === 'admin' ? '/admin' : (fromPath || '/');
      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 1000);

    } catch (err) {
      setError(err.message || 'Đăng nhập không thành công. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: '#FDFBF7',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: '#FFFFFF',
        borderRadius: '20px',
        boxShadow: '0 10px 30px -5px rgba(217, 119, 6, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03)',
        border: '1px solid #F5EBE1',
        padding: '2.5rem 2rem',
        boxSizing: 'border-box'
      }}>
        {/* Tiêu đề & Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            marginBottom: '1rem',
            boxShadow: '0 8px 16px rgba(217, 119, 6, 0.25)'
          }}>
            <Cake size={30} />
          </div>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            color: '#451A03',
            margin: '0 0 0.5rem 0',
            letterSpacing: '-0.02em'
          }}>
            Đăng Nhập
          </h1>
          <p style={{ fontSize: '0.925rem', color: '#78716C', margin: 0 }}>
            Chào mừng bạn quay lại với Tiệm Bánh Của Vy!
          </p>
        </div>

        {/* Banner cảnh báo khi bị điều hướng từ Protected Route */}
        {redirectWarning && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: isAdminRequired ? '#FEF2F2' : '#FFFBEB',
            border: `1px solid ${isAdminRequired ? '#FCA5A5' : '#FCD34D'}`,
            color: isAdminRequired ? '#DC2626' : '#92400E',
            padding: '0.875rem 1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            lineHeight: 1.4,
            fontWeight: '500'
          }}>
            {isAdminRequired ? <ShieldAlert size={20} style={{ flexShrink: 0 }} /> : <Info size={20} style={{ flexShrink: 0 }} />}
            <span>{redirectWarning}</span>
          </div>
        )}

        {/* Thông báo lỗi */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#DC2626',
            padding: '0.875rem 1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            lineHeight: 1.4
          }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Thông báo thành công */}
        {success && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: '#F0FDF4',
            border: '1px solid #86EFAC',
            color: '#16A34A',
            padding: '0.875rem 1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            lineHeight: 1.4
          }}>
            <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {/* Form Đăng nhập */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#451A03', marginBottom: '0.4rem' }}>
              Địa chỉ Email
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#A8A29E' }}>
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                placeholder="vy.cake@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.75rem',
                  borderRadius: '10px',
                  border: '1px solid #D6D3D1',
                  fontSize: '0.95rem',
                  color: '#292524',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  background: '#FAFAF9'
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#451A03' }}>
                Mật khẩu
              </label>
              <Link
                to="/forgot-password"
                style={{ fontSize: '0.8rem', color: '#D97706', textDecoration: 'none', fontWeight: '600' }}
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#A8A29E' }}>
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Nhập mật khẩu của bạn"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 2.75rem 0.75rem 2.75rem',
                  borderRadius: '10px',
                  border: '1px solid #D6D3D1',
                  fontSize: '0.95rem',
                  color: '#292524',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  background: '#FAFAF9'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.875rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#78716C',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.875rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              background: loading
                ? '#E7E5E4'
                : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: loading ? '#A8A29E' : '#FFFFFF',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 6px 16px rgba(217, 119, 6, 0.3)',
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Đang đăng nhập...</span>
              </>
            ) : (
              <>
                <span>Đăng nhập</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          textAlign: 'center',
          paddingTop: '1.5rem',
          borderTop: '1px solid #F5EBE1',
          fontSize: '0.9rem',
          color: '#78716C'
        }}>
          Chưa có tài khoản?{' '}
          <Link
            to="/register"
            style={{
              color: '#D97706',
              fontWeight: '700',
              textDecoration: 'none',
            }}
          >
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}