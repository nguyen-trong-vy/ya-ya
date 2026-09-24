//feat/admin-dashboard(12)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getRevenueStatistics } from '../../api/statisticsApi';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Clock,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  BarChart3,
  Calendar,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRevenueStatistics();
      setStats(data);
    } catch (err) {
      console.error('Lỗi khi nạp dữ liệu thống kê:', err);
      setError(err.message || 'Không thể nạp dữ liệu thống kê từ máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatVND = (num) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);
  };

  const formatDateLabel = (dateStr) => {
    if (!dateStr || dateStr === 'Không rõ') return 'N/A';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}`; // DD/MM
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const formatFullDate = (dateStr) => {
    if (!dateStr || dateStr === 'Không rõ') return 'N/A';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Dữ liệu cho biểu đồ cột
  const dailyData = stats?.daily_revenue || [];
  const maxRevenue = dailyData.length > 0 ? Math.max(...dailyData.map((d) => d.total_revenue), 1) : 1;

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      background: '#FDFBF7',
      padding: '2rem 1.5rem 4rem 1.5rem',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* ================= CỘT TRÁI: CÁC MỤC QUẢN TRỊ HỆ THỐNG ================= */}
        <aside style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {/* Card Thông tin Quản trị viên */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            padding: '1.5rem',
            border: '1px solid #F5EBE1',
            boxShadow: '0 4px 16px rgba(69, 26, 3, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
              }}>
                <ShieldCheck size={26} />
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '1.05rem', color: '#451A03' }}>
                  {user?.full_name || 'Quản Trị Viên'}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#DC2626', fontWeight: '700', letterSpacing: '0.3px' }}>
                  QUẢN TRỊ VIÊN HỆ THỐNG
                </div>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '0.85rem', color: '#78716C', lineHeight: 1.5 }}>
              Khu vực điều hành tiệm bánh Yuu Cake. Chọn danh mục chức năng để quản lý thực đơn và đơn hàng.
            </p>
          </div>

          {/* Danh mục các mục quản trị */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            padding: '1.25rem',
            border: '1px solid #F5EBE1',
            boxShadow: '0 4px 16px rgba(69, 26, 3, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {/* Mục 1: Quản lý thực đơn bánh */}
            <Link
              to="/admin/products"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.9rem 1rem',
                borderRadius: '12px',
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                textDecoration: 'none',
                color: '#451A03',
                transition: 'all 0.2s',
                boxShadow: '0 2px 6px rgba(217, 119, 6, 0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#FEF3C7',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Package size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>Quản Lý Bánh</div>
                  <div style={{ fontSize: '0.75rem', color: '#B45309' }}>Thêm, sửa, đổi ảnh, xóa</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{
                  background: '#FDE68A',
                  color: '#92400E',
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '6px'
                }}>
                  {stats?.total_active_products || 0}
                </span>
                <ChevronRight size={16} color="#D97706" />
              </div>
            </Link>

            {/* Mục 2: Quản lý đơn hàng */}
            <Link
              to="/admin/orders"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.9rem 1rem',
                borderRadius: '12px',
                background: '#FFF7ED',
                border: '1px solid #FED7AA',
                textDecoration: 'none',
                color: '#451A03',
                transition: 'all 0.2s',
                boxShadow: '0 2px 6px rgba(234, 88, 12, 0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#FFEDD5',
                  color: '#EA580C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>Quản Lý Đơn Hàng</div>
                  <div style={{ fontSize: '0.75rem', color: '#C2410C' }}>Xác nhận tiền mặt, giao bánh</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {(stats?.pending_orders || 0) > 0 && (
                  <span style={{
                    background: '#DC2626',
                    color: '#FFFFFF',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '6px'
                  }}>
                    {stats.pending_orders} chờ
                  </span>
                )}
                <ChevronRight size={16} color="#EA580C" />
              </div>
            </Link>

            <div style={{ height: '1px', background: '#F5EBE1', margin: '0.25rem 0' }} />

            {/* Nút làm mới dữ liệu */}
            <button
              onClick={fetchStats}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                background: '#FFFFFF',
                border: '1px solid #E7E5E4',
                color: '#451A03',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              Làm mới dữ liệu thống kê
            </button>
          </div>

          {/* Khối đơn hàng gần đây (gọn gàng dưới menu trái) */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            padding: '1.25rem',
            border: '1px solid #F5EBE1',
            boxShadow: '0 4px 16px rgba(69, 26, 3, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#451A03', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={16} color="#D97706" />
                Đơn Hàng Mới Nhất
              </div>
              <Link
                to="/admin/orders"
                style={{ fontSize: '0.75rem', fontWeight: '700', color: '#D97706', textDecoration: 'none' }}
              >
                Tất cả ›
              </Link>
            </div>

            {loading ? (
              <div style={{ padding: '1rem 0', textAlign: 'center', color: '#A8A29E', fontSize: '0.8rem' }}>
                Đang tải...
              </div>
            ) : !stats?.recent_orders || stats.recent_orders.length === 0 ? (
              <div style={{ padding: '1rem 0', textAlign: 'center', color: '#A8A29E', fontSize: '0.8rem' }}>
                Chưa có đơn hàng nào.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {stats.recent_orders.map((ord) => {
                  const isPaid = ord.payment_status === 'PAID';
                  const isPending = ord.order_status === 'PENDING';

                  return (
                    <div
                      key={ord.id}
                      style={{
                        padding: '0.65rem 0.75rem',
                        borderRadius: '10px',
                        background: '#FAFAF9',
                        border: '1px solid #F5F5F4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#1C1917' }}>
                          {ord.recipient_name}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#78716C' }}>
                          #{ord.id.substring(0, 8)}...
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '800', fontSize: '0.82rem', color: '#B45309' }}>
                          {formatVND(ord.total_amount)}
                        </div>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '0.65rem',
                          fontWeight: '700',
                          padding: '0.1rem 0.35rem',
                          borderRadius: '4px',
                          background: isPaid ? '#DCFCE7' : isPending ? '#FEF3C7' : '#F3F4F6',
                          color: isPaid ? '#166534' : isPending ? '#92400E' : '#4B5563'
                        }}>
                          {isPaid ? 'ĐÃ THU TIỀN' : isPending ? 'CHỜ XỬ LÝ' : ord.order_status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* ================= CỘT PHẢI: TỔNG QUAN, 4 KPI VÀ BIỂU ĐỒ DOANH THU ================= */}
        <main style={{ minWidth: 0 }}>
          {/* Header Báo Cáo */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#451A03', margin: '0 0 0.35rem 0', letterSpacing: '-0.5px' }}>
              Tổng Quan Hoạt Động & Doanh Thu
            </h1>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#78716C' }}>
              Theo dõi doanh số thanh toán thực tế và tiến độ xử lý đơn hàng của Tiệm Bánh Của Vy.
            </p>
          </div>

          {/* Thông báo lỗi nếu có */}
          {error && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '14px',
              padding: '1rem 1.25rem',
              color: '#991B1B',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <AlertCircle size={20} />
              <div>
                <strong>Lỗi kết nối:</strong> {error}
              </div>
            </div>
          )}

          {/* 4 Thẻ KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '1rem',
            marginBottom: '1.75rem'
          }}>
            {/* KPI 1: Tổng Doanh Thu */}
            <div style={{
              background: 'linear-gradient(135deg, #FFFBEB 0%, #FFFFFF 100%)',
              border: '1.5px solid #FDE68A',
              borderRadius: '16px',
              padding: '1.25rem',
              boxShadow: '0 4px 14px rgba(217, 119, 6, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#92400E', textTransform: 'uppercase' }}>
                  Tổng Doanh Thu
                </span>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: '#FEF3C7',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <TrendingUp size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#B45309', marginBottom: '0.2rem' }}>
                {loading ? '...' : formatVND(stats?.total_revenue)}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#78716C', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Sparkles size={12} color="#D97706" />
                Đơn đã xác nhận thu tiền
              </div>
            </div>

            {/* KPI 2: Đơn Hoàn Thành */}
            <div style={{
              background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%)',
              border: '1.5px solid #BBF7D0',
              borderRadius: '16px',
              padding: '1.25rem',
              boxShadow: '0 4px 14px rgba(22, 163, 74, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>
                  Đơn Hoàn Thành
                </span>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: '#DCFCE7',
                  color: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#15803D', marginBottom: '0.2rem' }}>
                {loading ? '...' : `${stats?.completed_orders || 0} đơn`}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#78716C' }}>
                Tổng {stats?.total_orders || 0} đơn khách đặt
              </div>
            </div>

            {/* KPI 3: Đơn Chờ Xử Lý */}
            <div style={{
              background: (stats?.pending_orders || 0) > 0 ? 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)' : '#FFFFFF',
              border: (stats?.pending_orders || 0) > 0 ? '1.5px solid #FED7AA' : '1px solid #E7E5E4',
              borderRadius: '16px',
              padding: '1.25rem',
              boxShadow: '0 4px 14px rgba(234, 88, 12, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#9A3412', textTransform: 'uppercase' }}>
                  Đơn Chờ Xử Lý
                </span>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: '#FFEDD5',
                  color: '#EA580C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Clock size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#C2410C', marginBottom: '0.2rem' }}>
                {loading ? '...' : `${stats?.pending_orders || 0} đơn`}
              </div>
              <div style={{
                fontSize: '0.74rem',
                color: (stats?.pending_orders || 0) > 0 ? '#EA580C' : '#78716C',
                fontWeight: (stats?.pending_orders || 0) > 0 ? '700' : 'normal'
              }}>
                {(stats?.pending_orders || 0) > 0 ? '⚠️ Cần tiệm chuẩn bị bánh' : 'Đã xử lý tất cả đơn'}
              </div>
            </div>

            {/* KPI 4: Bánh Đang Mở Bán */}
            <div style={{
              background: 'linear-gradient(135deg, #FDF4FF 0%, #FFFFFF 100%)',
              border: '1.5px solid #F5D0FE',
              borderRadius: '16px',
              padding: '1.25rem',
              boxShadow: '0 4px 14px rgba(168, 85, 247, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#86198F', textTransform: 'uppercase' }}>
                  Bánh Đang Bán
                </span>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: '#FCE7F3',
                  color: '#DB2777',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Package size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#9D174D', marginBottom: '0.2rem' }}>
                {loading ? '...' : `${stats?.total_active_products || 0} loại`}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#78716C' }}>
                Sản phẩm mở bán công khai
              </div>
            </div>
          </div>

          {/* Khối Biểu Đồ Cột Thống Kê Doanh Thu */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '1.75rem 2rem',
            border: '1px solid #F5EBE1',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.03)'
          }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: '1.5rem',
              borderBottom: '1px solid #F5F5F4',
              paddingBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#FEF3C7',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#451A03', margin: 0 }}>
                    Biểu Đồ Doanh Thu Theo Ngày
                  </h2>
                  <span style={{ fontSize: '0.8rem', color: '#78716C' }}>
                    Số tiền thực nhận và số đơn hàng hoàn tất theo từng mốc thời gian
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#78716C' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'linear-gradient(to top, #D97706, #F59E0B)', display: 'inline-block' }}></span>
                <span>Doanh thu ngày</span>
              </div>
            </div>

            {/* Vùng vẽ biểu đồ */}
            {loading ? (
              <div style={{ padding: '4rem 0', textAlign: 'center', color: '#A8A29E' }}>
                <RefreshCw size={28} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 0.75rem auto' }} />
                <div>Đang nạp dữ liệu biểu đồ...</div>
              </div>
            ) : dailyData.length === 0 ? (
              <div style={{
                padding: '3.5rem 1.5rem',
                textAlign: 'center',
                background: '#FAFAF9',
                borderRadius: '16px',
                border: '1px dashed #D6D3D1'
              }}>
                <Calendar size={38} color="#A8A29E" style={{ margin: '0 auto 0.75rem auto' }} />
                <div style={{ fontWeight: '700', color: '#57534E', marginBottom: '0.35rem', fontSize: '0.95rem' }}>
                  Chưa phát sinh doanh thu thanh toán
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#78716C', maxWidth: '460px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>
                  Sau khi giao bánh gặp mặt và Admin bấm <strong>"Xác nhận đã thanh toán"</strong>, các cột doanh thu sẽ tự động xuất hiện tại đây theo từng ngày.
                </p>
              </div>
            ) : (
              <div style={{ position: 'relative', marginTop: '1.5rem' }}>
                {/* Tooltip hiển thị khi rê chuột vào cột */}
                {hoveredBar && (
                  <div style={{
                    position: 'absolute',
                    top: '-50px',
                    left: `${hoveredBar.x}%`,
                    transform: 'translateX(-50%)',
                    background: '#1C1917',
                    color: '#FFFFFF',
                    padding: '0.5rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    zIndex: 20,
                    transition: 'left 0.15s ease'
                  }}>
                    <div style={{ fontWeight: '700', color: '#FDE68A' }}>
                      {formatFullDate(hoveredBar.item.date)}
                    </div>
                    <div>Doanh thu: <strong>{formatVND(hoveredBar.item.total_revenue)}</strong></div>
                    <div style={{ color: '#D6D3D1', fontSize: '0.74rem' }}>
                      Đã hoàn thành: {hoveredBar.item.order_count} đơn bánh
                    </div>
                  </div>
                )}

                {/* Khung trục đồ thị */}
                <div style={{
                  height: '260px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: dailyData.length <= 5 ? '3rem' : '1.5rem',
                  justifyContent: dailyData.length <= 5 ? 'center' : 'flex-start',
                  padding: '0 1rem 2rem 1rem',
                  borderBottom: '2px solid #E7E5E4',
                  position: 'relative',
                  overflowX: 'auto'
                }}>
                  {/* Gridline mức cao nhất */}
                  <div style={{
                    position: 'absolute',
                    top: '12%',
                    left: 0,
                    right: 0,
                    borderTop: '1px dashed #F5EBE1',
                    pointerEvents: 'none'
                  }}>
                    <span style={{ position: 'absolute', left: 4, top: -14, fontSize: '0.7rem', color: '#A8A29E' }}>
                      {formatVND(maxRevenue)}
                    </span>
                  </div>

                  {/* Gridline mức 50% */}
                  <div style={{
                    position: 'absolute',
                    top: '55%',
                    left: 0,
                    right: 0,
                    borderTop: '1px dashed #F5EBE1',
                    pointerEvents: 'none'
                  }}>
                    <span style={{ position: 'absolute', left: 4, top: -14, fontSize: '0.7rem', color: '#A8A29E' }}>
                      {formatVND(maxRevenue * 0.5)}
                    </span>
                  </div>

                  {/* Render các cột Bar */}
                  {dailyData.map((item, idx) => {
                    const heightPercent = Math.max((item.total_revenue / maxRevenue) * 85, 8);
                    return (
                      <div
                        key={item.date || idx}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const parentRect = e.currentTarget.parentElement.getBoundingClientRect();
                          const relativeX = ((rect.left + rect.width / 2 - parentRect.left) / parentRect.width) * 100;
                          setHoveredBar({ item, x: relativeX });
                        }}
                        onMouseLeave={() => setHoveredBar(null)}
                        style={{
                          flex: dailyData.length > 8 ? '0 0 54px' : '0 1 72px',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          cursor: 'pointer',
                          transition: 'transform 0.15s ease'
                        }}
                      >
                        {/* Cột Bar */}
                        <div
                          style={{
                            width: '100%',
                            height: `${heightPercent}%`,
                            background: hoveredBar?.item?.date === item.date
                              ? 'linear-gradient(180deg, #F59E0B 0%, #B45309 100%)'
                              : 'linear-gradient(180deg, #FBBF24 0%, #D97706 100%)',
                            borderRadius: '8px 8px 2px 2px',
                            boxShadow: hoveredBar?.item?.date === item.date
                              ? '0 6px 14px rgba(217, 119, 6, 0.35)'
                              : '0 2px 6px rgba(217, 119, 6, 0.15)',
                            transition: 'all 0.2s ease',
                            transform: hoveredBar?.item?.date === item.date ? 'scaleY(1.03)' : 'scaleY(1)',
                            transformOrigin: 'bottom',
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            paddingTop: '6px'
                          }}
                        >
                          {heightPercent > 35 && (
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: '700',
                              color: '#FFFFFF',
                              writingMode: 'vertical-rl',
                              textOrientation: 'mixed',
                              transform: 'rotate(180deg)',
                              opacity: 0.95
                            }}>
                              {Math.round(item.total_revenue / 1000)}k
                            </span>
                          )}
                        </div>

                        {/* Nhãn ngày bên dưới */}
                        <div style={{
                          marginTop: '0.55rem',
                          fontSize: '0.78rem',
                          fontWeight: hoveredBar?.item?.date === item.date ? '800' : '600',
                          color: hoveredBar?.item?.date === item.date ? '#B45309' : '#57534E',
                          whiteSpace: 'nowrap'
                        }}>
                          {formatDateLabel(item.date)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
