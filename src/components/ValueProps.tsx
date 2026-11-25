import React from 'react';
import { USP_ITEMS } from '../data/egyptData';
import { useLanguage } from '../context/LanguageContext';

interface ValuePropsProps {
  onStartPlanning: () => void;
}

export const ValueProps: React.FC<ValuePropsProps> = ({ onStartPlanning }) => {
  const { t } = useLanguage();
  return (
    <section className="tl-container" style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <h2 className="tl-display-md" style={{ textAlign: 'center' }}>
        {t.uspTitle}
      </h2>

      <div className="usp-grid">
        {USP_ITEMS.map((item, idx) => {
          const card = t.uspCards[idx] ?? item;
          return (
            <div key={item.title} className="usp-card">
              <img src={item.iconSrc} alt="" className="usp-icon" />
              <h3 className="tl-title-md">{card.title}</h3>
              <p className="tl-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button type="button" className="tl-btn-primary" onClick={onStartPlanning}>
          {t.uspCta}
        </button>
      </div>
    </section>
  );
};
