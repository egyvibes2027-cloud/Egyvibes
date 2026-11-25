import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { NAV_DESTINATIONS, NAV_TRAVEL_STYLES, SALES_CONFIG } from '../data/egyptData';
import { localizeCityName, SUPPORTED_LANGUAGES, type TravelStyleSlug } from '../i18n/translations';
import { useLanguage } from '../context/LanguageContext';
import { MenuIcon, NileWayLogo, PhoneIcon } from './Icons';

interface HeaderProps {
  onSelectDestination: (citySlug: string, destinationName: string) => void;
  onSelectTravelStyle: (styleName: string) => void;
  onRequestCallback: (payload: { name: string; phone: string }) => void;
}

type ActiveDropdown = 'destinations' | 'styles' | 'expert' | 'language-desktop' | 'language-mobile' | null;

export const Header: React.FC<HeaderProps> = ({
  onSelectDestination,
  onSelectTravelStyle,
  onRequestCallback,
}) => {
  const { lang, currentLanguage, setLanguage, t } = useLanguage();
  const [openMenu, setOpenMenu] = useState<ActiveDropdown>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<'destinations' | 'styles' | 'language' | null>('destinations');
  const [cbName, setCbName] = useState('');
  const [cbPhone, setCbPhone] = useState('');
  const [cbSent, setCbSent] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null);
        setMobileDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const toggleMenu = (key: ActiveDropdown) => {
    setOpenMenu((prev) => (prev === key ? null : key));
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cbPhone.trim()) return;
    onRequestCallback({ name: cbName.trim() || 'Traveler', phone: cbPhone.trim() });
    setCbSent(true);
    setTimeout(() => {
      setCbSent(false);
      setCbName('');
      setCbPhone('');
      setOpenMenu(null);
    }, 2200);
  };

  return (
    <div className="top-nav-wrap" ref={navRef}>
      <nav className="top-nav" aria-label="Main navigation">
        <div className="nav-brand-left">
          <button
            type="button"
            className="nav-hamburger"
            aria-label="drawer menu"
            aria-expanded={mobileDrawerOpen}
            onClick={() => setMobileDrawerOpen(true)}
          >
            <MenuIcon size={24} />
          </button>

          <a
            href="#top"
            className="nav-logo-link"
            title="EGYVIBES Egypt"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <NileWayLogo className="nav-logo-svg" />
          </a>
        </div>

        {/* Mobile Quick Language Button */}
        <div className="nav-mobile-lang-wrap">
          <button
            type="button"
            className="nav-mobile-lang-btn"
            onClick={() => toggleMenu('language-mobile')}
            aria-expanded={openMenu === 'language-mobile'}
            aria-label="Choose language mobile"
          >
            <span>{currentLanguage.flag} {currentLanguage.code.toUpperCase()}</span>
            <ChevronDown size={14} />
          </button>

          {openMenu === 'language-mobile' && (
            <div className="lang-dropdown-panel" role="listbox" aria-label="Supported languages mobile">
              {SUPPORTED_LANGUAGES.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  role="option"
                  aria-selected={opt.code === lang}
                  className={`lang-option-item ${opt.code === lang ? 'active' : ''}`}
                  onClick={() => {
                    setLanguage(opt.code);
                    setOpenMenu(null);
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span>{opt.flag}</span>
                    <span>{opt.nativeName}</span>
                  </span>
                  {opt.code === lang && <Check size={15} />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="nav-desktop-menu">
          <div className="nav-menu-item">
            <button
              type="button"
              className="nav-link-btn"
              aria-expanded={openMenu === 'destinations'}
              onClick={() => toggleMenu('destinations')}
            >
              <span>{t.navDestinations}</span>
            </button>

            {openMenu === 'destinations' && (
              <div className="nav-dropdown-panel" role="dialog" aria-label="Egypt destinations menu">
                <div className="nav-dropdown-grid">
                  {NAV_DESTINATIONS.map((item) => {
                    const label = localizeCityName(item.slug, item.label, t);
                    return (
                      <button
                        key={item.label}
                        type="button"
                        className="nav-dropdown-card"
                        onClick={() => {
                          setOpenMenu(null);
                          onSelectDestination(item.slug, label);
                        }}
                      >
                        <img src={item.imageUrl} alt={label} className="nav-dropdown-thumb" />
                        <span className="tl-title-sm">{label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="nav-dropdown-footer">
                  <span className="tl-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {t.navAtlasNote}
                  </span>
                  <button
                    type="button"
                    className="tl-label-lg"
                    style={{ color: 'var(--color-primary)' }}
                    onClick={() => {
                      setOpenMenu(null);
                      document.getElementById('discover-destinations')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {t.navAtlasLink}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="nav-menu-item">
            <button
              type="button"
              className="nav-link-btn"
              aria-expanded={openMenu === 'styles'}
              onClick={() => toggleMenu('styles')}
            >
              <span>{t.navStyles}</span>
            </button>

            {openMenu === 'styles' && (
              <div className="nav-dropdown-panel narrow" role="dialog" aria-label="Travel styles menu">
                <div className="nav-dropdown-grid">
                  {NAV_TRAVEL_STYLES.map((style) => {
                    const styleLabel = t.styleNames[style.slug as TravelStyleSlug] ?? style.label;
                    return (
                      <button
                        key={style.slug}
                        type="button"
                        className="nav-dropdown-card"
                        onClick={() => {
                          setOpenMenu(null);
                          onSelectTravelStyle(styleLabel);
                        }}
                      >
                        <img src={style.imageUrl} alt={styleLabel} className="nav-dropdown-thumb" />
                        <span className="tl-title-sm">{styleLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <span className="nav-divider" aria-hidden="true" />

          <a
            href="#why-tourlane"
            className="nav-link-btn"
            onClick={(e) => {
              e.preventDefault();
              setOpenMenu(null);
              document.getElementById('why-tourlane')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t.navWhyUs}
          </a>

          <span className="nav-divider" aria-hidden="true" />

          <div className="nav-menu-item">
            <button
              type="button"
              className="nav-link-btn"
              aria-expanded={openMenu === 'expert'}
              onClick={() => toggleMenu('expert')}
            >
              <PhoneIcon size={18} />
              <span>{t.navExpert}</span>
            </button>

            {openMenu === 'expert' && (
              <div className="expert-popover" role="dialog" aria-label={t.expertTitle}>
                <p className="tl-title-md" style={{ marginBottom: 4 }}>
                  {t.expertTitle}
                </p>
                <p className="tl-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 14 }}>
                  {t.expertHours}
                </p>
                <a
                  href={SALES_CONFIG.phoneHref}
                  className="tl-btn-primary"
                  style={{ width: '100%', marginBottom: 16 }}
                >
                  <PhoneIcon size={18} />
                  <bdi dir="ltr">{SALES_CONFIG.phoneDisplay}</bdi>
                </a>
                <div style={{ borderTop: '1px solid var(--color-outline-variant)', paddingTop: 14 }}>
                  <p className="tl-title-sm" style={{ marginBottom: 8 }}>
                    {t.expertCallbackTitle}
                  </p>
                  {cbSent ? (
                    <p className="tl-body-md" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
                      {t.expertCallbackSent}
                    </p>
                  ) : (
                    <form onSubmit={handleCallbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <input
                        type="text"
                        placeholder={t.expertNamePlaceholder}
                        value={cbName}
                        onChange={(e) => setCbName(e.target.value)}
                        style={{
                          height: 38,
                          padding: '0 12px',
                          borderRadius: 8,
                          border: '1px solid var(--color-outline-variant)',
                          background: '#fff',
                          fontSize: 14,
                        }}
                      />
                      <input
                        type="tel"
                        required
                        placeholder={t.expertPhonePlaceholder}
                        value={cbPhone}
                        onChange={(e) => setCbPhone(e.target.value)}
                        style={{
                          height: 38,
                          padding: '0 12px',
                          borderRadius: 8,
                          border: '1px solid var(--color-outline-variant)',
                          background: '#fff',
                          fontSize: 14,
                        }}
                      />
                      <button type="submit" className="tl-btn-outline" style={{ width: '100%', height: 36 }}>
                        {t.expertCallbackBtn}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Language Switcher Pill (replaces Login!) */}
          <div className="nav-menu-item">
            <button
              type="button"
              className="nav-lang-btn"
              aria-expanded={openMenu === 'language-desktop'}
              aria-label="Choose language"
              onClick={() => toggleMenu('language-desktop')}
            >
              <span>{currentLanguage.flag} {currentLanguage.nativeName}</span>
              <ChevronDown size={15} />
            </button>

            {openMenu === 'language-desktop' && (
              <div className="lang-dropdown-panel" role="listbox" aria-label="Supported languages">
                {SUPPORTED_LANGUAGES.map((opt) => (
                  <button
                    key={opt.code}
                    type="button"
                    role="option"
                    aria-selected={opt.code === lang}
                    className={`lang-option-item ${opt.code === lang ? 'active' : ''}`}
                    onClick={() => {
                      setLanguage(opt.code);
                      setOpenMenu(null);
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span>{opt.flag}</span>
                      <span>{opt.nativeName}</span>
                    </span>
                    {opt.code === lang && <Check size={15} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileDrawerOpen && (
        <div
          className="mobile-drawer-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
          onClick={() => setMobileDrawerOpen(false)}
        >
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--color-primary)', display: 'inline-flex' }}>
                <NileWayLogo className="nav-logo-svg" />
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileDrawerOpen(false)}
                style={{ padding: 6 }}
              >
                <X size={22} />
              </button>
            </div>

            <div>
              <button
                type="button"
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  fontWeight: 500,
                }}
                onClick={() =>
                  setMobileAccordion((prev) => (prev === 'destinations' ? null : 'destinations'))
                }
              >
                <span>{t.navDestinations}</span>
                <ChevronDown
                  size={18}
                  style={{
                    transform: mobileAccordion === 'destinations' ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                  }}
                />
              </button>
              {mobileAccordion === 'destinations' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, paddingBottom: 12 }}>
                  {NAV_DESTINATIONS.map((d) => {
                    const label = localizeCityName(d.slug, d.label, t);
                    return (
                      <button
                        key={d.label}
                        type="button"
                        className="nav-dropdown-card"
                        onClick={() => {
                          setMobileDrawerOpen(false);
                          onSelectDestination(d.slug, label);
                        }}
                      >
                        <img src={d.imageUrl} alt={label} style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
                        <span className="tl-body-md">{label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--color-outline-variant)' }}>
              <button
                type="button"
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  fontWeight: 500,
                }}
                onClick={() => setMobileAccordion((prev) => (prev === 'styles' ? null : 'styles'))}
              >
                <span>{t.navStyles}</span>
                <ChevronDown
                  size={18}
                  style={{
                    transform: mobileAccordion === 'styles' ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                  }}
                />
              </button>
              {mobileAccordion === 'styles' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingBottom: 12 }}>
                  {NAV_TRAVEL_STYLES.map((s) => {
                    const label = t.styleNames[s.slug as TravelStyleSlug] ?? s.label;
                    return (
                      <button
                        key={s.slug}
                        type="button"
                        className="nav-dropdown-card"
                        onClick={() => {
                          setMobileDrawerOpen(false);
                          onSelectTravelStyle(label);
                        }}
                      >
                        <img src={s.imageUrl} alt={label} style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
                        <span className="tl-body-md">{label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--color-outline-variant)' }}>
              <button
                type="button"
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  fontWeight: 500,
                }}
                onClick={() => setMobileAccordion((prev) => (prev === 'language' ? null : 'language'))}
              >
                <span>{t.mobileLanguageLabel} ({currentLanguage.nativeName})</span>
                <ChevronDown
                  size={18}
                  style={{
                    transform: mobileAccordion === 'language' ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                  }}
                />
              </button>
              {mobileAccordion === 'language' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, paddingBottom: 12 }}>
                  {SUPPORTED_LANGUAGES.map((opt) => (
                    <button
                      key={opt.code}
                      type="button"
                      className={`lang-option-item ${opt.code === lang ? 'active' : ''}`}
                      onClick={() => {
                        setLanguage(opt.code);
                        setMobileDrawerOpen(false);
                      }}
                    >
                      <span>{opt.flag} {opt.nativeName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a
              href="#why-tourlane"
              style={{
                padding: '12px 0',
                borderTop: '1px solid var(--color-outline-variant)',
                fontWeight: 500,
              }}
              onClick={(e) => {
                e.preventDefault();
                setMobileDrawerOpen(false);
                document.getElementById('why-tourlane')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t.navWhyUs}
            </a>

            <div
              style={{
                borderTop: '1px solid var(--color-outline-variant)',
                paddingTop: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <a href={SALES_CONFIG.phoneHref} className="tl-btn-primary" style={{ width: '100%' }}>
                <PhoneIcon size={18} />
                <span>{SALES_CONFIG.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
