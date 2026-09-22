//feat/heroslide(09)

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Volume2, VolumeX } from 'lucide-react';
import { SLIDES_DATA, TICKER_ITEMS } from '../data/bakeryData';

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const videoRef = useRef(null);

  const currentSlide = SLIDES_DATA[currentIndex];

  // Tự động chuyển slide sau 5.5 giây nếu không hover
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES_DATA.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES_DATA.length) % SLIDES_DATA.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES_DATA.length);
  };

  return (
    <div
      style={{ position: 'relative', width: '100%', overflow: 'hidden' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Khung Hero Slider */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '520px',
        backgroundColor: '#1E120B'
      }}>
        {/* Render Slide: Video hoặc Ảnh tĩnh */}
        {currentSlide.type === 'video' ? (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <video
              ref={videoRef}
              src={currentSlide.src}
              autoPlay
              loop
              muted={isVideoMuted}
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            {/* Nút bật/tắt tiếng video */}
            <button
              onClick={() => setIsVideoMuted(!isVideoMuted)}
              title={isVideoMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              {isVideoMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        ) : (
          <img
            src={currentSlide.src}
            alt={currentSlide.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              filter: 'brightness(0.85)'
            }}
          />
        )}

        {/* Lớp phủ Gradient mờ ảo */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(30, 18, 11, 0.4) 0%, rgba(30, 18, 11, 0.65) 100%)',
          pointerEvents: 'none'
        }} />

        {/* Nội dung chữ căn giữa chuẩn mẫu trang chủ */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 1.5rem',
          zIndex: 5
        }}>
          {/* Eyebrow Tagline */}
          <span style={{
            color: '#FFFFFF',
            fontSize: '0.95rem',
            fontWeight: '700',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.6)'
          }}>
            {currentSlide.tagline}
          </span>

          {/* Tiêu đề chính */}
          <h1 style={{
            color: '#FFFFFF',
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '700',
            margin: '0 0 1.75rem 0',
            maxWidth: '850px',
            lineHeight: 1.15,
            textShadow: '0 3px 12px rgba(0,0,0,0.7)',
            letterSpacing: '-0.02em'
          }}>
            {currentSlide.title}
          </h1>

          {/* Nút Khám phá (CTA) */}
          <a
            href={currentSlide.ctaLink}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#3D1C06',
              padding: '0.75rem 1.75rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '700',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
              transition: 'all 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)';
            }}
          >
            {currentSlide.ctaText}
          </a>
        </div>

        {/* Nút Prev Slide */}
        <button
          onClick={handlePrev}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(4px)',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.45)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'}
        >
          <ChevronLeft size={24} />
        </button>

        {/* Nút Next Slide */}
        <button
          onClick={handleNext}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(4px)',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.45)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'}
        >
          <ChevronRight size={24} />
        </button>

        {/* Thanh chuyển slide gạch ngang dưới đáy chuẩn mẫu — — — — — */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          zIndex: 10
        }}>
          {SLIDES_DATA.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(index)}
                title={`Chuyển đến slide ${index + 1}`}
                style={{
                  height: '4px',
                  width: isActive ? '36px' : '20px',
                  backgroundColor: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Keyframe animation cho Dải Ticker Marquee cuộn mượt mà vô tận */}
      <style>{`
        @keyframes tickerScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

      {/* Dải Ticker Bar chạy ngang chuẩn mẫu dưới banner */}
      <div style={{
        backgroundColor: '#F5EBE1',
        borderTop: '1px solid #EADCCF',
        borderBottom: '1px solid #EADCCF',
        padding: '0.65rem 0',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2.5rem',
          width: 'max-content',
          animation: 'tickerScroll 25s linear infinite'
        }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.92rem',
                fontWeight: '700',
                color: '#3D1C06'
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
