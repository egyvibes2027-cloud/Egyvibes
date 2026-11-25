import React from 'react';
import { HOW_IT_WORKS_STEPS } from '../data/egyptData';
import { useLanguage } from '../context/LanguageContext';

export const HowItWorks: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section className="tl-container" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <h2 className="tl-display-md" style={{ textAlign: 'center' }}>
        {t.howTitle}
      </h2>

      <div className="steps-row">
        {HOW_IT_WORKS_STEPS.map((step, idx) => {
          const localized = t.howSteps[idx] ?? step;
          return (
            <div key={step.number} className="step-card">
              <div className="step-badge">{step.number}</div>
              <div className="tl-title-lg">{localized.title}</div>
              <p className="tl-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
                {localized.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
