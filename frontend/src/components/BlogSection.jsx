//feat/blog-va-tin-tuc(10)

import React, { useState } from 'react';
import { BLOG_POSTS_DATA } from '../data/bakeryData';
import { Calendar, User, ArrowRight, BookOpen, X } from 'lucide-react';

export default function BlogSection() {
  const [activePost, setActivePost] = useState(null);
  const heroPost = BLOG_POSTS_DATA.find(p => p.isHero) || BLOG_POSTS_DATA[0];
  const otherPosts = BLOG_POSTS_DATA.filter(p => p.id !== heroPost.id);

  return (
    <section
      id="blog"
      style={{
        backgroundColor: '#FBF7F4',
        padding: '5rem 1.5rem',
        borderTop: '1px solid #F3EDE8'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Tiêu đề & phụ đề */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{
            color: '#3D1C06',
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.2rem, 4vw, 3rem)',
            fontWeight: '700',
            margin: '0 0 0.5rem 0',
            letterSpacing: '-0.02em'
          }}>
            Blog
          </h2>

          <p style={{
            color: '#6E5648',
            fontSize: '1.05rem',
            margin: 0,
            fontWeight: '400'
          }}>
            Các bài viết nổi bật từ YuuCake
          </p>
        </div>

        {/* Bài viết tiêu điểm chuẩn mẫu trang chủ */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(69, 26, 3, 0.06)',
            border: '1px solid #F3EDE8',
            display: 'flex',
            alignItems: 'center',
            gap: '2.5rem',
            padding: '1.5rem',
            flexWrap: 'wrap',
            marginBottom: '2.5rem',
            cursor: 'pointer',
            transition: 'transform 0.3s, box-shadow 0.3s'
          }}
          onClick={() => setActivePost(heroPost)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 16px 36px rgba(69, 26, 3, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(69, 26, 3, 0.06)';
          }}
        >
          {/* Cột trái: Ảnh banner bài viết lớn (Noel 50% discount) */}
          <div style={{
            flex: '1 1 480px',
            borderRadius: '16px',
            overflow: 'hidden',
            maxHeight: '340px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#4A2818'
          }}>
            <img
              src={heroPost.image}
              alt={heroPost.title}
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '340px',
                objectFit: 'cover',
                transition: 'transform 0.4s'
              }}
            />
          </div>

          {/* Cột phải: Thông tin bài viết */}
          <div style={{ flex: '1 1 420px', padding: '0.5rem 1rem 0.5rem 0' }}>
            {/* Tag Tin tức bo tròn màu cam đào */}
            <span style={{
              display: 'inline-block',
              backgroundColor: '#F7C9A9',
              color: '#4A2818',
              fontSize: '0.85rem',
              fontWeight: '700',
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              marginBottom: '1rem',
              letterSpacing: '0.02em'
            }}>
              {heroPost.tag}
            </span>

            {/* Tiêu đề bài viết */}
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
              fontWeight: '700',
              color: '#2C1810',
              margin: '0 0 1rem 0',
              lineHeight: 1.3
            }}>
              {heroPost.title}
            </h3>

            {/* Đoạn trích dẫn */}
            <p style={{
              color: '#6E5648',
              fontSize: '0.98rem',
              lineHeight: 1.65,
              margin: '0 0 1.5rem 0'
            }}>
              {heroPost.excerpt}
            </p>

            {/* Thông tin tác giả & ngày tháng */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: '#EADCCF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src="/images/danh mục sản phẩm/danh muc san pham 1.avif"
                  alt="Tác giả"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <span style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#5C4A3E'
              }}>
                {heroPost.date}
              </span>
            </div>
          </div>
        </div>

        {/* Lưới các bài viết cẩm nang khác */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.75rem'
        }}>
          {otherPosts.map(post => (
            <div
              key={post.id}
              onClick={() => setActivePost(post)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(69, 26, 3, 0.05)',
                border: '1px solid #F3EDE8',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(69, 26, 3, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(69, 26, 3, 0.05)';
              }}
            >
              <div style={{ height: '190px', overflow: 'hidden' }}>
                <img
                  src={post.image}
                  alt={post.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>

              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    backgroundColor: '#FCE7D7',
                    color: '#92400E',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px'
                  }}>
                    {post.tag}
                  </span>
                </div>

                <h4 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.15rem',
                  fontWeight: '700',
                  color: '#2C1810',
                  margin: '0 0 0.5rem 0',
                  lineHeight: 1.35
                }}>
                  {post.title}
                </h4>

                <p style={{
                  fontSize: '0.88rem',
                  color: '#78655A',
                  lineHeight: 1.55,
                  margin: '0 0 1rem 0',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  flex: 1
                }}>
                  {post.excerpt}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #F5EEE8',
                  paddingTop: '0.75rem',
                  fontSize: '0.82rem',
                  color: '#9E8C80'
                }}>
                  <span>{post.date}</span>
                  <span style={{ color: '#5C2C16', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Đọc tiếp <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal đọc bài viết chi tiết */}
      {activePost && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          backgroundColor: 'rgba(44, 24, 16, 0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            position: 'relative'
          }}>
            {/* Nút đóng Modal */}
            <button
              onClick={() => setActivePost(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid #EFEAE6',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#451A03'
              }}
            >
              <X size={18} />
            </button>

            {/* Ảnh bài viết trong modal */}
            <img
              src={activePost.image}
              alt={activePost.title}
              style={{
                width: '100%',
                maxHeight: '300px',
                objectFit: 'cover',
                borderRadius: '14px',
                marginBottom: '1.5rem'
              }}
            />

            {/* Tag chuyên mục */}
            <span style={{
              backgroundColor: '#F7C9A9',
              color: '#4A2818',
              fontSize: '0.85rem',
              fontWeight: '700',
              padding: '0.25rem 0.75rem',
              borderRadius: '6px'
            }}>
              {activePost.tag}
            </span>

            {/* Tiêu đề bài viết */}
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              color: '#3D1C06',
              fontSize: '1.65rem',
              fontWeight: '700',
              margin: '0.75rem 0 0.5rem 0',
              lineHeight: 1.3
            }}>
              {activePost.title}
            </h2>

            {/* Ngày đăng & Tác giả */}
            <div style={{ fontSize: '0.85rem', color: '#9E8C80', marginBottom: '1.5rem' }}>
              Ngày đăng: {activePost.date} • Tác giả: {activePost.author.name}
            </div>

            {/* Nội dung bài viết */}
            <p style={{
              fontSize: '1rem',
              color: '#4A3728',
              lineHeight: 1.8,
              marginBottom: '1.5rem'
            }}>
              {activePost.content}
            </p>

            {/* Lời gửi gắm của tiệm bánh */}
            <div style={{
              backgroundColor: '#FDFBF7',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              border: '1px solid #EFEAE6',
              fontSize: '0.9rem',
              color: '#8A5836',
              fontStyle: 'italic'
            }}>
              "Yuu Cake luôn nỗ lực đem lại cho bạn những chiếc bánh tươi ngon, an toàn và tràn đầy tình cảm nhất!"
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
