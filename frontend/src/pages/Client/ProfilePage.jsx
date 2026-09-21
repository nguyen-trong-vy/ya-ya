//feat/ho-so-va-lich-su-don(08)

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyOrders } from '../../api/orderApi';
import {
  User,
  ShoppingBag,
  Mail,
  Phone,
  Shield,
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Package,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Heart
} from 'lucide-react';

const ORDER_STATUS_CONFIG = {
  PENDING: {
    label: 'Chờ tiệm xác nhận',
    bg: '#FEF3C7',
    color: '#92400E',
    border: '#FDE68A'
  },
  CONFIRMED: {
    label: 'Đã xác nhận & Đang làm bánh',
    bg: '#E0E7FF',
    color: '#3730A3',
    border: '#C7D2FE'
  },
  DELIVERING: {
    label: 'Đang giao hàng',
    bg: '#F3E8FF',
    color: '#6B21A8',
    border: '#E9D5FF'
  },
  COMPLETED: {
    label: 'Đã hoàn thành',
    bg: '#DCFCE7',
    color: '#166534',
    border: '#BBF7D0'
  },
  CANCELLED: {
    label: 'Đã hủy',
    bg: '#FEE2E2',
    color: '#991B1B',
    border: '#FECACA'
  }
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'info' ? 'info' : 'orders';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState(null);
  const [expandedOrderIds, setExpandedOrderIds] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        setOrderError(null);
        const data = await getMyOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Lỗi khi tải lịch sử đơn hàng:', err);
        setOrderError('Không thể tải lịch sử đơn hàng. Vui lòng thử lại sau.');
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams(tab === 'info' ? { tab: 'info' } : { tab: 'orders' });
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrderIds(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      backgroundColor: '#FDFBF7',
      padding: '2.5rem 1.5rem 5rem'
    }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Nút quay lại trang chủ */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#78655A',
              textDecoration: 'none',
              fontSize: '0.92rem',
              fontWeight: '600'
            }}
          >
            <ArrowLeft size={16} />
            <span>Về Trang Chủ</span>
          </Link>
        </div>

        {/* Khối Banner Cá Nhân */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '2rem',
          border: '1px solid #F3EDE8',
          boxShadow: '0 4px 20px rgba(69, 26, 3, 0.04)',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: '#451A03',
              color: '#FBF8F5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '1.8rem',
              boxShadow: '0 4px 14px rgba(69, 26, 3, 0.2)'
            }}>
              {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                color: '#3D1C06',
                margin: '0 0 0.25rem 0',
                fontFamily: 'var(--font-heading)'
              }}>
                {user?.full_name || 'Khách Hàng Thân Thiết'}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  color: user?.role === 'admin' ? '#991B1B' : '#166534',
                  backgroundColor: user?.role === 'admin' ? '#FEE2E2' : '#DCFCE7',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px'
                }}>
                  {user?.role === 'admin' ? '👑 Quản Trị Viên' : 'Khách Hàng Thân Thiết'}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#8A7366' }}>
                  {user?.email}
                </span>
              </div>
            </div>
          </div>

          {/* Huy hiệu số đơn hàng */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            backgroundColor: '#FDFBF7',
            padding: '0.75rem 1.25rem',
            borderRadius: '16px',
            border: '1px solid #EFEAE6'
          }}>
            <ShoppingBag size={24} color="#D97706" />
            <div>
              <div style={{ fontSize: '0.8rem', color: '#8A7366', fontWeight: '500' }}>Đã đặt tại tiệm</div>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#451A03' }}>
                {orders.length} đơn hàng
              </div>
            </div>
          </div>
        </div>

        {/* Thanh chuyển Tab */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          borderBottom: '2px solid #EAE2DB',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => handleTabChange('orders')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'orders' ? '3px solid #451A03' : '3px solid transparent',
              marginBottom: '-2px',
              color: activeTab === 'orders' ? '#451A03' : '#8A7366',
              fontWeight: activeTab === 'orders' ? '800' : '600',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Package size={18} color={activeTab === 'orders' ? '#451A03' : '#8A7366'} />
            <span>Lịch Sử Mua Hàng</span>
            {orders.length > 0 && (
              <span style={{
                backgroundColor: activeTab === 'orders' ? '#451A03' : '#E5D7CC',
                color: activeTab === 'orders' ? '#FFFFFF' : '#451A03',
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '0.15rem 0.5rem',
                borderRadius: '9999px'
              }}>
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabChange('info')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'info' ? '3px solid #451A03' : '3px solid transparent',
              marginBottom: '-2px',
              color: activeTab === 'info' ? '#451A03' : '#8A7366',
              fontWeight: activeTab === 'info' ? '800' : '600',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <User size={18} color={activeTab === 'info' ? '#451A03' : '#8A7366'} />
            <span>Thông Tin Tài Khoản</span>
          </button>
        </div>

        {/* NỘI DUNG TAB 1: LỊCH SỬ ĐƠN HÀNG */}
        {activeTab === 'orders' && (
          <div>
            {loadingOrders ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem 1rem',
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #F3EDE8'
              }}>
                <Loader2 size={36} className="animate-spin" color="#D97706" style={{ margin: '0 auto 1rem auto' }} />
                <p style={{ color: '#8A7366', margin: 0, fontSize: '0.95rem' }}>Đang tải danh sách đơn hàng của bạn...</p>
              </div>
            ) : orderError ? (
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '16px',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <AlertCircle size={24} />
                <span>{orderError}</span>
              </div>
            ) : orders.length === 0 ? (
              /* Chưa có đơn hàng */
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid #F3EDE8',
                boxShadow: '0 4px 20px rgba(69, 26, 3, 0.04)'
              }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: '#FEF3C7',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto'
                }}>
                  <ShoppingBag size={36} />
                </div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  color: '#3D1C06',
                  margin: '0 0 0.5rem 0'
                }}>
                  Bạn chưa có đơn đặt bánh nào
                </h3>
                <p style={{ color: '#8A7366', fontSize: '0.95rem', margin: '0 0 1.75rem 0', maxWidth: '420px', marginInline: 'auto' }}>
                  Những chiếc bánh thủ công thơm nức mũi của Yuu Cake đang chờ bạn thưởng thức. Đặt thử ngay nhé!
                </p>
                <Link
                  to="/categories"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#451A03',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    padding: '0.85rem 1.75rem',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 14px rgba(69, 26, 3, 0.2)'
                  }}
                >
                  <Heart size={18} fill="#FFFFFF" />
                  <span>Khám phá Menu Bánh</span>
                </Link>
              </div>
            ) : (
              /* Danh sách đơn hàng */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {orders.map((order) => {
                  const statusInfo = ORDER_STATUS_CONFIG[order.order_status] || ORDER_STATUS_CONFIG.PENDING;
                  const isExpanded = !!expandedOrderIds[order.id];
                  const items = order.items || [];
                  const orderDate = order.created_at ? new Date(order.created_at).toLocaleDateString('vi-VN') : '';

                  return (
                    <div
                      key={order.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '20px',
                        border: '1px solid #F3EDE8',
                        padding: '1.5rem',
                        boxShadow: '0 4px 16px rgba(69, 26, 3, 0.04)',
                        transition: 'all 0.2s'
                      }}
                    >
                      {/* Tiêu đề thẻ đơn hàng */}
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        borderBottom: '1px solid #F3EDE8',
                        paddingBottom: '1rem',
                        marginBottom: '1rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            backgroundColor: '#FDFBF7',
                            border: '1px solid #E5D7CC',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#451A03'
                          }}>
                            <Package size={20} />
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontWeight: '800', color: '#3D1C06', fontSize: '0.98rem' }}>
                                Đơn hàng #{order.id.slice(0, 8).toUpperCase()}
                              </span>
                              <span style={{ fontSize: '0.8rem', color: '#8A7366' }}>• {orderDate}</span>
                            </div>
                            <div style={{ fontSize: '0.82rem', color: '#8A7366', marginTop: '2px' }}>
                              Phương thức: <strong>Tiền mặt khi gặp mặt (DIRECT_MEETUP)</strong>
                            </div>
                          </div>
                        </div>

                        {/* Huy hiệu trạng thái đơn */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: '0.82rem',
                            fontWeight: '700',
                            padding: '0.3rem 0.8rem',
                            borderRadius: '9999px',
                            backgroundColor: statusInfo.bg,
                            color: statusInfo.color,
                            border: `1px solid ${statusInfo.border}`
                          }}>
                            {statusInfo.label}
                          </span>

                          <span style={{
                            fontSize: '0.82rem',
                            fontWeight: '700',
                            padding: '0.3rem 0.8rem',
                            borderRadius: '9999px',
                            backgroundColor: order.payment_status === 'PAID' ? '#DCFCE7' : '#FEF3C7',
                            color: order.payment_status === 'PAID' ? '#166534' : '#92400E',
                            border: order.payment_status === 'PAID' ? '1px solid #BBF7D0' : '1px solid #FDE68A'
                          }}>
                            {order.payment_status === 'PAID' ? '✓ Đã thanh toán' : 'Chưa thanh toán'}
                          </span>
                        </div>
                      </div>

                      {/* Thông tin hẹn giao */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '0.75rem',
                        backgroundColor: '#FDFBF7',
                        padding: '1rem',
                        borderRadius: '12px',
                        fontSize: '0.88rem',
                        marginBottom: '1rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#451A03' }}>
                          <Calendar size={16} color="#D97706" />
                          <span><strong>Ngày giao:</strong> {order.delivery_date}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#451A03' }}>
                          <Clock size={16} color="#D97706" />
                          <span><strong>Khung giờ:</strong> {order.delivery_time_slot}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#451A03' }}>
                          <MapPin size={16} color="#D97706" />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <strong>Nơi nhận:</strong> {order.delivery_address}
                          </span>
                        </div>
                      </div>

                      {/* Lời chúc thiệp nếu có */}
                      {order.greeting_card_message && (
                        <div style={{
                          backgroundColor: '#FFFBEB',
                          border: '1px solid #FDE68A',
                          borderRadius: '10px',
                          padding: '0.6rem 0.85rem',
                          fontSize: '0.85rem',
                          color: '#92400E',
                          marginBottom: '1rem'
                        }}>
                          💌 <strong>Thiệp mừng:</strong> "{order.greeting_card_message}"
                        </div>
                      )}

                      {/* Danh sách món bánh rút gọn / mở rộng */}
                      <div style={{ borderTop: '1px dashed #EAE2DB', paddingTop: '0.75rem' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.5rem'
                        }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#3D1C06' }}>
                            Chi tiết món bánh ({items.length} loại):
                          </span>
                          <button
                            onClick={() => toggleOrderExpand(order.id)}
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              color: '#D97706',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              cursor: 'pointer'
                            }}
                          >
                            <span>{isExpanded ? 'Thu gọn' : 'Xem chi tiết'}</span>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </div>

                        {/* Món đầu tiên luôn hiển thị làm mẫu */}
                        {items.slice(0, isExpanded ? items.length : 1).map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.45rem 0',
                              fontSize: '0.88rem',
                              borderBottom: idx < (isExpanded ? items.length - 1 : 0) ? '1px solid #F8F6F4' : 'none'
                            }}
                          >
                            <span style={{ color: '#451A03', fontWeight: '600' }}>
                              {item.product_name} <span style={{ color: '#8A7366', fontWeight: '400' }}>x{item.quantity}</span>
                            </span>
                            <span style={{ fontWeight: '700', color: '#451A03' }}>
                              {(item.unit_price * item.quantity).toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                        ))}

                        {!isExpanded && items.length > 1 && (
                          <div style={{ fontSize: '0.82rem', color: '#8A7366', fontStyle: 'italic', marginTop: '2px' }}>
                            + và {items.length - 1} món bánh khác...
                          </div>
                        )}
                      </div>

                      {/* Chân thẻ: Tổng thanh toán */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '1rem',
                        paddingTop: '0.85rem',
                        borderTop: '1px solid #F3EDE8'
                      }}>
                        <span style={{ fontSize: '0.92rem', color: '#78655A', fontWeight: '600' }}>
                          Tổng tiền thu khi gặp mặt:
                        </span>
                        <span style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.35rem',
                          fontWeight: '800',
                          color: '#451A03'
                        }}>
                          {Number(order.total_amount).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* NỘI DUNG TAB 2: THÔNG TIN TÀI KHOẢN */}
        {activeTab === 'info' && (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '2rem',
            border: '1px solid #F3EDE8',
            boxShadow: '0 4px 20px rgba(69, 26, 3, 0.04)',
            maxWidth: '680px',
            margin: '0 auto'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#3D1C06',
              margin: '0 0 1.5rem 0',
              fontFamily: 'var(--font-heading)'
            }}>
              Thông Tin Tài Khoản
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.9rem 1.1rem', background: '#FDFBF7', borderRadius: '12px', border: '1px solid #F3EDE8' }}>
                <User size={20} color="#D97706" />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.78rem', color: '#8A7366', display: 'block', fontWeight: '500' }}>Họ và tên</span>
                  <strong style={{ fontSize: '0.98rem', color: '#3D1C06' }}>{user?.full_name}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.9rem 1.1rem', background: '#FDFBF7', borderRadius: '12px', border: '1px solid #F3EDE8' }}>
                <Mail size={20} color="#D97706" />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.78rem', color: '#8A7366', display: 'block', fontWeight: '500' }}>Địa chỉ Email</span>
                  <strong style={{ fontSize: '0.98rem', color: '#3D1C06' }}>{user?.email}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.9rem 1.1rem', background: '#FDFBF7', borderRadius: '12px', border: '1px solid #F3EDE8' }}>
                <Phone size={20} color="#D97706" />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.78rem', color: '#8A7366', display: 'block', fontWeight: '500' }}>Số điện thoại</span>
                  <strong style={{ fontSize: '0.98rem', color: '#3D1C06' }}>{user?.phone || 'Chưa cập nhật'}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.9rem 1.1rem', background: '#FDFBF7', borderRadius: '12px', border: '1px solid #F3EDE8' }}>
                <Shield size={20} color="#D97706" />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.78rem', color: '#8A7366', display: 'block', fontWeight: '500' }}>Quyền hạn tài khoản</span>
                  <strong style={{ fontSize: '0.98rem', color: user?.role === 'admin' ? '#991B1B' : '#166534' }}>
                    {user?.role === 'admin' ? 'Quản trị viên (Admin)' : 'Khách hàng (Client)'}
                  </strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.9rem 1.1rem', background: '#FDFBF7', borderRadius: '12px', border: '1px solid #F3EDE8' }}>
                <Calendar size={20} color="#D97706" />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.78rem', color: '#8A7366', display: 'block', fontWeight: '500' }}>Ngày tạo tài khoản</span>
                  <strong style={{ fontSize: '0.98rem', color: '#3D1C06' }}>
                    {user?.created_at ? new Date(user.created_at).toLocaleString('vi-VN') : 'Mới tạo'}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
