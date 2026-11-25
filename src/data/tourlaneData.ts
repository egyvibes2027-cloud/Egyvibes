export interface NavMenuItem {
  label: string;
  slug: string;
  imageUrl: string;
}

export interface SearchDestination {
  name: string;
  slug: string;
  imageUrl: string;
  alpha2: string;
  destinationType: 'country' | 'admin_area' | 'continent';
  isTop?: boolean;
}

export interface UspItem {
  title: string;
  description: string;
  iconSrc: string;
}

export interface MomentItem {
  headline: string;
  subheadline: string;
  imageUrl: string;
}

export interface HowItWorksStep {
  number: number;
  title: string;
  description: string;
}

export interface TripPhoto {
  url: string;
  tag?: string;
}

export interface ExampleTrip {
  tabTitle: string;
  slug: string;
  title: string;
  duration: string;
  numberOfStops: string;
  transportMode: string;
  accommodationTag: string;
  activityTag: string;
  transportTag: string;
  foodTag: string;
  flightTag: string;
  customerLabel: string;
  customerName: string;
  customerImageUrl: string;
  ctaCopy: string;
  photos: TripPhoto[]; // [0..3] tagged collage photos, [4] map photo (no hashtag)
}

export interface TrustpilotReview {
  tripLabel: string;
  tripSlug: string;
  tripPhotoUrl: string;
  reviewerName: string;
  avatarUrl?: string;
  initial: string;
  text: string;
  date: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface DiscoverDestination {
  name: string;
  slug: string;
  imageUrl: string;
  alt: string;
}

export const SALES_CONFIG = {
  phoneDisplay: '+1 332 291 6470',
  phoneHref: 'tel:+13322916470',
  hoursLabel: 'Mon–Fri, 8:00 AM – 5:00 PM EST',
};

export const NAV_DESTINATIONS: NavMenuItem[] = [
  { label: 'Italy', slug: 'italy', imageUrl: '/assets/nav/destinations-italy.webp' },
  { label: 'Greece', slug: 'greece', imageUrl: '/assets/nav/destinations-greece.webp' },
  { label: 'Ireland', slug: 'ireland', imageUrl: '/assets/nav/destinations-ireland.webp' },
  { label: 'France', slug: 'france', imageUrl: '/assets/nav/destinations-france.webp' },
  { label: 'Spain', slug: 'spain', imageUrl: '/assets/nav/destinations-spain.webp' },
  { label: 'England', slug: 'england', imageUrl: '/assets/nav/destinations-england.webp' },
  { label: 'Scotland', slug: 'scotland', imageUrl: '/assets/nav/destinations-scotland.webp' },
  { label: 'Portugal', slug: 'portugal', imageUrl: '/assets/nav/destinations-portugal.webp' },
  { label: 'Austria', slug: 'austria', imageUrl: '/assets/nav/destinations-austria.webp' },
  { label: 'Germany', slug: 'germany', imageUrl: '/assets/nav/destinations-germany.webp' },
];

export const NAV_TRAVEL_STYLES: NavMenuItem[] = [
  { label: 'Private tour', slug: 'private-tour', imageUrl: '/assets/nav/styles-private-tour.webp' },
  { label: 'Road trip', slug: 'road-trip', imageUrl: '/assets/nav/styles-road-trip.webp' },
  { label: 'City break', slug: 'city-break', imageUrl: '/assets/nav/styles-city-break.webp' },
  { label: 'Romantic escape', slug: 'romantic-escape', imageUrl: '/assets/nav/styles-romantic-escape.webp' },
  { label: 'Family vacation', slug: 'family-vacation', imageUrl: '/assets/nav/styles-family-vacation.webp' },
  { label: 'Multi-country', slug: 'multi-country', imageUrl: '/assets/nav/styles-multi-country.webp' },
  { label: 'Short trip', slug: 'short-trip', imageUrl: '/assets/nav/styles-short-trip.webp' },
  { label: 'Rail journey', slug: 'rail-journey', imageUrl: '/assets/nav/styles-rail-journey.webp' },
];

export const SEARCH_DESTINATIONS: SearchDestination[] = [
  { name: 'Italy', slug: 'italy', imageUrl: '/assets/search/italy.webp', alpha2: 'IT', destinationType: 'country', isTop: true },
  { name: 'Greece', slug: 'greece', imageUrl: '/assets/search/greece.webp', alpha2: 'GR', destinationType: 'country', isTop: true },
  { name: 'Ireland', slug: 'ireland', imageUrl: '/assets/search/ireland.webp', alpha2: 'IE', destinationType: 'country', isTop: true },
  { name: 'France', slug: 'france', imageUrl: '/assets/search/france.webp', alpha2: 'FR', destinationType: 'country', isTop: true },
  { name: 'Spain', slug: 'spain', imageUrl: '/assets/search/spain.webp', alpha2: 'ES', destinationType: 'country', isTop: true },
  { name: 'England', slug: 'england', imageUrl: '/assets/search/england.webp', alpha2: 'GB', destinationType: 'country', isTop: true },
  { name: 'Scotland', slug: 'scotland', imageUrl: '/assets/search/scotland.webp', alpha2: 'GB-SCT', destinationType: 'admin_area' },
  { name: 'Portugal', slug: 'portugal', imageUrl: '/assets/search/portugal.webp', alpha2: 'PT', destinationType: 'country' },
  { name: 'Northern Ireland', slug: 'northern-ireland', imageUrl: '/assets/search/northern-ireland.webp', alpha2: 'GB-NIR', destinationType: 'admin_area' },
  { name: 'Austria', slug: 'austria', imageUrl: '/assets/search/austria.webp', alpha2: 'AT', destinationType: 'country' },
  { name: 'Germany', slug: 'germany', imageUrl: '/assets/search/germany.webp', alpha2: 'DE', destinationType: 'country' },
  { name: 'Switzerland', slug: 'switzerland', imageUrl: '/assets/search/switzerland.webp', alpha2: 'CH', destinationType: 'country' },
  { name: 'Wales', slug: 'wales', imageUrl: '/assets/search/wales.webp', alpha2: 'GB-WLS', destinationType: 'admin_area' },
  { name: 'United Kingdom', slug: 'united-kingdom', imageUrl: '/assets/search/united-kingdom.webp', alpha2: 'GB', destinationType: 'country' },
  { name: 'Europe', slug: 'europe', imageUrl: '/assets/search/europe.webp', alpha2: 'EU', destinationType: 'continent' },
  { name: 'Japan', slug: 'japan', imageUrl: '/assets/search/japan.webp', alpha2: 'JP', destinationType: 'country' },
];

export const USP_ITEMS: UspItem[] = [
  {
    title: 'Plan for free',
    description: 'Custom holiday packages and trips that fit your budget',
    iconSrc: '/assets/usp/free-planning.svg',
  },
  {
    title: 'Personalized for you',
    description: 'Itineraries built exactly to your needs',
    iconSrc: '/assets/usp/personalized-trip.svg',
  },
  {
    title: 'Private VIP guides',
    description: 'A personal English-speaking, native-European travel expert for every step',
    iconSrc: '/assets/usp/expert-advice.svg',
  },
  {
    title: 'Peace-of-mind support',
    description: 'Full service assistance before, during, and after your trip',
    iconSrc: '/assets/usp/comfort-support.svg',
  },
];

export const MOMENTS_AVATARS = [
  '/assets/moments/avatar-1.webp',
  '/assets/moments/avatar-2.webp',
  '/assets/moments/avatar-3.webp',
  '/assets/moments/avatar-4.webp',
];

export const TOURLANE_MOMENTS: MomentItem[] = [
  { headline: 'Getting the Royal Family experience', subheadline: 'Dave and Kathy', imageUrl: '/assets/moments/moment-1.webp' },
  { headline: 'Exploring castles in Edinburgh', subheadline: 'John and Colleen', imageUrl: '/assets/moments/moment-2.webp' },
  { headline: 'The Royal Mews', subheadline: 'Liz and Eric', imageUrl: '/assets/moments/moment-3.webp' },
  { headline: 'Sea cliffs in the summer', subheadline: 'Matt and Rachel', imageUrl: '/assets/moments/moment-4.webp' },
  { headline: 'Hiking the Causeway', subheadline: 'Chris and James', imageUrl: '/assets/moments/moment-5.webp' },
  { headline: 'Nature, history, and hiking', subheadline: 'Scott and Elaine', imageUrl: '/assets/moments/moment-6.webp' },
  { headline: 'VIP Stone Circle Experience', subheadline: 'Carly and Will', imageUrl: '/assets/moments/moment-7.webp' },
  { headline: 'Chasing the Loch Ness Monster', subheadline: 'Nicole and Amy', imageUrl: '/assets/moments/moment-8.webp' },
  { headline: 'Traversing the Venice canals', subheadline: 'Mike and Laura', imageUrl: '/assets/moments/moment-9.webp' },
  { headline: 'Cathedral of Palermo', subheadline: 'Scott and Trish', imageUrl: '/assets/moments/moment-10.webp' },
];

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    number: 1,
    title: 'Dream it',
    description: 'Give us a few details like destination, travel preferences, and budget to receive a free personalized travel itinerary in minutes.',
  },
  {
    number: 2,
    title: 'Customize it',
    description: 'In a one-on-one consultation, we pair you with an English-speaking, native-European travel expert to customize your trip even more, making it unique to you and providing in-depth knowledge on every destination.',
  },
  {
    number: 3,
    title: 'Book it',
    description: 'Or better yet, we’ll book it for you. Every detail is covered by us and you’ll have dedicated guides with you every step of the way, so you can focus on the fun. No action needed — just enjoy the ride.',
  },
];

