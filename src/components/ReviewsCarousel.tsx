import React, { useEffect, useState } from 'react';
import { TRUSTPILOT_REVIEWS } from '../data/egyptData';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeftIcon, ChevronRightIcon, TrustpilotStars, TrustpilotWordmark } from './Icons';

interface ReviewsCarouselProps {
  onStartPlanning: () => void;
}

export const ReviewsCarousel: React.FC<ReviewsCarouselProps> = ({ onStartPlanning }) => {
  const { currentLanguage, t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [expandedMap, setExpandedMap] = useState<Record<number, boolean>>({});
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const sync = () => {
      if (window.innerWidth < 600) setVisibleCount(1);
      else if (window.innerWidth < 905) setVisibleCount(2);
      else setVisibleCount(3);
    };
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  const maxIndex = Math.max(0, TRUSTPILOT_REVIEWS.length - visibleCount);
  const clampedIndex = Math.min(index, maxIndex);
  const hasExpanded = Object.values(expandedMap).some(Boolean);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || isPaused || hasExpanded || maxIndex <= 0) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4500);
    return () => window.clearInterval(id);
  }, [isPaused, hasExpanded, maxIndex]);

  const toggleExpand = (idx: number) => {
    setExpandedMap((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <section
      id="firsthand-experiences"
      className="tl-container"
      style={{ display: 'flex', flexDirection: 'column', gap: 32 }}
    >
      <h2 className="tl-display-md" style={{ textAlign: 'center' }}>
        {t.reviewsTitle}
      </h2>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="trustpilot-link">
          <span className="tl-title-sm">{t.trustExcellent}</span>
          <TrustpilotStars rating={4.8} size={18} />
          <span className="tl-title-sm">
            <bdi dir="ltr">4.8</bdi> {t.trustOf5}
          </span>
          <span className="tl-title-sm">
            <bdi dir="ltr">3,420</bdi>
          </span>
          <span className="tl-body-md">{t.trustVerifiedReviews}</span>
          <TrustpilotWordmark width={92} height={22} />
        </div>
      </div>

      <div
        className="reviews-carousel-wrap"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {clampedIndex > 0 && (
          <button
            type="button"
            className="carousel-arrow-btn prev"
            style={{ left: -20, top: 108 }}
            aria-label="Previous reviews"
            onClick={() => {
              setIsPaused(true);
              setIndex((prev) => Math.max(0, prev - 1));
            }}
          >
            <ChevronLeftIcon size={24} />
          </button>
        )}

        <div className="reviews-grid-viewport">
          <div
            className="reviews-track"
            style={{
              transform: `translateX(calc(${currentLanguage.dir === 'rtl' ? '' : '-'}${clampedIndex} * (100% + 20px) / ${visibleCount}))`,
            }}
          >
            {TRUSTPILOT_REVIEWS.map((rev, idx) => (
              <article key={rev.reviewerName} className="review-card">
                <div className="review-photo-box">
                  <img src={rev.tripPhotoUrl} alt={rev.tripLabel} />
                  <div className="review-photo-caption">{rev.tripLabel}</div>
                </div>

                <div className="review-author-row">
                  {rev.avatarUrl ? (
                    <img
                      src={rev.avatarUrl}
                      alt={rev.reviewerName}
                      className="review-avatar"
                    />
                  ) : (
                    <div className="review-avatar-fallback" aria-hidden="true">
                      {rev.initial}
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <h3 className="tl-title-md">{rev.reviewerName}</h3>
                    <TrustpilotStars rating={5} size={16} />
                  </div>
                </div>

                <p
                  className={`review-body-text ${expandedMap[idx] ? 'expanded' : ''}`}
                  dir="auto"
                  title="Click to read full review"
                  onClick={() => toggleExpand(idx)}
                >
                  {rev.text}
                </p>

                <div className="review-date">{rev.date}</div>
              </article>
            ))}
          </div>
        </div>

        {clampedIndex < maxIndex && (
          <button
            type="button"
            className="carousel-arrow-btn next"
            style={{ right: -20, top: 108 }}
            aria-label="Next reviews"
            onClick={() => setIndex((prev) => Math.min(maxIndex, prev + 1))}
          >
            <ChevronRightIcon size={24} />
          </button>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button type="button" className="tl-btn-primary" onClick={onStartPlanning}>
          {t.reviewsCta}
        </button>
      </div>
    </section>
  );
};
