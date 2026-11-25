import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LightbulbSparkleIcon, MailIcon, PercentIcon, SupportAgentIcon } from './Icons';

interface NewsletterSectionProps {
  onOpenLegal: () => void;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ onOpenLegal }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error');
      setErrorMsg(t.newsletterError);
      return;
    }
    setStatus('success');
    setErrorMsg('');
  };

  return (
    <section className="newsletter-band" aria-labelledby="newsletter-heading">
      <div className="newsletter-inner">
        <div className="newsletter-content-col">
          <h2 id="newsletter-heading" className="tl-display-md" style={{ textAlign: 'start' }}>
            {t.newsletterTitle}
          </h2>

          <p className="tl-body-md newsletter-copy">
            {t.newsletterBody} {t.newsletterUnsubscribe}{' '}
            <button
              type="button"
              onClick={onOpenLegal}
              className="tl-label-lg"
              style={{ color: 'var(--color-outline)', textDecoration: 'underline' }}
            >
              {t.newsletterTerms}
            </button>
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="newsletter-input-group">
              <span style={{ color: 'var(--color-primary)', display: 'inline-flex', flexShrink: 0 }}>
                <MailIcon size={24} />
              </span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                aria-label={t.newsletterPlaceholder}
                placeholder={t.newsletterPlaceholder}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== 'idle') setStatus('idle');
                }}
                style={{
                  flex: 1,
                  minWidth: 0,
                  height: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: 16,
                }}
              />
              <button type="submit" className="tl-btn-primary">
                {t.newsletterBtn}
              </button>
            </div>
            {status === 'error' && (
              <p className="tl-body-sm" style={{ color: 'var(--color-error)', marginTop: 8, paddingInlineStart: 16 }}>
                {errorMsg}
              </p>
            )}
            {status === 'success' && (
              <p className="tl-body-md" style={{ color: 'var(--color-primary)', fontWeight: 500, marginTop: 10, paddingInlineStart: 16 }}>
                {t.newsletterSuccess}
              </p>
            )}
          </form>

          <div className="newsletter-perks">
            <div className="newsletter-perk-item">
              <span style={{ color: 'var(--color-primary)', display: 'inline-flex' }}>
                <LightbulbSparkleIcon size={24} />
              </span>
              <span className="tl-body-lg">{t.newsletterPerks[0]}</span>
            </div>
            <div className="newsletter-perk-item">
              <span style={{ color: 'var(--color-primary)', display: 'inline-flex' }}>
                <PercentIcon size={24} />
              </span>
              <span className="tl-body-lg">{t.newsletterPerks[1]}</span>
            </div>
            <div className="newsletter-perk-item">
              <span style={{ color: 'var(--color-primary)', display: 'inline-flex' }}>
                <SupportAgentIcon size={24} />
              </span>
              <span className="tl-body-lg">{t.newsletterPerks[2]}</span>
            </div>
          </div>
        </div>

        <div className="newsletter-artwork-wrap">
          <img
            src="/assets/egypt/newsletter-egypt.png"
            alt="Egyptian hoopoe and lotus temple collage"
            className="newsletter-artwork-img"
          />
        </div>
      </div>
    </section>
  );
};
