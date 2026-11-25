import React, { useEffect, useState } from 'react';
import { EXAMPLE_TRIPS } from '../data/egyptData';
import { useLanguage } from '../context/LanguageContext';
import { localizeCityName } from '../i18n/translations';
import { ActivityIcon, BedIcon, CarIcon, DiningIcon, FlightIcon } from './Icons';

interface ExampleTripsProps {
  onPlanDestination: (citySlug: string, destinationName: string) => void;
  onOpenLightbox: (src: string, title: string, subtitle?: string) => void;
}

export const ExampleTrips: React.FC<ExampleTripsProps> = ({
  onPlanDestination,
  onOpenLightbox,
}) => {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [hovered, setHovered] = useState(false);
  const current = EXAMPLE_TRIPS[activeIndex];

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !autoRotate || hovered) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % EXAMPLE_TRIPS.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, [autoRotate, hovered]);

  return (
    <section
      className="tl-container-wide"
      style={{ display: 'flex', flexDirection: 'column', gap: 32 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h2 className="tl-display-md" style={{ textAlign: 'center' }}>
        {t.examplesTitle}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div className="trip-tabs-bar" role="tablist" aria-label={t.examplesTitle}>
          {EXAMPLE_TRIPS.map((trip, idx) => {
            const localizedTab = localizeCityName(trip.slug, trip.tabTitle, t);
            return (
              <button
                key={trip.slug}
                type="button"
                role="tab"
                aria-selected={idx === activeIndex}
                className={`trip-tab-btn ${idx === activeIndex ? 'active' : ''}`}
                onClick={() => {
                  setActiveIndex(idx);
                  setAutoRotate(false);
                }}
              >
                {localizedTab}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          aria-label={localizeCityName(current.slug, current.tabTitle, t)}
          className="trip-showcase-card"
        >
          <div className="trip-info-panel">
            <div>
              <h3 className="tl-headline-lg" dir="auto">{current.title}</h3>
              <div className="trip-meta-row">
                <span className="tl-title-md">{current.duration}</span>
                <span className="trip-meta-sep" aria-hidden="true" />
                <span className="tl-title-md">{current.numberOfStops}</span>
                <span className="trip-meta-sep" aria-hidden="true" />
                <span className="tl-title-md">{current.transportMode}</span>
              </div>

              <div className="trip-tags-wrap">
                <span className="trip-tag-pill">
                  <BedIcon size={20} />
                  <span>{current.accommodationTag}</span>
                </span>
                <span className="trip-tag-pill">
                  <ActivityIcon size={20} />
                  <span>{current.activityTag}</span>
                </span>
                <span className="trip-tag-pill">
                  <CarIcon size={20} />
                  <span>{current.transportTag}</span>
                </span>
                <span className="trip-tag-pill">
                  <DiningIcon size={20} />
                  <span>{current.foodTag}</span>
                </span>
                <span className="trip-tag-pill">
                  <FlightIcon size={20} />
                  <span>{current.flightTag}</span>
                </span>
              </div>
            </div>

            <div className="trip-customer-row">
              <img
                src={current.customerImageUrl}
                alt={current.customerName}
                className="trip-customer-avatar"
              />
              <div>
                <p className="tl-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                  {t.curatedByLabel}
                </p>
                <p className="tl-title-md">{current.customerName}</p>
              </div>
            </div>
          </div>

          <div className="trip-collage-panel">
            <div className="trip-collage-grid">
              {current.photos.map((photo, idx) => {
                const tileClass = `collage-tile collage-tile-${idx + 1}`;
                const localizedCity = localizeCityName(current.slug, current.tabTitle, t);
                return (
                  <div
                    key={`${current.slug}-${idx}`}
                    className={tileClass}
                    role="button"
                    tabIndex={0}
                    aria-label={photo.tag ? `View ${photo.tag}` : `View ${localizedCity} trip photo`}
                    onClick={() =>
                      onOpenLightbox(
                        photo.url,
                        photo.tag ? `#${photo.tag}` : current.title,
                        localizedCity
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onOpenLightbox(
                          photo.url,
                          photo.tag ? `#${photo.tag}` : current.title,
                          localizedCity
                        );
                      }
                    }}
                  >
                    <img
                      src={photo.url}
                      alt={photo.tag ?? `${localizedCity} scene`}
                    />
                    {photo.tag && (
                      <div className="collage-tag-overlay">
                        <p>#{photo.tag}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            className="tl-btn-primary"
            onClick={() =>
              onPlanDestination(
                current.slug,
                localizeCityName(current.slug, current.tabTitle, t)
              )
            }
          >
            {t.planDestinationCta.replace(
              '{city}',
              localizeCityName(current.slug, current.tabTitle, t)
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
