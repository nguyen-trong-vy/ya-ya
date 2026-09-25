//feat/quan-ly-banh-them-moi(15)

import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { getCategories } from '../../api/catalogApi';

export default function ProductFormModal({ isOpen, onClose, onSubmitSuccess }) {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  
  // Image upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  // Tải danh sách danh mục để đổ vào dropdown
  useEffect(() => {
    if (isOpen) {
      setLoadingCategories(true);
      getCategories()
        .then(data => {
          setCategories(data || []);
          if (data && data.length > 0 && !categoryId) {
            setCategoryId(data[0].id);
          }
        })
        .catch(err => {
          console.error("Lỗi tải danh mục:", err);
        })
        .finally(() => {
          setLoadingCategories(false);
        });

      // Reset form khi mở modal
      setName('');
      setPrice('');
      setDescription('');
      setSelectedFile(null);
      setImagePreview('');
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Xử lý chọn file ảnh từ máy tính
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Kiểm tra định dạng
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WEBP).');
      return;
    }

    // Kiểm tra dung lượng (tối đa 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Kích thước ảnh không được vượt quá 5MB.');
      return;
    }

    setErrorMessage('');
    setSelectedFile(file);

    // Tạo URL xem trước tạm thời
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // Hủy ảnh đã chọn
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Vui lòng nhập tên bánh kem.');
      return;
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setErrorMessage('Vui lòng nhập đơn giá hợp lệ lớn hơn 0 VNĐ.');
      return;
    }

    if (!categoryId) {
      setErrorMessage('Vui lòng chọn một danh mục cho bánh.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('price', numPrice);
      formData.append('category_id', categoryId);
      if (description.trim()) {
        formData.append('description', description.trim());
      }
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      await onSubmitSuccess(formData);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Không thể lưu bánh mới. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
      backdropFilter: 'blur(3px)'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '1.25rem',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header Modal */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #f3f4f6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>
              Thêm Bánh Mới Vào Thực Đơn
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
              Điền thông tin và tải ảnh bánh lên hệ thống tiệm Yuu Cake
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Modal Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {errorMessage && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fee2e2',
              color: '#ef4444',
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              fontSize: '0.875rem'
            }}>
              {errorMessage}
            </div>
          )}

          {/* Tên bánh */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>
              Tên bánh kem <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Bánh Kem Dâu Tây Thượng Hạng"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.625rem',
                fontSize: '0.875rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Hàng 2 cột: Danh mục & Đơn giá */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>
                Danh mục bánh <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={isSubmitting || loadingCategories}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.625rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box'
                }}
              >
                {loadingCategories ? (
                  <option value="">Đang tải danh mục...</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>
                Đơn giá (VNĐ) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="VD: 320000"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.625rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>
              Mô tả hương vị & thành phần
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả bánh, cốt bánh kem vani mềm mịn kết hợp cùng hoa quả tươi..."
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.625rem',
                fontSize: '0.875rem',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Khu vực Upload Ảnh Đại Diện */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>
              Hình ảnh đại diện bánh
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />

            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed #e5e7eb',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#fafafa',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#f43f5e'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              >
                <Upload size={32} color="#9ca3af" style={{ margin: '0 auto 0.5rem auto' }} />
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: '#4b5563' }}>
                  Bấm để chọn file ảnh từ máy tính
                </p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#9ca3af' }}>
                  PNG, JPG hoặc WEBP (Tối đa 5MB)
                </p>
              </div>
            ) : (
              <div style={{
                position: 'relative',
                display: 'inline-block',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                border: '1px solid #e5e7eb'
              }}>
                <img
                  src={imagePreview}
                  alt="Xem trước bánh mới"
                  style={{
                    width: '160px',
                    height: '140px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  style={{
                    position: 'absolute',
                    top: '0.375rem',
                    right: '0.375rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.65)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '26px',
                    height: '26px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Gỡ ảnh này"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Nút Submit & Hủy */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            marginTop: '0.5rem'
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: '0.625rem 1.25rem',
                backgroundColor: '#f3f4f6',
                color: '#4b5563',
                border: 'none',
                borderRadius: '0.625rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '0.625rem 1.5rem',
                backgroundColor: '#f43f5e',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.625rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: isSubmitting ? 0.8 : 1
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Đang tải lên...</span>
                </>
              ) : (
                <span>Lưu Bánh Mới</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
