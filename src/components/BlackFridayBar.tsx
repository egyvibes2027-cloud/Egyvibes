import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface BlackFridayBarProps {
  onOpenOffer: () => void;
}

export const BlackFridayBar: React.FC<BlackFridayBarProps> = ({ onOpenOffer }) => {
  const { t } = useLanguage();
  return (
    <div className="bf-bar" role="region" aria-label="Transparent Egypt USD Pricing Policy">
      <div className="bf-bar-inner">
        <span>{t.topBannerPrefix}</span>
        <button type="button" className="bf-bar-link" onClick={onOpenOffer}>
          {t.topBannerLink}
        </button>
        <span>{t.topBannerSuffix}</span>
      </div>
    </div>
  );
};
