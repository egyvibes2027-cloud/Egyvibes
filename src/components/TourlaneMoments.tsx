import React, { useEffect, useRef, useState } from 'react';
import { EGYPT_MOMENTS, MOMENTS_AVATARS, type MomentItem } from '../data/egyptData';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface TourlaneMomentsProps {
  onStartPlanning: () => void;
  onOpenLightbox: (src: string, title: string, subtitle?: string) => void;
}

export const TourlaneMoments: React.FC<TourlaneMomentsProps> = ({
  onStartPlanning,
  onOpenLightbox,
}) => {
  const { t } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const [canScrollLeft, setCanScrollLeft] = useState(true);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const loopItems = [...EGYPT_MOMENTS, ...EGYPT_MOMENTS];

  const updateScrollButtons = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(true);
    setCanScrollRight(true);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let rafId = 0;
    let lastTs = performance.now();

    const tick = (ts: number) => {
      const dt = Math.min(48, ts - lastTs);
      lastTs = ts;
      if (!pausedRef.current && el) {
        const isRtl = getComputedStyle(el).direction === 'rtl';
        const half = el.scrollWidth / 2;
        if (half > 0) {
          const step = (dt * 0.042); // ~2.5px per 60ms = gentle continuous flow
          if (isRtl) {
            el.scrollLeft -= step;
            if (Math.abs(el.scrollLeft) >= half) {
              el.scrollLeft += half;
            }
          } else {
            el.scrollLeft += step;
            if (el.scrollLeft >= half) {
              el.scrollLeft -= half;
            }
          }
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const scrollByCard = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    pausedRef.current = true;
    el.scrollBy({ left: dir * 284 * 2, behavior: 'smooth' });
    setTimeout(() => {
      pausedRef.current = false;
    }, 1800);
  };

  return (
    <section
      id="tourlane-moments"
      style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%' }}
    >
      <div className="tl-container" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <h2 className="tl-display-md" style={{ textAlign: 'center' }}>
          {t.momentsTitle}
        </h2>

        <div className="moments-avatars-row">
          <div className="moments-avatar-stack">
            {MOMENTS_AVATARS.map((src, i) => (
              <img key={src} src={src} alt={`Egypt traveler ${i + 1}`} className="moments-avatar-img" />
            ))}
          </div>
          <h3 className="tl-title-md" style={{ textAlign: 'center' }}>
            {t.momentsSub}
          </h3>
        </div>
      </div>

      <div
        className="moments-carousel-outer"
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          pausedRef.current = false;
        }}
        onTouchStart={() => {
          pausedRef.current = true;
        }}
        onTouchEnd={() => {
          setTimeout(() => {
            pausedRef.current = false;
          }, 1600);
        }}
      >
        {canScrollLeft && (
          <button
            type="button"
            className="carousel-arrow-btn prev"
            aria-label="Previous moments"
            onClick={() => scrollByCard(-1)}
          >
            <ChevronLeftIcon size={24} />
          </button>
        )}

        <div
          ref={trackRef}
          className="moments-track"
          onScroll={updateScrollButtons}
        >
          {loopItems.map((item: MomentItem, i: number) => {
            const title = t.momentHeadlines[i % EGYPT_MOMENTS.length] ?? item.headline;
            return (
              <button
                key={`${item.headline}-${i}`}
                type="button"
                className="moment-card"
                onClick={() => onOpenLightbox(item.imageUrl, title, item.subheadline)}
              >
                <img
                  src={item.imageUrl}
                  alt={title}
                  className="moment-card-img"
                  draggable={false}
                />
                <div className="moment-card-overlay">
                  <p className="tl-title-md" style={{ color: '#ffffff' }}>
                    {title}
                  </p>
                  <p className="tl-body-sm" style={{ color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>
                    {item.subheadline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {canScrollRight && (
          <button
            type="button"
            className="carousel-arrow-btn next"
            aria-label="Next moments"
            onClick={() => scrollByCard(1)}
          >
            <ChevronRightIcon size={24} />
          </button>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button type="button" className="tl-btn-primary" onClick={onStartPlanning}>
          {t.momentsCta}
        </button>
      </div>
    </section>
  );
};
