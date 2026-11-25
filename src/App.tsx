import { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { BlackFridayBar } from './components/BlackFridayBar';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TrustBar } from './components/TrustBar';
import { EditorialIntro } from './components/EditorialIntro';
import { ValueProps } from './components/ValueProps';
import { TourlaneMoments } from './components/TourlaneMoments';
import { HowItWorks } from './components/HowItWorks';
import { ExampleTrips } from './components/ExampleTrips';
import { ReviewsCarousel } from './components/ReviewsCarousel';
import { StatsBar } from './components/StatsBar';
import { DestinationsGrid } from './components/DestinationsGrid';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { TripPlannerModal } from './components/TripPlannerModal';
import { Modals, type ModalType } from './components/Modals';
import { LanguageWelcomeModal } from './components/LanguageWelcomeModal';

interface PlannerState {
  open: boolean;
  mode: 'manual' | 'ai';
  cities: string[];
  landmarks: string[];
  initialAiPrompt?: string;
}

function NileWayContent() {
  const [plannerState, setPlannerState] = useState<PlannerState>({
    open: false,
    mode: 'manual',
    cities: ['cairo-giza'],
    landmarks: ['giza-pyramids', 'grand-egyptian-museum'],
  });

  const [starredIds, setStarredIds] = useState<string[]>(['giza-pyramids', 'siwa-salt-lakes']);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [lightbox, setLightbox] = useState<{
    src: string;
    title: string;
    subtitle?: string;
  } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const openPlannerManual = (citySlug = 'cairo-giza', landmarkId?: string) => {
    setPlannerState((prev) => ({
      open: true,
      mode: 'manual',
      cities: citySlug ? [citySlug] : prev.cities,
      landmarks: landmarkId
        ? Array.from(new Set([...prev.landmarks, landmarkId]))
        : prev.landmarks,
      initialAiPrompt: undefined,
    }));
  };

  const openPlannerAi = (initialPrompt?: string) => {
    setPlannerState((prev) => ({
      ...prev,
      open: true,
      mode: 'ai',
      initialAiPrompt: initialPrompt,
    }));
  };

  const toggleStar = (id: string) => {
    setStarredIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleRequestCallback = ({ name }: { name: string; phone: string }) => {
    setToast(`Callback scheduled for ${name}. Our Cairo travel concierge will contact you shortly!`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="tl-page-shell" id="top">
      <BlackFridayBar onOpenOffer={() => setActiveModal('pricing')} />

      <HeroSection
        onStartPlanning={(slug) => openPlannerManual(slug)}
        onAskAi={(prompt) => openPlannerAi(prompt)}
        headerSlot={
          <Header
            onSelectDestination={(slug) => openPlannerManual(slug)}
            onSelectTravelStyle={() => openPlannerManual('cairo-giza')}
            onRequestCallback={handleRequestCallback}
          />
        }
      />

      <TrustBar />

      <main className="tl-main">
        <EditorialIntro />

        <ValueProps onStartPlanning={() => openPlannerManual('cairo-giza')} />

        <TourlaneMoments
          onStartPlanning={() => openPlannerManual('cairo-giza')}
          onOpenLightbox={(src, title, subtitle) => setLightbox({ src, title, subtitle })}
        />

        <HowItWorks />

        <ExampleTrips
          onPlanDestination={(slug) => openPlannerManual(slug)}
          onOpenLightbox={(src, title, subtitle) => setLightbox({ src, title, subtitle })}
        />

        <ReviewsCarousel onStartPlanning={() => openPlannerManual('cairo-giza')} />

        <StatsBar />

        <DestinationsGrid
          starredIds={starredIds}
          onToggleStar={toggleStar}
          onSelectDestination={(slug, _name, landmarkId) => openPlannerManual(slug, landmarkId)}
        />

        <NewsletterSection onOpenLegal={() => setActiveModal('terms')} />
      </main>

      <Footer
        onSelectDestination={(slug) => openPlannerManual(slug)}
        onOpenAiConcierge={() => openPlannerAi()}
        onOpenModal={(m) => setActiveModal(m)}
      />

      <LanguageWelcomeModal />

      {plannerState.open && (
        <TripPlannerModal
          initialMode={plannerState.mode}
          initialAiPrompt={plannerState.initialAiPrompt}
          initialCities={plannerState.cities}
          initialLandmarks={plannerState.landmarks}
          initialStarredIds={starredIds}
          onToggleStarGlobal={toggleStar}
          onClose={() => setPlannerState((prev) => ({ ...prev, open: false, initialAiPrompt: undefined }))}
        />
      )}

      <Modals
        activeModal={activeModal}
        lightbox={lightbox}
        onCloseModal={() => setActiveModal(null)}
        onCloseLightbox={() => setLightbox(null)}
        onStartPlanning={() => openPlannerManual('cairo-giza')}
      />

      {toast && (
        <div
          role="status"
          style={{
            position: 'fixed',
            bottom: 24,
            insetInlineEnd: 24,
            background: '#1b1c17',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 12,
            boxShadow: 'var(--shadow-e3)',
            zIndex: 300,
            fontSize: 14,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <NileWayContent />
    </LanguageProvider>
  );
}

export default App;
