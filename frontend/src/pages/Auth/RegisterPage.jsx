//feat/dang-ky(01)

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/authApi';
import { Cake, User, Mail, Lock, Phone, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

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

    // 1. Validate phía Client
    if (!formData.full_name.trim()) {
      setError('Vui lòng nhập họ và tên của bạn.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Vui lòng nhập địa chỉ email.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có độ dài tối thiểu 6 ký tự.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    // 2. Gọi API đăng ký
    setLoading(true);
    try {
      const payload = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim() || null,
      };

      const res = await registerUser(payload);
      setSuccess(res.message || 'Đăng ký tài khoản thành công!');

      // Chuyển hướng sang trang đăng nhập sau 1.5 giây
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };




  //giao diện

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fdf2f8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 20px 25px -5px rgba(219, 39, 119, 0.08)',
        border: '1px solid #fce7f3',
        padding: '2.5rem 2rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#831843' }}>Tạo tài khoản mới</h1>
          <p style={{ color: '#9d174d', fontSize: '0.9rem', marginTop: '0.5rem' }}>Đăng ký để nhận ưu đãi và đặt bánh dễ dàng</p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: '#fef2f2', color: '#991b1b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: '0.875rem' }}>{error}</span>
          </div>
        )}

        {success && (
          <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: '#f0fdf4', color: '#166534', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} />
            <span style={{ fontSize: '0.875rem' }}>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Họ và tên</label>
            <input
              type="text"
              name="full_name"
              placeholder="Nguyễn Văn A"
              value={formData.full_name}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              placeholder="0912 345 678"
              value={formData.phone}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Mật khẩu</label>
            <input
              type="password"
              name="password"
              placeholder="Tối thiểu 6 ký tự"
              value={formData.password}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Xác nhận mật khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '1rem',
              width: '100%',
              padding: '0.875rem',
              backgroundColor: '#db2777',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <>Đăng ký ngay <ArrowRight size={18} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginTop: '1.5rem' }}>
          Đã có tài khoản?{' '}
          <Link to="/login" style={{ color: '#db2777', fontWeight: 600, textDecoration: 'none' }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}