export const EXAMPLE_TRIPS: ExampleTrip[] = [
  {
    tabTitle: 'Italy',
    slug: 'italy',
    title: 'Living La Dolce Vita in Italy',
    duration: '8 nights',
    numberOfStops: '4 stops',
    transportMode: 'Private guide',
    accommodationTag: 'Farmhouse',
    activityTag: 'Gondola ride',
    transportTag: 'Vespa tour',
    foodTag: 'Local produce',
    flightTag: 'London stopover',
    customerLabel: 'Created for',
    customerName: 'Edward and Susan',
    customerImageUrl: '/assets/trips/italy/customer.webp',
    ctaCopy: 'Plan your Italy trip for free',
    photos: [
      { url: '/assets/trips/italy/photo-1.webp', tag: 'Gelato' },
      { url: '/assets/trips/italy/photo-2.webp', tag: 'Palermo' },
      { url: '/assets/trips/italy/photo-3.webp', tag: 'Colosseum' },
      { url: '/assets/trips/italy/photo-4.webp', tag: 'Gondola ride' },
      { url: '/assets/trips/italy/photo-5.webp' },
    ],
  },
  {
    tabTitle: 'Greece',
    slug: 'greece',
    title: 'Between gods and Aegean gems: Athens to the Cyclades',
    duration: '14 nights',
    numberOfStops: '6 stops',
    transportMode: 'Private guide',
    accommodationTag: 'Boutique hotel',
    activityTag: 'Island hopping',
    transportTag: 'Speed boat',
    foodTag: 'Local produce',
    flightTag: 'Business class',
    customerLabel: 'Created for',
    customerName: 'Samantha and Daniel',
    customerImageUrl: '/assets/trips/greece/customer.webp',
    ctaCopy: 'Plan your Greece trip for free',
    photos: [
      { url: '/assets/trips/greece/photo-1.webp', tag: 'Acropolis' },
      { url: '/assets/trips/greece/photo-2.webp', tag: 'Athens' },
      { url: '/assets/trips/greece/photo-3.webp', tag: 'Santorini' },
      { url: '/assets/trips/greece/photo-4.webp', tag: 'Mykonos' },
      { url: '/assets/trips/greece/photo-5.webp' },
    ],
  },
  {
    tabTitle: 'Ireland',
    slug: 'ireland',
    title: 'Riding the rails through timeless Ireland',
    duration: '6 nights',
    numberOfStops: '3 stops',
    transportMode: 'Train',
    accommodationTag: 'Countryside hotel',
    activityTag: 'Cliffs of Moher',
    transportTag: 'Train travel',
    foodTag: 'Bed & breakfast',
    flightTag: 'Business class',
    customerLabel: 'Created for',
    customerName: 'Robert, James, Diane and Linda',
    customerImageUrl: '/assets/trips/ireland/customer.webp',
    ctaCopy: 'Plan your Ireland trip for free',
    photos: [
      { url: '/assets/trips/ireland/photo-1.webp', tag: 'Cliffs' },
      { url: '/assets/trips/ireland/photo-2.webp', tag: 'Nature' },
      { url: '/assets/trips/ireland/photo-3.webp', tag: 'Wildlife' },
      { url: '/assets/trips/ireland/photo-4.webp', tag: 'City trip' },
      { url: '/assets/trips/ireland/photo-5.webp' },
    ],
  },
  {
    tabTitle: 'Spain',
    slug: 'spain',
    title: 'Seven days of sunshine, culture, and timeless charm',
    duration: '6 nights',
    numberOfStops: '4 stops',
    transportMode: 'Private guide',
    accommodationTag: 'Boutique hotel',
    activityTag: 'Alhambra & Generalife',
    transportTag: 'Private transfer',
    foodTag: 'Local produce',
    flightTag: 'Business class',
    customerLabel: 'Created for',
    customerName: 'Jessica, Michale, Emily, and Jacob',
    customerImageUrl: '/assets/trips/spain/customer.webp',
    ctaCopy: 'Plan your Spain trip for free',
    photos: [
      { url: '/assets/trips/spain/photo-1.webp', tag: 'Flamenco' },
      { url: '/assets/trips/spain/photo-2.webp', tag: 'Barcelona' },
      { url: '/assets/trips/spain/photo-3.webp', tag: 'Alhambra' },
      { url: '/assets/trips/spain/photo-4.webp', tag: 'Madrid' },
      { url: '/assets/trips/spain/photo-5.webp' },
    ],
  },
  {
    tabTitle: 'England',
    slug: 'england',
    title: 'History, magic, and high tea: Your English escape',
    duration: '9 nights',
    numberOfStops: '4 stops',
    transportMode: 'Chauffeur guide',
    accommodationTag: 'Historical buildings',
    activityTag: 'Harry Potter',
    transportTag: 'Luxury transfers',
    foodTag: 'Afternoon tea',
    flightTag: 'Direct flight',
    customerLabel: 'Created for',
    customerName: 'Michael and Barbara',
    customerImageUrl: '/assets/trips/england/customer.webp',
    ctaCopy: 'Plan your England trip for free',
    photos: [
      { url: '/assets/trips/england/photo-1.webp', tag: 'Scones' },
      { url: '/assets/trips/england/photo-2.webp', tag: 'WindsorCastle' },
      { url: '/assets/trips/england/photo-3.webp', tag: 'Buckingham Palace' },
      { url: '/assets/trips/england/photo-4.webp', tag: 'Tower bridge' },
      { url: '/assets/trips/england/photo-5.webp' },
    ],
  },
];

