import React, { useState } from 'react';
import { FOOTER_ABOUT_LINKS, FOOTER_DEST_LINKS, SALES_CONFIG } from '../data/egyptData';
import { localizeCityName, SUPPORTED_LANGUAGES } from '../i18n/translations';
import { useLanguage } from '../context/LanguageContext';
import {
  CaretDownIcon,
  FacebookCircleIcon,
  InstagramCircleIcon,
  LinkedInCircleIcon,
  NileWayLogo,
  TrustpilotStars,
  TrustpilotWordmark,
} from './Icons';

interface FooterProps {
  onSelectDestination: (citySlug: string, destinationName: string) => void;
  onOpenAiConcierge: () => void;
  onOpenModal: (modal: 'about' | 'careers' | 'support' | 'care' | 'privacy' | 'terms' | 'cookies') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectDestination,
  onOpenAiConcierge,
  onOpenModal,
}) => {
  const { lang, t, currentLanguage, setLanguage } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);

  return (
    <footer className="site-footer">
      <div className="footer-main-grid">
        {/* Brand Column */}
        <div>
          <span style={{ color: 'var(--color-primary)', display: 'inline-flex', marginBottom: 16 }}>
            <NileWayLogo className="nav-logo-svg" />
          </span>
          <p className="tl-body-md" style={{ color: 'var(--color-on-surface-variant)', maxWidth: 380 }}>
            {t.footerBio} <bdi dir="ltr">{SALES_CONFIG.emailDisplay}</bdi>
          </p>
          <div className="footer-social-list">
            <a href="#top" aria-label="Facebook" className="footer-social-btn">
              <FacebookCircleIcon />
            </a>
            <a href="#top" aria-label="Instagram" className="footer-social-btn">
              <InstagramCircleIcon />
            </a>
            <a href="#top" aria-label="LinkedIn" className="footer-social-btn">
              <LinkedInCircleIcon />
            </a>
          </div>
        </div>

        {/* About EGYVIBES */}
        <div>
          <p className="footer-col-title">{t.footerAboutHeading}</p>
          <ul className="footer-link-list">
            {FOOTER_ABOUT_LINKS.map((item, idx) => (
              <li key={item.label}>
                <button
                  type="button"
                  className="footer-link"
                  onClick={() => {
                    if (item.action === 'scroll-why') {
                      document.getElementById('why-tourlane')?.scrollIntoView({ behavior: 'smooth' });
                    } else if (item.action === 'scroll-moments') {
                      document.getElementById('tourlane-moments')?.scrollIntoView({ behavior: 'smooth' });
                    } else if (item.action === 'scroll-discover') {
                      document.getElementById('discover-destinations')?.scrollIntoView({ behavior: 'smooth' });
                    } else if (item.action === 'open-ai') {
                      onOpenAiConcierge();
                    } else {
                      const map: Record<string, 'about' | 'careers' | 'support'> = {
                        'modal-about': 'about',
                        'modal-careers': 'careers',
                        'modal-support': 'support',
                      };
                      onOpenModal(map[item.action]);
                    }
                  }}
                >
                  {t.footerAboutLinks[idx] ?? item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Egypt Destinations */}
        <div>
          <p className="footer-col-title">{t.footerDestHeading}</p>
          <ul className="footer-link-list">
            {FOOTER_DEST_LINKS.map((item) => {
              const displayLabel =
                item.slug === 'all' ? t.footerAtlasLink : localizeCityName(item.slug, item.label, t);
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    className="footer-link"
                    onClick={() => {
                      if (item.slug === 'all') {
                        document.getElementById('discover-destinations')?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        onSelectDestination(item.slug, displayLabel);
                      }
                    }}
                  >
                    {displayLabel}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* EGYVIBES Protection + Payment Assurance */}
        <div>
          <p className="footer-col-title">{t.footerProtectionHeading}</p>
          <p className="tl-title-sm" style={{ marginBottom: 4 }}>
            {t.footerProtectionTerms}
          </p>
          <p className="tl-body-md" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 8 }}>
            {t.footerProtectionDesc}
          </p>
          <button
            type="button"
            className="tl-label-lg"
            style={{ color: 'var(--color-primary)', marginBottom: 24 }}
            onClick={() => onOpenModal('care')}
          >
            {t.footerPaymentPolicy}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 18 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <TrustpilotStars rating={4.8} size={18} />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span className="tl-title-sm"><bdi dir="ltr">4.8</bdi></span>
                <span className="tl-body-sm">{t.trustOf5}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span className="tl-title-sm"><bdi dir="ltr">3,420</bdi></span>
                <span className="tl-body-sm">{t.reviewsCountLabel}</span>
              </div>
              <TrustpilotWordmark width={84} height={20} />
            </div>

            <img
              src="/assets/logos/asta-color.png"
              alt="Travel Advisor Accredited"
              width={60}
              height={68}
              style={{ objectFit: 'contain', filter: 'grayscale(1) sepia(0.32) brightness(0.88)' }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Legal & Language Bar */}
      <div className="footer-bottom-bar">
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setLangOpen((p) => !p)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              fontWeight: 500,
              padding: '4px 10px',
              borderRadius: 8,
              border: '1px solid var(--color-outline-variant)',
            }}
          >
            <span>{currentLanguage.flag} {currentLanguage.nativeName}</span>
            <CaretDownIcon size={16} />
          </button>

          {langOpen && (
            <div
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 6px)',
                insetInlineStart: 0,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-outline-variant)',
                borderRadius: 12,
                boxShadow: 'var(--shadow-dropdown)',
                padding: 6,
                minWidth: 190,
                maxHeight: 260,
                overflowY: 'auto',
                zIndex: 50,
              }}
            >
              {SUPPORTED_LANGUAGES.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  className={`lang-option-item ${opt.code === lang ? 'active' : ''}`}
                  onClick={() => {
                    setLanguage(opt.code);
                    setLangOpen(false);
                  }}
                >
                  <span>{opt.flag} {opt.nativeName}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <span style={{ width: 1, height: 18, background: 'var(--color-outline-variant)' }} aria-hidden="true" />

        <button type="button" className="footer-link" onClick={() => onOpenModal('privacy')}>
          {t.footerPrivacy}
        </button>
        <button type="button" className="footer-link" onClick={() => onOpenModal('terms')}>
          {t.footerTerms}
        </button>
        <button type="button" className="footer-link" onClick={() => onOpenModal('cookies')}>
          {t.footerCookies}
        </button>
      </div>
    </footer>
  );
};
