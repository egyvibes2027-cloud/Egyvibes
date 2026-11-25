import React, { useMemo, useState } from 'react';
import { Star, ChevronDown } from 'lucide-react';
import {
  ALL_27_GOVERNORATES,
  DISCOVER_DESTINATIONS,
  egpToUsd,
  HIDDEN_GEMS,
  TOP_10_LANDMARKS,
} from '../data/egyptData';
import { useLanguage } from '../context/LanguageContext';
import { localizeCityName } from '../i18n/translations';

interface DestinationsGridProps {
  starredIds: string[];
  onToggleStar: (landmarkId: string) => void;
  onSelectDestination: (citySlug: string, destinationName: string, landmarkId?: string) => void;
}

type SectionTab = 'destinations' | 'top10' | 'hidden';
type GemFilter = 'all' | 'archaeological' | 'nature' | 'wellness' | 'cultural';

export const DestinationsGrid: React.FC<DestinationsGridProps> = ({
  starredIds,
  onToggleStar,
  onSelectDestination,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<SectionTab>('destinations');
  const [gemFilter, setGemFilter] = useState<GemFilter>('all');
  const [showFull27Table, setShowFull27Table] = useState(false);

  const filteredGems = useMemo(() => {
    if (gemFilter === 'all') return HIDDEN_GEMS;
    return HIDDEN_GEMS.filter((g) => g.category === gemFilter);
  }, [gemFilter]);

  return (
    <section
      id="discover-destinations"
      className="tl-container"
      style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
    >
      <h2 className="tl-display-md" style={{ textAlign: 'center' }}>
        {t.discoverTitle}
      </h2>

      {/* Exact Tourlane underline tabs */}
      <div className="trip-tabs-bar" role="tablist" aria-label="Egypt destinations and ticket guides">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'destinations'}
          className={`trip-tab-btn ${activeTab === 'destinations' ? 'active' : ''}`}
          onClick={() => setActiveTab('destinations')}
        >
          {t.tabTopDestinations}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'top10'}
          className={`trip-tab-btn ${activeTab === 'top10' ? 'active' : ''}`}
          onClick={() => setActiveTab('top10')}
        >
          {t.tabTop10Tickets}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'hidden'}
          className={`trip-tab-btn ${activeTab === 'hidden' ? 'active' : ''}`}
          onClick={() => setActiveTab('hidden')}
        >
          {t.tabHiddenGems}
        </button>
      </div>

      {/* Tab 1: Top Destinations Grid */}
      {activeTab === 'destinations' && (
        <div className="destinations-grid">
          {DISCOVER_DESTINATIONS.map((dest) => {
            const localizedName = localizeCityName(dest.slug, dest.name, t);
            return (
              <button
                key={dest.name}
                type="button"
                className="destination-card"
                onClick={() => onSelectDestination(dest.slug, localizedName)}
              >
                <img
                  src={dest.imageUrl}
                  alt={dest.alt}
                  className="destination-card-img"
                />
                <div className="destination-card-label">
                  <div>{localizedName}</div>
                  <div className="tl-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginTop: 2 }}>
                    {dest.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Tab 2: Official 2026 Top 10 Ticket Prices */}
      {activeTab === 'top10' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              backgroundColor: 'var(--color-surface-container-low)',
              borderRadius: 12,
              padding: '12px 18px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span className="tl-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
              {t.ticketsSourceNote}
            </span>
            <span className="tl-label-sm" style={{ color: 'var(--color-primary)' }}>
              {t.ticketsStarHint}
            </span>
          </div>

          <div className="tickets-grid">
            {TOP_10_LANDMARKS.map((lm) => {
              const isStarred = starredIds.includes(lm.id);
              const localizedCity = localizeCityName(lm.citySlug, lm.city, t);
              return (
                <div key={lm.id} className="ticket-card">
                  <img src={lm.imageUrl} alt={lm.name} className="ticket-card-thumb" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span className="tl-label-sm" style={{ color: 'var(--color-primary)' }}>
                        <bdi dir="ltr">#{lm.rank}</bdi> · {localizedCity}
                      </span>
                      <button
                        type="button"
                        className={`star-fav-btn ${isStarred ? 'starred' : ''}`}
                        aria-label={isStarred ? `Remove star from ${lm.name}` : `Star ${lm.name}`}
                        onClick={() => onToggleStar(lm.id)}
                        title={t.ticketsStarHint}
                      >
                        <Star size={15} fill={isStarred ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    <h3 className="tl-title-md" dir="auto" style={{ marginTop: 2 }}>{lm.name}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 6 }}>
                      <span
                        style={{
                          padding: '2px 10px',
                          borderRadius: 9999,
                          backgroundColor: 'var(--color-secondary-container)',
                          color: 'var(--color-on-secondary-container)',
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                      >
                        {lm.adultEgp === 0 ? (
                          t.ticketFreeEntry
                        ) : (
                          <>
                            {t.ticketAdultLabel}: <bdi dir="ltr">${egpToUsd(lm.adultEgp)} ({lm.adultEgp.toLocaleString()} EGP)</bdi>
                          </>
                        )}
                      </span>
                      {lm.studentEgp !== null && lm.studentEgp > 0 && (
                        <span
                          style={{
                            padding: '2px 10px',
                            borderRadius: 9999,
                            backgroundColor: 'var(--color-surface-container-high)',
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                        >
                          {t.ticketStudentLabel}: <bdi dir="ltr">${egpToUsd(lm.studentEgp)} ({lm.studentEgp} EGP)</bdi>
                        </span>
                      )}
                    </div>
                    <p className="tl-body-sm" dir="auto" style={{ color: 'var(--color-on-surface-variant)', marginTop: 6 }}>
                      {lm.practicalTip}
                    </p>
                    <button
                      type="button"
                      className="tl-label-lg"
                      style={{ color: 'var(--color-primary)', marginTop: 6 }}
                      onClick={() => onSelectDestination(lm.citySlug, localizedCity, lm.id)}
                    >
                      {t.addToPlannerCta}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Hidden Gems & 27 Governorates Atlas */}
      {activeTab === 'hidden' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="filter-pills-row">
            {[
              { id: 'all' as const, label: t.gemFilterAll },
              { id: 'archaeological' as const, label: t.gemFilterArch },
              { id: 'nature' as const, label: t.gemFilterNature },
              { id: 'wellness' as const, label: t.gemFilterWellness },
              { id: 'cultural' as const, label: t.gemFilterCultural },
            ].map((pill) => (
              <button
                key={pill.id}
                type="button"
                className={`filter-pill-btn ${gemFilter === pill.id ? 'active' : ''}`}
                onClick={() => setGemFilter(pill.id)}
              >
                {pill.label}
              </button>
            ))}
          </div>

          <div className="destinations-grid">
            {filteredGems.map((gem) => {
              const isStarred = starredIds.includes(gem.id);
              const localizedCity = localizeCityName(gem.citySlug, gem.city, t);
              return (
                <div key={gem.id} className="destination-card" style={{ position: 'relative' }}>
                  <button
                    type="button"
                    className={`star-fav-btn ${isStarred ? 'starred' : ''}`}
                    style={{ position: 'absolute', top: 10, insetInlineEnd: 10, zIndex: 2 }}
                    aria-label={`Star ${gem.name}`}
                    onClick={() => onToggleStar(gem.id)}
                  >
                    <Star size={15} fill={isStarred ? 'currentColor' : 'none'} />
                  </button>
                  <img
                    src={gem.imageUrl}
                    alt={gem.name}
                    className="destination-card-img"
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSelectDestination(gem.citySlug, localizedCity, gem.id)}
                  />
                  <div className="destination-card-label" style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                    <span className="tl-label-sm" style={{ color: 'var(--color-primary)' }}>
                      {localizedCity} · <bdi dir="ltr">~${egpToUsd(gem.adultEgp)} ({gem.adultEgp} EGP)</bdi>
                    </span>
                    <div className="tl-title-sm">{gem.name}</div>
                    <p className="tl-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                      {gem.summary}
                    </p>
                    <button
                      type="button"
                      className="tl-label-lg"
                      style={{ color: 'var(--color-primary)', marginTop: 'auto', paddingTop: 6, textAlign: 'start' }}
                      onClick={() => onSelectDestination(gem.citySlug, localizedCity, gem.id)}
                    >
                      {t.includeInTripCta}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              className="tl-btn-outline"
              onClick={() => setShowFull27Table((p) => !p)}
            >
              <span>
                {showFull27Table ? t.atlasToggleHide : t.atlasToggleShow}
              </span>
              <ChevronDown
                size={16}
                style={{ transform: showFull27Table ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
              />
            </button>
          </div>

          {showFull27Table && (
            <div
              style={{
                backgroundColor: 'var(--color-surface-container-low)',
                borderRadius: 16,
                border: '1px solid var(--color-outline-variant)',
                overflowX: 'auto',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, textAlign: 'start' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' }}>
                    <th style={{ padding: '12px 14px', textAlign: 'start' }}>#</th>
                    <th style={{ padding: '12px 14px', textAlign: 'start' }}>{t.atlasColGovernorate}</th>
                    <th style={{ padding: '12px 14px', textAlign: 'start' }}>{t.atlasColHighlights}</th>
                    <th style={{ padding: '12px 14px', textAlign: 'start' }}>{t.atlasColTheme}</th>
                  </tr>
                </thead>
                <tbody>
                  {ALL_27_GOVERNORATES.map((row) => (
                    <tr key={row.priority} style={{ borderTop: '1px solid var(--color-outline-variant)' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 500 }}>{row.priority}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 500 }}>{row.governorate}</td>
                      <td style={{ padding: '10px 14px', color: 'var(--color-on-surface-variant)' }}>{row.highlights}</td>
                      <td style={{ padding: '10px 14px', color: 'var(--color-primary)', whiteSpace: 'nowrap' }}>{row.theme}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
