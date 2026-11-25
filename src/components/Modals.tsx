import React, { useState } from 'react';
import { Check, Copy, X } from 'lucide-react';
import { BANK_TRANSFER_PLACEHOLDER, SALES_CONFIG } from '../data/egyptData';
import { useLanguage } from '../context/LanguageContext';
import { NileWayLogo } from './Icons';

export type ModalType =
  | 'pricing'
  | 'care'
  | 'about'
  | 'careers'
  | 'support'
  | 'privacy'
  | 'terms'
  | 'cookies'
  | null;

interface LightboxState {
  src: string;
  title: string;
  subtitle?: string;
}

interface ModalsProps {
  activeModal: ModalType;
  lightbox: LightboxState | null;
  onCloseModal: () => void;
  onCloseLightbox: () => void;
  onStartPlanning: () => void;
}

export const Modals: React.FC<ModalsProps> = ({
  activeModal,
  lightbox,
  onCloseModal,
  onCloseLightbox,
  onStartPlanning,
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [analyticsCookie, setAnalyticsCookie] = useState(true);
  const [marketingCookie, setMarketingCookie] = useState(true);

  if (lightbox) {
    return (
      <div
        className="modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-label={lightbox.title}
        onClick={onCloseLightbox}
      >
        <div
          style={{
            position: 'relative',
            maxWidth: 780,
            width: '100%',
            borderRadius: 16,
            overflow: 'hidden',
            background: '#1b1c17',
            boxShadow: 'var(--shadow-e3)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label={t.modalClose}
            onClick={onCloseLightbox}
            style={{
              position: 'absolute',
              top: 12,
              insetInlineEnd: 12,
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.65)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
            }}
          >
            <X size={20} />
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.title}
            style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', display: 'block' }}
          />
          <div style={{ padding: '14px 20px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div>
              <p className="tl-title-md">{lightbox.title}</p>
              {lightbox.subtitle && (
                <p className="tl-body-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  {lightbox.subtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              className="tl-btn-primary"
              onClick={() => {
                onCloseLightbox();
                onStartPlanning();
              }}
            >
              {t.modalStartPlanning}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!activeModal) return null;

  const copyIban = async () => {
    try {
      await navigator.clipboard.writeText(BANK_TRANSFER_PLACEHOLDER.iban);
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onCloseModal}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          aria-label={t.modalClose}
          onClick={onCloseModal}
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

        {(activeModal === 'pricing' || activeModal === 'care') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <span style={{ color: 'var(--color-primary)', display: 'inline-flex' }}>
              <NileWayLogo />
            </span>
            <h2 className="tl-display-sm">{t.modalPricingTitle}</h2>
            <p className="tl-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
              {t.modalPricingBody}
            </p>
            <div style={{ background: 'var(--color-surface-container-low)', padding: 16, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="tl-title-sm">1. {t.paymentRule1}</div>
              <div className="tl-title-sm">2. {t.paymentRule2}</div>
              <div className="tl-title-sm">3. {t.paymentRule3}</div>
            </div>
            <div style={{ padding: 14, borderRadius: 12, border: '1px dashed var(--color-primary)', background: 'var(--color-surface-container)' }}>
              <div className="tl-label-sm" style={{ color: 'var(--color-primary)' }}>
                {t.modalBankRefTitle}
              </div>
              <div className="tl-body-sm" style={{ marginTop: 4 }}>
                {BANK_TRANSFER_PLACEHOLDER.bankName} · SWIFT: <strong><bdi dir="ltr">{BANK_TRANSFER_PLACEHOLDER.swiftCode}</bdi></strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, gap: 8 }}>
                <code style={{ fontSize: 13 }}><bdi dir="ltr">{BANK_TRANSFER_PLACEHOLDER.iban}</bdi></code>
                <button type="button" className="tl-btn-outline" style={{ height: 32, padding: '0 12px', fontSize: 12 }} onClick={copyIban}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? t.confirmationCopied : t.confirmationCopyIban}</span>
                </button>
              </div>
            </div>
            <button
              type="button"
              className="tl-btn-primary"
              onClick={() => {
                onCloseModal();
                onStartPlanning();
              }}
            >
              {t.modalStartPlanning}
            </button>
          </div>
        )}

        {(activeModal === 'about' || activeModal === 'careers' || activeModal === 'support') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 className="tl-display-sm">
              {activeModal === 'about' && t.modalAboutTitle}
              {activeModal === 'careers' && t.modalPartnersTitle}
              {activeModal === 'support' && t.modalSupportTitle}
            </h2>
            <p className="tl-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
              {activeModal === 'about' && t.modalAboutBody}
              {activeModal === 'careers' && t.modalPartnersBody}
              {activeModal === 'support' &&
                t.modalSupportBody
                  .replace('{phone}', SALES_CONFIG.phoneDisplay)
                  .replace('{email}', SALES_CONFIG.emailDisplay)}
            </p>
            <button type="button" className="tl-btn-primary" onClick={onCloseModal}>
              {t.modalClose}
            </button>
          </div>
        )}

        {(activeModal === 'privacy' || activeModal === 'terms') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 className="tl-display-sm">
              {activeModal === 'privacy' ? t.modalPrivacyTitle : t.modalTermsTitle}
            </h2>
            <p className="tl-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
              {t.modalLegalBody}
            </p>
            <button type="button" className="tl-btn-primary" onClick={onCloseModal}>
              {t.modalClose}
            </button>
          </div>
        )}

        {activeModal === 'cookies' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 className="tl-display-sm">{t.modalCookiesTitle}</h2>
            <p className="tl-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
              {t.modalLegalBody}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 10, background: 'var(--color-surface-container-low)' }}>
                <span className="tl-title-sm">{t.welcomeTitle}</span>
                <input type="checkbox" checked disabled />
              </label>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 10, background: 'var(--color-surface-container-low)', cursor: 'pointer' }}>
                <span className="tl-title-sm">{t.heroTitle}</span>
                <input
                  type="checkbox"
                  checked={analyticsCookie}
                  onChange={(e) => setAnalyticsCookie(e.target.checked)}
                />
              </label>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 10, background: 'var(--color-surface-container-low)', cursor: 'pointer' }}>
                <span className="tl-title-sm">{t.discoverTitle}</span>
                <input
                  type="checkbox"
                  checked={marketingCookie}
                  onChange={(e) => setMarketingCookie(e.target.checked)}
                />
              </label>
            </div>
            <button type="button" className="tl-btn-primary" onClick={onCloseModal}>
              {t.modalClose}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
