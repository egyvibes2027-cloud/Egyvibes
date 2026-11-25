export type LanguageCode = 'en' | 'ar' | 'fr' | 'de' | 'es' | 'it' | 'ru' | 'zh' | 'ja' | 'pt';

export interface LanguageOption {
  code: LanguageCode;
  nativeName: string;
  englishName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', nativeName: 'English', englishName: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'ar', nativeName: 'العربية', englishName: 'Arabic', flag: '🇪🇬', dir: 'rtl' },
  { code: 'fr', nativeName: 'Français', englishName: 'French', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', nativeName: 'Deutsch', englishName: 'German', flag: '🇩🇪', dir: 'ltr' },
  { code: 'es', nativeName: 'Español', englishName: 'Spanish', flag: '🇪🇸', dir: 'ltr' },
  { code: 'it', nativeName: 'Italiano', englishName: 'Italian', flag: '🇮🇹', dir: 'ltr' },
  { code: 'ru', nativeName: 'Русский', englishName: 'Russian', flag: '🇷🇺', dir: 'ltr' },
  { code: 'zh', nativeName: '中文', englishName: 'Chinese', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ja', nativeName: '日本語', englishName: 'Japanese', flag: '🇯🇵', dir: 'ltr' },
  { code: 'pt', nativeName: 'Português', englishName: 'Portuguese', flag: '🇧🇷', dir: 'ltr' },
];

export type CitySlug =
  | 'cairo-giza'
  | 'luxor'
  | 'aswan'
  | 'sharm-el-sheikh'
  | 'hurghada'
  | 'alexandria'
  | 'siwa'
  | 'fayoum'
  | 'white-desert';

export type TravelStyleSlug =
  | 'private-tour'
  | 'group-tour'
  | 'nile-cruise'
  | 'hidden-gems'
  | 'red-sea'
  | 'culinary'
  | 'wellness'
  | 'luxury';

export type AirportCode = 'CAI' | 'SPX' | 'LXR' | 'ASW' | 'HRG' | 'SSH' | 'HBE';

export interface TranslationStrings {
  pageTitle: string;
  topBannerPrefix: string;
  topBannerLink: string;
  topBannerSuffix: string;

  // Header & Nav
  navDestinations: string;
  navStyles: string;
  navWhyUs: string;
  navExpert: string;
  navAtlasNote: string;
  navAtlasLink: string;
  expertTitle: string;
  expertHours: string;
  expertCallbackTitle: string;
  expertNamePlaceholder: string;
  expertPhonePlaceholder: string;
  expertCallbackBtn: string;
  expertCallbackSent: string;
  expertToastTemplate: string;
  mobileLanguageLabel: string;

  // Hero & Search
  heroTitle: string;
  heroSearchPlaceholderDesktop: string;
  heroSearchPlaceholderMobile: string;
  heroCta: string;
  searchTopLabel: string;
  searchMoreLabel: string;
  searchNoMatchTitle: string;
  searchNoMatchDesc: string;

  // Trust & Editorial & USP
  trustExcellent: string;
  trustVerifiedReviews: string;
  trustOf5: string;
  introTitle: string;
  introBody: string;
  uspTitle: string;
  uspCta: string;
  uspCards: [
    { title: string; description: string },
    { title: string; description: string },
    { title: string; description: string },
    { title: string; description: string },
  ];

  // Moments, How It Works, Examples, Reviews, Stats
  momentsTitle: string;
  momentsSub: string;
  momentsCta: string;
  momentHeadlines: [string, string, string, string, string, string, string, string, string, string];
  howTitle: string;
  howSteps: [
    { title: string; description: string },
    { title: string; description: string },
    { title: string; description: string },
  ];
  examplesTitle: string;
  curatedByLabel: string;
  planDestinationCta: string;
  reviewsTitle: string;
  reviewsCta: string;
  reviewsCountLabel: string;
  statsTitle: string;
  statsLabels: [string, string, string, string];

  // Discover, 2026 Tickets & Hidden Gems
  discoverTitle: string;
  tabTopDestinations: string;
  tabTop10Tickets: string;
  tabHiddenGems: string;
  ticketsSourceNote: string;
  ticketsStarHint: string;
  ticketFreeEntry: string;
  ticketAdultLabel: string;
  ticketStudentLabel: string;
  addToPlannerCta: string;
  includeInTripCta: string;
  gemFilterAll: string;
  gemFilterArch: string;
  gemFilterNature: string;
  gemFilterWellness: string;
  gemFilterCultural: string;
  atlasToggleShow: string;
  atlasToggleHide: string;
  atlasColGovernorate: string;
  atlasColHighlights: string;
  atlasColTheme: string;

  // Newsletter
  newsletterTitle: string;
  newsletterBody: string;
  newsletterUnsubscribe: string;
  newsletterTerms: string;
  newsletterPlaceholder: string;
  newsletterBtn: string;
  newsletterError: string;
  newsletterSuccess: string;
  newsletterPerks: [string, string, string];

  // Footer
  footerBio: string;
  footerAboutHeading: string;
  footerDestHeading: string;
  footerProtectionHeading: string;
  footerProtectionTerms: string;
  footerProtectionDesc: string;
  footerPaymentPolicy: string;
  footerAboutLinks: [string, string, string, string, string, string, string];
  footerAtlasLink: string;
  footerPrivacy: string;
  footerTerms: string;
  footerCookies: string;

  // Modals
  welcomeGreeting: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  modalPricingTitle: string;
  modalPricingBody: string;
  modalBankRefTitle: string;
  modalAboutTitle: string;
  modalAboutBody: string;
  modalPartnersTitle: string;
  modalPartnersBody: string;
  modalSupportTitle: string;
  modalSupportBody: string;
  modalPrivacyTitle: string;
  modalTermsTitle: string;
  modalCookiesTitle: string;
  modalLegalBody: string;
  modalStartPlanning: string;
  modalClose: string;

  // Trip Planner + Compact Estimate + Embedded AI
  plannerAskAi: string;
  plannerManualMode: string;
  plannerStepLabel: string;
  plannerEstLabel: string;
  plannerStepTitles: [string, string, string, string, string, string, string];
  plannerLiveEstimate: string;
  plannerArrivalShort: string;
  plannerExitShort: string;
  plannerCitySingular: string;
  plannerCityPlural: string;
  plannerNightsUnit: string;
  plannerSitesUnit: string;
  plannerStayUnit: string;
  plannerGroupShort: string;
  plannerPrivateShort: string;

  plannerAirportLabel: string;
  plannerCitiesPrompt: string;
  plannerSelectedLabel: string;
  plannerCityIncluded: string;
  plannerCityAdd: string;

  plannerArrivalDateLabel: string;
  plannerNightsLabel: string;
  plannerAdults: string;
  plannerAdultsSub: string;
  plannerStudents: string;
  plannerStudentsSub: string;
  plannerChildren: string;
  plannerChildrenSub: string;
  plannerToddlers: string;
  plannerToddlersSub: string;

  plannerPlacesHint: string;
  plannerShowAllSites: string;
  plannerFilterMyCities: string;
  plannerFreeLabel: string;
  plannerPerPerson: string;

  plannerTiers: { t3: string; t4: string; t5: string; t7: string };
  plannerHotelsHint: string;
  plannerPerNight: string;

  plannerGroupTitle: string;
  plannerGroupDesc: string;
  plannerPrivateTitle: string;
  plannerPrivateDesc: string;
  plannerGuideTitle: string;
  plannerGuideIncluded: string;
  plannerGuideExcluded: string;
  plannerCarTitle: string;
  plannerCarIncluded: string;
  plannerCarExcluded: string;

  plannerSummaryTickets: string;
  plannerSummaryHotels: string;
  plannerSummaryMeals: string;
  plannerSummaryLogistics: string;
  plannerSummaryDiscount: string;
  plannerSummaryTotal: string;
  plannerFullName: string;
  plannerNationality: string;
  plannerEmail: string;
  plannerWhatsapp: string;
  plannerNotes: string;

  plannerBottomPayBanner: string;
  plannerBack: string;
  plannerNext: string;
  plannerSubmit: string;
  plannerReturnHome: string;

  confirmationTitle: string;
  confirmationNotice: string;
  confirmationRefLabel: string;
  confirmationScheduleTitle: string;
  confirmationBankTitle: string;
  confirmationBankLabel: string;
  confirmationAccountLabel: string;
  confirmationCopyIban: string;
  confirmationCopied: string;
  confirmationFollowup: string;
  paymentRule1: string;
  paymentRule2: string;
  paymentRule3: string;

  aiConciergeBtn: string;
  aiSubtitle: string;
  aiWelcomeMessage: string;
  aiSuggestedClassicLabel: string;
  aiThinking: string;
  aiInputPlaceholder: string;
  aiQuickChips: [string, string, string, string, string];

  cityNames: Record<CitySlug, string>;
  specialPlaceNames: Record<string, string>;
  styleNames: Record<TravelStyleSlug, string>;
  airportNames: Record<AirportCode, { name: string; city: string }>;
}
