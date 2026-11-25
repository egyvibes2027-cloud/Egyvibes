import React from 'react';
import { STATS_ITEMS } from '../data/egyptData';
import { useLanguage } from '../context/LanguageContext';

export const StatsBar: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section
      className="tl-container"
      data-testid="proof-points-section"
      style={{ display: 'flex', flexDirection: 'column', gap: 44 }}
    >
      <h2 className="tl-display-md" style={{ textAlign: 'center' }}>
        {t.statsTitle}
      </h2>

      <ul className="stats-list">
        {STATS_ITEMS.map((item, idx) => (
          <React.Fragment key={item.label}>
            {idx > 0 && <li className="stats-divider" aria-hidden="true" />}
            <li className="stats-item">
              <bdi dir="ltr" className="tl-headline-lg">{item.value}</bdi>
              <span className="tl-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: 4 }}>
                {t.statsLabels[idx] ?? item.label}
              </span>
            </li>
          </React.Fragment>
        ))}
      </ul>
    </section>
  );
};
