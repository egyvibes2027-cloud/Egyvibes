import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SEARCH_DESTINATIONS } from '../data/egyptData';
import { localizeCityName } from '../i18n/translations';
import { useLanguage } from '../context/LanguageContext';
import { AiStarIcon, PinOutlineIcon } from './Icons';

interface HeroSectionProps {
  headerSlot: React.ReactNode;
  onStartPlanning: (citySlug: string, destinationName: string) => void;
  onAskAi: (prompt?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  headerSlot,
  onStartPlanning,
  onAskAi,
}) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 599
  );
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 599px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_DESTINATIONS;
    return SEARCH_DESTINATIONS.filter(
      (d) => d.name.toLowerCase().includes(q) || d.subtitle.toLowerCase().includes(q)
    );
  }, [query]);

  const topDestinations = useMemo(() => filtered.filter((d) => d.isTop), [filtered]);
  const otherDestinations = useMemo(() => filtered.filter((d) => !d.isTop), [filtered]);
  const orderedVisible = [...topDestinations, ...otherDestinations];

  const handlePlanSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (activeIndex >= 0 && orderedVisible[activeIndex]) {
      const sel = orderedVisible[activeIndex];
      onStartPlanning(sel.slug, sel.name);
      setDropdownOpen(false);
      return;
    }
    setDropdownOpen(false);
    onAskAi(query.trim() || undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!dropdownOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setDropdownOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, orderedVisible.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Escape') {
      setDropdownOpen(false);
    }
  };

  return (
    <header className="hero-header" id="destination_search-header">
      {headerSlot}

      <div className="hero-foreground">
        <div className="hero-headline-wrap">
          <h1 className="tl-display-lg">{t.heroTitle}</h1>
        </div>

        <div className="hero-search-outer" ref={searchBoxRef}>
          <form className="hero-search-pill" onSubmit={handlePlanSubmit}>
            <span className="hero-search-icon">
              <PinOutlineIcon size={24} />
            </span>
            <input
              type="search"
              name="search"
              autoComplete="off"
              aria-label={isMobile ? t.heroSearchPlaceholderMobile : t.heroSearchPlaceholderDesktop}
              placeholder={isMobile ? t.heroSearchPlaceholderMobile : t.heroSearchPlaceholderDesktop}
              value={query}
              onFocus={() => setDropdownOpen(true)}
              onChange={(e) => {
                setQuery(e.target.value);
                setDropdownOpen(true);
                setActiveIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              className="hero-search-input"
            />
            <button type="submit" className="tl-btn-primary">
              <AiStarIcon size={18} />
              <span>{t.heroCta}</span>
            </button>
          </form>

          {dropdownOpen && (
            <div className="hero-search-dropdown" role="listbox" aria-label={t.searchTopLabel}>
              {filtered.length === 0 ? (
                <div style={{ padding: '20px 14px', textAlign: 'center' }}>
                  <p className="tl-title-md">{t.searchNoMatchTitle}</p>
                  <p className="tl-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginTop: 4 }}>
                    {t.searchNoMatchDesc.replace('{cta}', t.heroCta)}
                  </p>
                </div>
              ) : (
                <>
                  {topDestinations.length > 0 && (
                    <div>
                      <div className="hero-search-group-label">{t.searchTopLabel}</div>
                      {topDestinations.map((dest) => {
                        const idx = orderedVisible.findIndex((x) => x.name === dest.name);
                        const label = localizeCityName(dest.slug, dest.name, t);
                        return (
                          <button
                            key={dest.name}
                            type="button"
                            role="option"
                            aria-selected={idx === activeIndex}
                            className={`hero-search-option ${idx === activeIndex ? 'active' : ''}`}
                            onClick={() => {
                              setQuery(label);
                              setDropdownOpen(false);
                              onStartPlanning(dest.slug, label);
                            }}
                          >
                            <img src={dest.imageUrl} alt={label} className="hero-search-thumb" />
                            <div>
                              <div className="tl-title-sm">{label}</div>
                              <div className="tl-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                                {dest.subtitle}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {otherDestinations.length > 0 && (
                    <div style={{ marginTop: topDestinations.length > 0 ? 8 : 0 }}>
                      <div className="hero-search-group-label">{t.searchMoreLabel}</div>
                      {otherDestinations.map((dest) => {
                        const idx = orderedVisible.findIndex((x) => x.name === dest.name);
                        const label = localizeCityName(dest.slug, dest.name, t);
                        return (
                          <button
                            key={dest.name}
                            type="button"
                            role="option"
                            aria-selected={idx === activeIndex}
                            className={`hero-search-option ${idx === activeIndex ? 'active' : ''}`}
                            onClick={() => {
                              setQuery(label);
                              setDropdownOpen(false);
                              onStartPlanning(dest.slug, label);
                            }}
                          >
                            <img src={dest.imageUrl} alt={label} className="hero-search-thumb" />
                            <div>
                              <div className="tl-title-sm">{label}</div>
                              <div className="tl-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                                {dest.subtitle}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bespoke Ancient & Timeless Egyptian Civilization Collage */}
      <div className="hero-artwork-wrap">
        <picture className="hero-artwork-picture">
          <source media="(max-width: 904px)" srcSet="/assets/egypt/hero-egypt-mobile.png" />
          <img
            src="/assets/egypt/hero-egypt-desktop.png"
            alt="Egyptian Civilization — Pyramids, Sphinx, Karnak, Abu Simbel, Nile Felucca & Red Sea"
            className="hero-artwork-img"
            fetchPriority="high"
          />
        </picture>
      </div>
    </header>
  );
};
