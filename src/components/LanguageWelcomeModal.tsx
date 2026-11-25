import React from 'react';
import { X } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';
import { useLanguage } from '../context/LanguageContext';
import { NileWayLogo } from './Icons';

export const LanguageWelcomeModal: React.FC = () => {
  const { showWelcomePicker, setLanguage, dismissWelcomePicker, lang, t } = useLanguage();

  if (!showWelcomePicker) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={t.welcomeTitle}
      onClick={dismissWelcomePicker}
    >
      <div
        className="modal-panel"
        style={{ maxWidth: 620 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label={t.modalClose}
          onClick={dismissWelcomePicker}
          style={{
            position: 'absolute',
            top: 16,
            insetInlineEnd: 16,
            width: 34,
            height: 34,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--color-outline-variant)',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--color-primary)' }}>
            <NileWayLogo />
          </div>

          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-primary)', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
              <span>{t.welcomeGreeting}</span>
            </div>
            <h2 className="tl-display-sm">{t.welcomeTitle}</h2>
            <p className="tl-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: 6 }}>
              {t.welcomeSubtitle}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
            {SUPPORTED_LANGUAGES.map((opt) => (
              <button
                key={opt.code}
                type="button"
                className={`funnel-select-card ${opt.code === lang ? 'selected' : ''}`}
                onClick={() => setLanguage(opt.code)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}
              >
                <span style={{ fontSize: 22 }}>{opt.flag}</span>
                <div>
                  <div className="tl-title-sm">{opt.nativeName}</div>
                  <div className="tl-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {opt.englishName}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
