import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TrustpilotStars, TrustpilotWordmark } from './Icons';

export const TrustBar: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="trustpilot-strip">
      <a
        href="#firsthand-experiences"
        className="trustpilot-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('firsthand-experiences')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span className="tl-title-sm">{t.trustExcellent}</span>
        <TrustpilotStars rating={4.8} size={18} />
        <bdi className="tl-title-sm" dir="ltr">4.8 / 5</bdi>
        <bdi className="tl-title-sm" dir="ltr">3,420</bdi>
        <span className="tl-body-md">{t.trustVerifiedReviews}</span>
        <TrustpilotWordmark width={92} height={22} />
      </a>
    </div>
  );
};
