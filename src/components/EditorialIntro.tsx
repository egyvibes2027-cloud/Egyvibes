import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const EditorialIntro: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section className="tl-container" id="why-tourlane" style={{ paddingTop: 48 }}>
      <div className="intro-split">
        <div className="intro-text-col">
          <h2 className="tl-display-sm">{t.introTitle}</h2>
          <p className="tl-body-lg">{t.introBody}</p>
        </div>

        <div className="intro-img-col">
          <img
            src="/assets/egypt/giza-pyramids.jpg"
            alt="Pyramids of Giza at sunset, Egypt"
            className="intro-img"
          />
        </div>
      </div>
    </section>
  );
};