export const TRUSTPILOT_REVIEWS: TrustpilotReview[] = [
  {
    tripLabel: 'Trip to Italy',
    tripSlug: 'italy',
    tripPhotoUrl: '/assets/reviews/italy.webp',
    reviewerName: 'steven dessert',
    avatarUrl: '/assets/reviews/steven.png',
    initial: 'S',
    text: 'I saw an ad for Tourlane on Facebook one day as we were getting ready to start planning our once in a lifetime trip to Italy so I sent them a message and the rest is history.',
    date: '09/19/2026',
  },
  {
    tripLabel: 'Trip to Portugal',
    tripSlug: 'portugal',
    tripPhotoUrl: '/assets/reviews/portugal.webp',
    reviewerName: 'Nicole Renard',
    avatarUrl: '/assets/reviews/nicole.png',
    initial: 'N',
    text: 'Our trip to Portugal came to LIFE with the help of tourlane. They recommended so many fun things we never would have thought of and we really appreciated Janine selecting high quality vendors we knew we could trust. Having everything in the app made the trip seamless and stress free!',
    date: '06/30/2026',
  },
  {
    tripLabel: 'Trip to Ireland',
    tripSlug: 'ireland',
    tripPhotoUrl: '/assets/reviews/ireland.webp',
    reviewerName: 'Amy Hughes',
    avatarUrl: '/assets/reviews/amy.png',
    initial: 'A',
    text: "Our family trip for 4 to Ireland was completely lovely. Janine listened to our needs and wants and made amazing suggestions to hit some beautiful sites and places in the timeframe we had. We didn't want to do a full guided tour that had a generic itinerary planned out for us because we wanted to have some time to explore and do things on our own timeframe and with just the four of us.",
    date: '08/29/2026',
  },
  {
    tripLabel: 'Trip to Scotland',
    tripSlug: 'scotland',
    tripPhotoUrl: '/assets/reviews/scotland.webp',
    reviewerName: 'Jim Franklin',
    avatarUrl: '/assets/reviews/jim.png',
    initial: 'J',
    text: 'If you are looking for a travel agent who truly listens, look no further than Taylor Bathurst-Pniwczak. She reached out while I was struggling with internet searches for our 2026 Scotland trip and completely understood what my wife and I were looking for.',
    date: '03/15/2026',
  },
  {
    tripLabel: 'Trip to Greece',
    tripSlug: 'greece',
    tripPhotoUrl: '/assets/reviews/greece.webp',
    reviewerName: 'marilyn alvarado',
    initial: 'M',
    text: 'Austin designed the best trip ever to Greece. Exactly, as I had planned. Thank you for everything. Also, the representative Leonala from Greece was always on top and easy to reach when I had questions.',
    date: '08/29/2026',
  },
  {
    tripLabel: 'Trip to France',
    tripSlug: 'france',
    tripPhotoUrl: '/assets/reviews/france.webp',
    reviewerName: 'Robin Lenay',
    initial: 'R',
    text: 'So we booked dates for France which happened to coincide with a terrible heat wave. Our hotel had a temp loss of AC, a castle was closed early and Musee Orsay closed and didn’t open one day. That being said it was still an AMAZING time for my girls and I.',
    date: '06/30/2026',
  },
];

