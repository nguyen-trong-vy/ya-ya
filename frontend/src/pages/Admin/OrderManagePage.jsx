//feat/quan-ly-don-hang(13)

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAdminOrders, confirmOrderPayment } from '../../api/orderApi';
import {
  ShoppingBag,
  ArrowLeft,
  Search,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MapPin,
  Phone,
  DollarSign,
  Loader2,
  X,
  Check
} from 'lucide-react';

export default function OrderManagePage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Ô tìm kiếm & lọc nhanh
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPayment, setFilterPayment] = useState('ALL'); // 'ALL' | 'UNPAID' | 'PAID'

  // Đơn hàng đang mở modal xác nhận đã nhận tiền
  const [confirmingOrder, setConfirmingOrder] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Tải danh sách đơn hàng từ Backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const data = await getAdminOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi khi tải đơn hàng:', err);
      setErrorMsg(err.message || 'Không thể tải danh sách đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Tự động tắt thông báo thành công sau 4s
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // Lọc theo tìm kiếm và trạng thái thanh toán
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      // Lọc theo thanh toán
      if (filterPayment === 'UNPAID' && o.payment_status !== 'UNPAID') return false;
      if (filterPayment === 'PAID' && o.payment_status !== 'PAID') return false;

      // Lọc theo từ khóa tìm kiếm
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase().trim();
      const idMatch = o.id?.toLowerCase().includes(term);
      const nameMatch = o.recipient_name?.toLowerCase().includes(term);
      const phoneMatch = o.recipient_phone?.toLowerCase().includes(term);
      const addressMatch = o.delivery_address?.toLowerCase().includes(term);
      return idMatch || nameMatch || phoneMatch || addressMatch;
    });
  }, [orders, searchTerm, filterPayment]);

  // Xác nhận đã nhận tiền mặt từ khách (Tính năng 4.3)
  const handleConfirmPayment = async () => {
    if (!confirmingOrder) return;
    try {
      setIsProcessingPayment(true);
      const updated = await confirmOrderPayment(confirmingOrder.id);
      setOrders(prev => prev.map(o => o.id === confirmingOrder.id ? { ...o, ...updated } : o));
      setSuccessMsg(`Đã xác nhận nhận đủ ${Number(confirmingOrder.total_amount).toLocaleString('vi-VN')}đ cho đơn #${confirmingOrder.id.slice(0, 8).toUpperCase()}!`);
      setConfirmingOrder(null);
    } catch (err) {
      console.error('Lỗi khi xác nhận thanh toán:', err);
      setErrorMsg(err.message || 'Không thể xác nhận thanh toán.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FDFBF7', minHeight: 'calc(100vh - 70px)', padding: '2rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Thanh tiêu đề */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <Link
              to="/admin"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#78655A',
                textDecoration: 'none',
                fontSize: '0.88rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}
            >
              <ArrowLeft size={16} />
              <span>Về Trang Admin</span>
            </Link>
            <h1 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: '800',
              color: '#3D1C06',
              margin: '0 0 0.35rem 0',
              fontFamily: 'var(--font-heading)'
            }}>
              Quản Lý Đơn Hàng & Xác Nhận Tiền
            </h1>
            <p style={{ color: '#8A7366', fontSize: '0.92rem', margin: 0 }}>
              Xem danh sách đơn khách đặt và bấm xác nhận khi đã nhận tiền mặt trực tiếp
            </p>
          </div>

          <button
            onClick={fetchOrders}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#FFFFFF',
              color: '#451A03',
              border: '1px solid #E5D7CC',
              borderRadius: '10px',
              padding: '0.6rem 1.1rem',
              fontWeight: '700',
              fontSize: '0.88rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 6px rgba(69, 26, 3, 0.04)'
            }}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>Tải lại danh sách</span>
          </button>
        </div>

        {/* Thông báo thành công / lỗi */}
        {successMsg && (
          <div style={{
            backgroundColor: '#DCFCE7',
            border: '1px solid #BBF7D0',
            color: '#166534',
            padding: '0.85rem 1.25rem',
            borderRadius: '12px',
            marginBottom: '1.25rem',
            fontSize: '0.95rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <CheckCircle2 size={20} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#DC2626',
            padding: '0.85rem 1.25rem',
            borderRadius: '12px',
            marginBottom: '1.25rem',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <AlertCircle size={20} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Bộ lọc đơn giản: Tìm kiếm & Tab Chưa thu / Đã thu */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '1rem 1.25rem',
          border: '1px solid #F3EDE8',
          boxShadow: '0 2px 10px rgba(69, 26, 3, 0.03)',
          marginBottom: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Ô tìm kiếm */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#FDFBF7',
            border: '1px solid #E5D7CC',
            borderRadius: '10px',
            padding: '0.5rem 0.85rem',
            flex: '1 1 280px'
          }}>
            <Search size={16} color="#8A7366" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên khách, SĐT, địa chỉ, mã đơn..."
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '0.9rem',
                color: '#3D1C06'
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A7366' }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Nhóm nút lọc trạng thái thanh toán */}
          <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#FDFBF7', padding: '4px', borderRadius: '10px', border: '1px solid #EAE2DB' }}>
            <button
              onClick={() => setFilterPayment('ALL')}
              style={{
                border: 'none',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.85rem',
                fontWeight: filterPayment === 'ALL' ? '700' : '600',
                backgroundColor: filterPayment === 'ALL' ? '#451A03' : 'transparent',
                color: filterPayment === 'ALL' ? '#FFFFFF' : '#6E5648',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              Tất cả ({orders.length})
            </button>

            <button
              onClick={() => setFilterPayment('UNPAID')}
              style={{
                border: 'none',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.85rem',
                fontWeight: filterPayment === 'UNPAID' ? '700' : '600',
                backgroundColor: filterPayment === 'UNPAID' ? '#D97706' : 'transparent',
                color: filterPayment === 'UNPAID' ? '#FFFFFF' : '#92400E',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              Chưa thanh toán ({orders.filter(o => o.payment_status === 'UNPAID').length})
            </button>

            <button
              onClick={() => setFilterPayment('PAID')}
              style={{
                border: 'none',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.85rem',
                fontWeight: filterPayment === 'PAID' ? '700' : '600',
                backgroundColor: filterPayment === 'PAID' ? '#166534' : 'transparent',
                color: filterPayment === 'PAID' ? '#FFFFFF' : '#166534',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              Đã thanh toán ({orders.filter(o => o.payment_status === 'PAID').length})
            </button>
          </div>
        </div>

        {/* Bảng danh sách đơn hàng */}
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 1rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #F3EDE8'
          }}>
            <Loader2 size={32} className="animate-spin" color="#D97706" style={{ margin: '0 auto 0.75rem auto' }} />
            <p style={{ color: '#8A7366', margin: 0, fontSize: '0.92rem' }}>Đang tải danh sách đơn đặt bánh...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3.5rem 1rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #F3EDE8'
          }}>
            <ShoppingBag size={42} color="#D97706" style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.1rem', color: '#3D1C06', margin: '0 0 0.25rem 0' }}>Không tìm thấy đơn hàng nào</h3>
            <p style={{ color: '#8A7366', margin: 0, fontSize: '0.88rem' }}>
              Hiện chưa có đơn đặt bánh phù hợp với bộ lọc tìm kiếm này.
            </p>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1px solid #F3EDE8',
            boxShadow: '0 4px 16px rgba(69, 26, 3, 0.03)',
            overflow: 'hidden'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '920px' }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#FDFBF7',
                    borderBottom: '1px solid #EFEAE6',
                    color: '#78655A',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em'
                  }}>
                    <th style={{ padding: '0.9rem 1.1rem' }}>Mã đơn & Ngày đặt</th>
                    <th style={{ padding: '0.9rem 1.1rem' }}>Khách hàng & Địa chỉ</th>
                    <th style={{ padding: '0.9rem 1.1rem' }}>Lịch hẹn giao</th>
                    <th style={{ padding: '0.9rem 1.1rem' }}>Bánh đặt mua</th>
                    <th style={{ padding: '0.9rem 1.1rem' }}>Số tiền cần thu</th>
                    <th style={{ padding: '0.9rem 1.1rem', textAlign: 'right' }}>Thanh toán</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const items = order.items || [];
                    const orderDateStr = order.created_at ? new Date(order.created_at).toLocaleString('vi-VN', {
                      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    }) : '';

                    const isPaid = order.payment_status === 'PAID';

                    return (
                      <tr
                        key={order.id}
                        style={{
                          borderBottom: '1px solid #F7F3EF',
                          backgroundColor: isPaid ? '#FAFCFA' : '#FFFFFF'
                        }}
                      >
                        {/* 1. Mã đơn & Ngày đặt */}
                        <td style={{ padding: '1rem 1.1rem', verticalAlign: 'top' }}>
                          <span style={{
                            fontFamily: 'monospace',
                            fontWeight: '800',
                            fontSize: '0.92rem',
                            color: '#451A03',
                            backgroundColor: '#FDFBF7',
                            padding: '0.2rem 0.45rem',
                            borderRadius: '6px',
                            border: '1px solid #E5D7CC'
                          }}>
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <div style={{ fontSize: '0.78rem', color: '#8A7366', marginTop: '5px' }}>
                            {orderDateStr}
                          </div>
                        </td>

                        {/* 2. Khách hàng & Địa chỉ */}
                        <td style={{ padding: '1rem 1.1rem', verticalAlign: 'top', maxWidth: '240px' }}>
                          <div style={{ fontWeight: '700', color: '#3D1C06', fontSize: '0.95rem' }}>
                            {order.recipient_name}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#6E5648', marginTop: '2px' }}>
                            <Phone size={13} color="#D97706" />
                            <a href={`tel:${order.recipient_phone}`} style={{ color: 'inherit', textDecoration: 'none', fontWeight: '600' }}>
                              {order.recipient_phone}
                            </a>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '4px',
                            fontSize: '0.82rem',
                            color: '#8A7366',
                            marginTop: '4px',
                            lineHeight: 1.35
                          }}>
                            <MapPin size={13} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span>{order.delivery_address}</span>
                          </div>
                          {order.greeting_card_message && (
                            <div style={{
                              marginTop: '5px',
                              fontSize: '0.78rem',
                              color: '#92400E',
                              backgroundColor: '#FFFBEB',
                              padding: '0.2rem 0.45rem',
                              borderRadius: '6px',
                              border: '1px solid #FDE68A'
                            }}>
                              💌 "{order.greeting_card_message}"
                            </div>
                          )}
                        </td>

                        {/* 3. Lịch hẹn giao */}
                        <td style={{ padding: '1rem 1.1rem', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.88rem', fontWeight: '700', color: '#3D1C06' }}>
                            <Calendar size={14} color="#D97706" />
                            <span>{order.delivery_date}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#6E5648', marginTop: '3px' }}>
                            <Clock size={13} color="#D97706" />
                            <span>{order.delivery_time_slot}</span>
                          </div>
                        </td>

                        {/* 4. Bánh đặt mua */}
                        <td style={{ padding: '1rem 1.1rem', verticalAlign: 'top', minWidth: '180px' }}>
                          <div style={{ fontSize: '0.85rem', color: '#451A03' }}>
                            {items.map((it, idx) => (
                              <div key={idx} style={{ marginBottom: '2px' }}>
                                • {it.product_name} <strong style={{ color: '#D97706' }}>x{it.quantity}</strong>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* 5. Số tiền cần thu */}
                        <td style={{ padding: '1rem 1.1rem', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                          <div style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.15rem',
                            fontWeight: '800',
                            color: '#451A03'
                          }}>
                            {Number(order.total_amount).toLocaleString('vi-VN')}đ
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#8A7366', marginTop: '2px' }}>
                            Tiền mặt (DIRECT_MEETUP)
                          </div>
                        </td>

                        {/* 6. Trạng thái & Nút xác nhận nhận tiền */}
                        <td style={{ padding: '1rem 1.1rem', verticalAlign: 'top', textAlign: 'right' }}>
                          {isPaid ? (
                            <div>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.82rem',
                                fontWeight: '700',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '9999px',
                                backgroundColor: '#DCFCE7',
                                color: '#166534',
                                border: '1px solid #BBF7D0'
                              }}>
                                <CheckCircle2 size={14} />
                                <span>Đã thanh toán</span>
                              </span>
                              {order.paid_at && (
                                <div style={{ fontSize: '0.75rem', color: '#166534', marginTop: '4px' }}>
                                  {new Date(order.paid_at).toLocaleString('vi-VN', {
                                    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                                  })}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div>
                              <div style={{ marginBottom: '6px' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '0.78rem',
                                  fontWeight: '700',
                                  padding: '0.2rem 0.55rem',
                                  borderRadius: '9999px',
                                  backgroundColor: '#FEF3C7',
                                  color: '#92400E',
                                  border: '1px solid #FDE68A'
                                }}>
                                  <Clock size={12} />
                                  <span>Chưa thanh toán</span>
                                </span>
                              </div>

                              {/* Nút bấm duy nhất của Admin: Xác nhận đã nhận tiền mặt */}
                              <button
                                onClick={() => setConfirmingOrder(order)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                  backgroundColor: '#166534',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  borderRadius: '8px',
                                  padding: '0.45rem 0.8rem',
                                  fontSize: '0.82rem',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  boxShadow: '0 2px 6px rgba(22, 101, 52, 0.2)',
                                  transition: 'all 0.15s'
                                }}
                              >
                                <DollarSign size={14} />
                                <span>Xác nhận đã nhận tiền</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL XÁC NHẬN ĐÃ NHẬN TIỀN */}
      {confirmingOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '440px',
            width: '100%',
            padding: '1.75rem',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
            border: '1px solid #F3EDE8'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: '#DCFCE7',
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <DollarSign size={28} />
            </div>

            <h3 style={{
              textAlign: 'center',
              fontSize: '1.25rem',
              fontWeight: '800',
              color: '#3D1C06',
              margin: '0 0 0.4rem 0'
            }}>
              Xác Nhận Đã Nhận Đủ Tiền?
            </h3>

            <p style={{ textAlign: 'center', color: '#6E5648', fontSize: '0.88rem', margin: '0 0 1.25rem 0' }}>
              Xác nhận bạn (hoặc người giao hàng) đã nhận đủ tiền mặt từ khách cho đơn hàng:
            </p>

            {/* Khung tóm tắt đơn */}
            <div style={{
              backgroundColor: '#FDFBF7',
              border: '1px solid #EFEAE6',
              borderRadius: '12px',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem',
              fontSize: '0.88rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ color: '#8A7366' }}>Mã đơn:</span>
                <strong style={{ color: '#3D1C06', fontFamily: 'monospace' }}>#{confirmingOrder.id.slice(0, 8).toUpperCase()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ color: '#8A7366' }}>Khách hàng:</span>
                <strong style={{ color: '#3D1C06' }}>{confirmingOrder.recipient_name} ({confirmingOrder.recipient_phone})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #E5D7CC', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                <span style={{ color: '#3D1C06', fontWeight: '700' }}>Số tiền đã nhận:</span>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.2rem',
                  fontWeight: '800',
                  color: '#166534'
                }}>
                  {Number(confirmingOrder.total_amount).toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            {/* Nút bấm Xác nhận / Hủy */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={() => setConfirmingOrder(null)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '1px solid #E5D7CC',
                  backgroundColor: '#FFFFFF',
                  color: '#78655A',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  cursor: isProcessingPayment ? 'not-allowed' : 'pointer'
                }}
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={handleConfirmPayment}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#166534',
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  cursor: isProcessingPayment ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 10px rgba(22, 101, 52, 0.2)'
                }}
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Xác nhận</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