export const STATS_ITEMS: StatItem[] = [
  { value: '10+', label: 'years of experience' },
  { value: '150.000+', label: 'travelers' },
  { value: '10+', label: 'destinations' },
  { value: '300+', label: 'trained experts' },
];

export const DISCOVER_DESTINATIONS: DiscoverDestination[] = [
  { name: 'Italy', slug: 'italy', imageUrl: '/assets/destinations/italy.webp', alt: 'View of Venice in Italy' },
  { name: 'Greece', slug: 'greece', imageUrl: '/assets/destinations/greece.webp', alt: 'Santorini island in Greece' },
  { name: 'Ireland', slug: 'ireland', imageUrl: '/assets/destinations/ireland.webp', alt: 'Coastal tower in Ireland' },
  { name: 'France', slug: 'france', imageUrl: '/assets/destinations/france.webp', alt: 'Vineyards of Saint Emilion in France' },
  { name: 'Spain', slug: 'spain', imageUrl: '/assets/destinations/spain.webp', alt: 'Sailing yacht in Cala de Sa Calobra, Mallorca, Spain' },
  { name: 'England', slug: 'england', imageUrl: '/assets/destinations/england.webp', alt: 'Tower Bridge in London, England' },
  { name: 'Northern Ireland', slug: 'northern-ireland', imageUrl: '/assets/destinations/northern-ireland.webp', alt: "Giant's Causeway in Northern Ireland" },
  { name: 'Scotland', slug: 'scotland', imageUrl: '/assets/destinations/scotland.webp', alt: 'Scottish Highlands landscape' },
  { name: 'Portugal', slug: 'portugal', imageUrl: '/assets/destinations/portugal.webp', alt: 'Colorful houses along the Douro river in Porto, Portugal' },
  { name: 'Austria', slug: 'austria', imageUrl: '/assets/destinations/austria.webp', alt: 'Vienna skyline in Austria' },
  { name: 'Germany', slug: 'germany', imageUrl: '/assets/destinations/germany.webp', alt: 'Hohenzollern Castle in Germany' },
  { name: 'Switzerland', slug: 'switzerland', imageUrl: '/assets/destinations/switzerland.webp', alt: 'Lake and mountain village in Switzerland' },
  { name: 'Wales', slug: 'wales', imageUrl: '/assets/destinations/wales.webp', alt: 'Coastal lighthouse landscape in Wales' },
];

export const FOOTER_ABOUT_LINKS = [
  { label: 'Why Tourlane', action: 'scroll-why' as const },
  { label: 'About us', action: 'modal-about' as const },
  { label: 'Working with us', action: 'modal-careers' as const },
  { label: 'Reporting about us', action: 'modal-press' as const },
  { label: 'Tourlane experiences', action: 'scroll-moments' as const },
  { label: 'App', action: 'modal-app' as const },
  { label: 'Support portal', action: 'modal-support' as const },
];

export const FOOTER_DEST_LINKS = [
  { label: 'Italy', slug: 'italy' },
  { label: 'Greece', slug: 'greece' },
  { label: 'Ireland', slug: 'ireland' },
  { label: 'Spain', slug: 'spain' },
  { label: 'England', slug: 'england' },
  { label: 'Scotland', slug: 'scotland' },
  { label: 'Portugal', slug: 'portugal' },
  { label: 'More destinations', slug: 'all' },
  { label: 'Seasonal travel guide', slug: 'guide' },
];

export const FOOTER_MARKETS = [
  { code: 'USA', name: 'USA', flagSrc: '/assets/logos/flag-us.png' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'UK', name: 'United Kingdom' },
];
