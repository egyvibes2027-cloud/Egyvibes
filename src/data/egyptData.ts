export const EGP_PER_USD = 50;

export function egpToUsd(egp: number): number {
  return Math.round(egp / EGP_PER_USD);
}

export interface EgyptAirport {
  code: string;
  name: string;
  city: string;
  regionSlug: string;
}

export interface EgyptCity {
  slug: string;
  name: string;
  tagline: string;
  imageUrl: string;
  avgHotelEgp: { star3: number; star4: number; star5: number; star7: number };
}

export interface EgyptLandmark {
  id: string;
  rank?: number;
  name: string;
  city: string;
  citySlug: string;
  category: 'top10' | 'archaeological' | 'nature' | 'wellness' | 'cultural';
  adultEgp: number;
  studentEgp: number | null;
  imageUrl: string;
  summary: string;
  practicalTip: string;
}

export interface GovernorateGem {
  priority: number;
  governorate: string;
  highlights: string;
  theme: string;
  category: 'archaeological' | 'nature' | 'wellness' | 'cultural';
}

export interface PartnerHotel {
  id: string;
  name: string;
  citySlug: string;
  cityName: string;
  stars: 3 | 4 | 5 | 7;
  pricePerNightUsd: number;
  pricePerNightEgp: number;
  badge: string;
  imageUrl: string;
}

export interface EgyptianFood {
  id: string;
  name: string;
  arabicName: string;
  partnerVenue: string;
  description: string;
  estimatedUsd: number;
  imageUrl: string;
}

export interface NavMenuItem {
  label: string;
  slug: string;
  imageUrl: string;
}

export interface SearchDestination {
  name: string;
  slug: string;
  imageUrl: string;
  subtitle: string;
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
  photos: TripPhoto[];
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
  subtitle: string;
}

export const SALES_CONFIG = {
  phoneDisplay: '+20 2 2790 1234',
  phoneHref: 'tel:+20227901234',
  whatsappDisplay: '+20 100 000 2026',
  emailDisplay: 'hello@egyvibes.com',
  hoursLabel: 'Daily 8:00 AM – 10:00 PM (Cairo Time, EET)',
};

export const BANK_TRANSFER_PLACEHOLDER = {
  bankName: 'Commercial International Bank (CIB Egypt) — Placeholder',
  accountName: 'EGYVIBES Travel Services LLC',
  iban: 'EG380010018800001000456789012',
  swiftCode: 'CIBEEGCX001',
  currency: 'USD ($)',
  note: 'Provisional placeholder bank details for USD transfers. Confirmed payment instructions are sent after 48-hour booking verification.',
};

export const EGYPT_AIRPORTS: EgyptAirport[] = [
  { code: 'CAI', name: 'Cairo International Airport', city: 'Cairo & Giza', regionSlug: 'cairo-giza' },
  { code: 'SPX', name: 'Sphinx International Airport', city: 'Giza (Pyramids & GEM)', regionSlug: 'cairo-giza' },
  { code: 'LXR', name: 'Luxor International Airport', city: 'Luxor', regionSlug: 'luxor' },
  { code: 'ASW', name: 'Aswan International Airport', city: 'Aswan & Abu Simbel', regionSlug: 'aswan' },
  { code: 'HRG', name: 'Hurghada International Airport', city: 'Hurghada & Marsa Alam', regionSlug: 'hurghada' },
  { code: 'SSH', name: 'Sharm El Sheikh International Airport', city: 'Sharm El Sheikh & Dahab', regionSlug: 'sharm-el-sheikh' },
  { code: 'HBE', name: 'Borg El Arab Airport', city: 'Alexandria & Siwa', regionSlug: 'alexandria' },
];

// Booking.com Nov 24–25 2026 37-hotel benchmark (EGP/night + 7-star ultra-luxury tier)
export const EGYPT_CITIES: EgyptCity[] = [
  {
    slug: 'cairo-giza',
    name: 'Cairo & Giza',
    tagline: 'Pyramids, Grand Egyptian Museum, Citadel & Khan el-Khalili',
    imageUrl: '/assets/egypt/giza-pyramids.jpg',
    avgHotelEgp: { star3: 1074, star4: 1183, star5: 1505, star7: 14500 },
  },
  {
    slug: 'luxor',
    name: 'Luxor',
    tagline: 'Valley of the Kings, Karnak, Luxor Temple & Medinet Habu',
    imageUrl: '/assets/egypt/karnak-temple.jpg',
    avgHotelEgp: { star3: 2354, star4: 4071, star5: 4887, star7: 15000 },
  },
  {
    slug: 'aswan',
    name: 'Aswan',
    tagline: 'Abu Simbel, Philae Island, Nubian Village & Nile Feluccas',
    imageUrl: '/assets/egypt/philae-temple.jpg',
    avgHotelEgp: { star3: 2949, star4: 4339, star5: 7375, star7: 18500 },
  },
  {
    slug: 'sharm-el-sheikh',
    name: 'Sharm El Sheikh & Sinai',
    tagline: 'Ras Mohammed reefs, Dahab Blue Hole & Wadi El-Wishwash',
    imageUrl: '/assets/egypt/sharm-el-sheikh.jpg',
    avgHotelEgp: { star3: 2311, star4: 12093, star5: 12291, star7: 22000 },
  },
  {
    slug: 'hurghada',
    name: 'Hurghada & Red Sea',
    tagline: 'Giftun Islands, Dolphin House, Wadi El Gemal & El Gouna',
    imageUrl: '/assets/egypt/hurghada-red-sea.jpg',
    avgHotelEgp: { star3: 4126, star4: 2095, star5: 6875, star7: 17500 },
  },
  {
    slug: 'alexandria',
    name: 'Alexandria',
    tagline: 'Qaitbay Citadel, Bibliotheca Alexandrina & sunken ruins',
    imageUrl: '/assets/egypt/qaitbay-citadel.jpg',
    avgHotelEgp: { star3: 1428, star4: 3200, star5: 3148, star7: 14000 },
  },
  {
    slug: 'siwa',
    name: 'Siwa Oasis',
    tagline: 'Shali Fortress, crystal salt lakes & Temple of the Oracle',
    imageUrl: '/assets/egypt/siwa-oasis.jpg',
    avgHotelEgp: { star3: 2200, star4: 4100, star5: 8500, star7: 24000 },
  },
  {
    slug: 'fayoum',
    name: 'Fayoum & Wadi El-Hitan',
    tagline: 'Whale Valley UNESCO fossils, Mudawara Mountain & Tunis Village',
    imageUrl: '/assets/egypt/fayoum-wadi-hitan.jpg',
    avgHotelEgp: { star3: 1600, star4: 3100, star5: 5400, star7: 12500 },
  },
  {
    slug: 'white-desert',
    name: 'White Desert & New Valley',
    tagline: 'Chalk rock formations, Crystal Mountain & Farafra hot springs',
    imageUrl: '/assets/egypt/white-desert.jpg',
    avgHotelEgp: { star3: 1800, star4: 3400, star5: 5800, star7: 13000 },
  },
];

// File 1: Top 10 Egyptian Monuments & Official 2026 Ticket Rates
export const TOP_10_LANDMARKS: EgyptLandmark[] = [
  {
    id: 'giza-pyramids',
    rank: 1,
    name: 'Giza Pyramids & Great Sphinx',
    city: 'Giza',
    citySlug: 'cairo-giza',
    category: 'top10',
    adultEgp: 700,
    studentEgp: 350,
    imageUrl: '/assets/egypt/giza-pyramids.jpg',
    summary: 'The last surviving Wonder of the Ancient World on the Giza Plateau.',
    practicalTip: 'Entry inside the Great Pyramid requires a separate ticket. Gates accept Visa/Mastercard only.',
  },
  {
    id: 'grand-egyptian-museum',
    rank: 2,
    name: 'Grand Egyptian Museum (GEM)',
    city: 'Giza',
    citySlug: 'cairo-giza',
    category: 'top10',
    adultEgp: 1830,
    studentEgp: 920,
    imageUrl: '/assets/egypt/grand-egyptian-museum.jpg',
    summary: 'The largest archaeological museum on Earth, housing the full Tutankhamun collection.',
    practicalTip: 'Updated Nov 1, 2026 rates. Online pre-booking required — no on-site ticket sales.',
  },
  {
    id: 'valley-of-kings',
    rank: 3,
    name: 'Valley of the Kings (3 Tombs)',
    city: 'Luxor',
    citySlug: 'luxor',
    category: 'top10',
    adultEgp: 750,
    studentEgp: 375,
    imageUrl: '/assets/egypt/valley-of-kings.jpg',
    summary: 'Royal rock-cut tombs of New Kingdom Pharaohs on Luxor’s West Bank.',
    practicalTip: 'Includes 3 tombs + electric shuttle. Optional add-ons: Tutankhamun (700 EGP) & Seti I (2,000 EGP).',
  },
  {
    id: 'karnak-temple',
    rank: 4,
    name: 'Karnak Temple Complex',
    city: 'Luxor',
    citySlug: 'luxor',
    category: 'top10',
    adultEgp: 600,
    studentEgp: 300,
    imageUrl: '/assets/egypt/karnak-temple.jpg',
    summary: 'The largest religious temple complex in Egypt featuring the Great Hypostyle Hall.',
    practicalTip: 'Latest Ministry of Tourism & Antiquities Aug 2026 schedule. Best visited at sunrise.',
  },
  {
    id: 'luxor-temple',
    rank: 5,
    name: 'Luxor Temple & Avenue of Sphinxes',
    city: 'Luxor',
    citySlug: 'luxor',
    category: 'top10',
    adultEgp: 500,
    studentEgp: 250,
    imageUrl: '/assets/egypt/luxor-temple-night.jpg',
    summary: 'Dramatic sandstone colonnades illuminated after dusk along the Avenue of Sphinxes.',
    practicalTip: 'Evening visits offer cool temperatures and unforgettable golden column lighting.',
  },
  {
    id: 'abu-simbel',
    rank: 6,
    name: 'Abu Simbel Temples',
    city: 'Aswan',
    citySlug: 'aswan',
    category: 'top10',
    adultEgp: 822,
    studentEgp: 445.5,
    imageUrl: '/assets/egypt/abu-simbel.jpg',
    summary: 'Monumental rock-carved twin temples of Ramesses II and Queen Nefertari.',
    practicalTip: 'Open ~6 AM–4 PM. Sun Festival days (Feb 22 & Oct 22) tickets are ~1,272 EGP. Student ID valid up to age 24.',
  },
  {
    id: 'philae-temple',
    rank: 7,
    name: 'Philae Temple (Island of Isis)',
    city: 'Aswan',
    citySlug: 'aswan',
    category: 'top10',
    adultEgp: 550,
    studentEgp: 275,
    imageUrl: '/assets/egypt/philae-temple.jpg',
    summary: 'Scenic Nubian island sanctuary dedicated to Goddess Isis, reached by motorboat.',
    practicalTip: 'Keep small EGP cash for the shared/private island motorboat transfer arranged transparently by EGYVIBES.',
  },
  {
    id: 'citadel-saladin',
    rank: 8,
    name: 'Citadel of Saladin & Mosque of Muhammad Ali',
    city: 'Cairo',
    citySlug: 'cairo-giza',
    category: 'top10',
    adultEgp: 550,
    studentEgp: 275,
    imageUrl: '/assets/egypt/citadel-saladin.jpg',
    summary: '12th-century Islamic fortress overlooking Cairo’s skyline and domes.',
    practicalTip: 'Card payment at gate. Modest attire recommended inside the Alabaster Mosque.',
  },
  {
    id: 'qaitbay-citadel',
    rank: 9,
    name: 'Citadel of Qaitbay',
    city: 'Alexandria',
    citySlug: 'alexandria',
    category: 'top10',
    adultEgp: 100,
    studentEgp: 50,
    imageUrl: '/assets/egypt/qaitbay-citadel.jpg',
    summary: '15th-century coastal fortress built atop the ancient Lighthouse of Alexandria site.',
    practicalTip: 'Updated 100 EGP entry. Unbeatable Mediterranean views right before sunset.',
  },
  {
    id: 'khan-el-khalili',
    rank: 10,
    name: 'Khan el-Khalili & Al-Muizz Street',
    city: 'Cairo',
    citySlug: 'cairo-giza',
    category: 'top10',
    adultEgp: 0,
    studentEgp: 0,
    imageUrl: '/assets/egypt/khan-el-khalili.jpg',
    summary: 'Historic Mamluk-era open-air bazaar, historic coffeehouses, and artisan workshops.',
    practicalTip: 'Free entry. Stays lively past midnight; your EGYVIBES guide helps ensure fair local pricing.',
  },
];

// File 3: Curated Bookable Hidden Gems Across the 4 Atlas Themes
export const HIDDEN_GEMS: EgyptLandmark[] = [
  {
    id: 'medinet-habu',
    name: 'Medinet Habu & Deir el-Medina',
    city: 'Luxor West Bank',
    citySlug: 'luxor',
    category: 'archaeological',
    adultEgp: 220,
    studentEgp: 110,
    imageUrl: '/assets/egypt/medinet-habu.jpg',
    summary: 'Vividly preserved Ramesses III reliefs and the ancient tomb-builders’ village, crowd-free.',
    practicalTip: 'Minutes from the Valley of the Kings with a fraction of the crowds.',
  },
  {
    id: 'dahshur-pyramids',
    name: 'Dahshur (Bent & Red Pyramids)',
    city: 'Giza South',
    citySlug: 'cairo-giza',
    category: 'archaeological',
    adultEgp: 200,
    studentEgp: 100,
    imageUrl: '/assets/egypt/dahshur-pyramids.jpg',
    summary: 'King Sneferu’s monumental early pyramids in tranquil desert silence.',
    practicalTip: 'You can descend deep inside the Red Pyramid without waiting in long queues.',
  },
  {
    id: 'dendera-abydos',
    name: 'Dendera (Hathor) & Abydos (Seti I)',
    city: 'Qena & Sohag',
    citySlug: 'luxor',
    category: 'archaeological',
    adultEgp: 400,
    studentEgp: 200,
    imageUrl: '/assets/egypt/dendera-temple.jpg',
    summary: 'Original astronomical zodiac ceilings and the finest polychrome reliefs in Upper Egypt.',
    practicalTip: 'Ideal private day trip 1–2 hours north of Luxor with lunch included.',
  },
  {
    id: 'abydos-seti',
    name: 'Temple of Seti I at Abydos',
    city: 'Sohag',
    citySlug: 'luxor',
    category: 'archaeological',
    adultEgp: 260,
    studentEgp: 130,
    imageUrl: '/assets/egypt/abydos-temple.jpg',
    summary: 'Home to the famous Abydos King List and Egypt’s most refined New Kingdom stone carving.',
    practicalTip: 'Pairs seamlessly with Dendera Temple on a scenic Nile Valley drive.',
  },
  {
    id: 'wadi-el-hitan',
    name: 'Wadi El-Hitan & Mudawara Mountain',
    city: 'Fayoum',
    citySlug: 'fayoum',
    category: 'nature',
    adultEgp: 450,
    studentEgp: 225,
    imageUrl: '/assets/egypt/fayoum-wadi-hitan.jpg',
    summary: 'UNESCO World Heritage open-air desert valley of 40-million-year-old whale fossils & Magic Lake.',
    practicalTip: 'Less than 2 hours from Cairo by 4x4; best combined with pottery workshops in Tunis Village.',
  },
  {
    id: 'wadi-el-wishwash',
    name: 'Wadi El-Wishwash & Dahab Blue Hole',
    city: 'South Sinai',
    citySlug: 'sharm-el-sheikh',
    category: 'nature',
    adultEgp: 500,
    studentEgp: 250,
    imageUrl: '/assets/egypt/dahab-sinai.jpg',
    summary: 'Hidden rainwater emerald canyon pool tucked inside high red granite Sinai mountains.',
    practicalTip: 'Guided Bedouin 4x4 hike from Dahab or Nuweiba with Red Sea snorkeling stop.',
  },
  {
    id: 'wadi-el-gemal',
    name: 'Wadi El Gemal & Dolphin House Reefs',
    city: 'Marsa Alam / Red Sea',
    citySlug: 'hurghada',
    category: 'nature',
    adultEgp: 550,
    studentEgp: 275,
    imageUrl: '/assets/egypt/marsa-alam-coral.jpg',
    summary: 'Mangrove lagoons, pristine virgin Red Sea coral reefs, and wild spinner dolphins.',
    practicalTip: 'Eco-certified boat charter directly from vetted local captains.',
  },
  {
    id: 'white-desert-reserve',
    name: 'White Desert & Crystal Cave Safari',
    city: 'Farafra / New Valley',
    citySlug: 'white-desert',
    category: 'nature',
    adultEgp: 600,
    studentEgp: 300,
    imageUrl: '/assets/egypt/white-desert.jpg',
    summary: 'Surreal wind-sculpted chalk monoliths under Milky Way skies and desert camp dinner.',
    practicalTip: 'Includes 4x4 Bedouin escort, camp setup, and Black Desert volcanic hills stop.',
  },
  {
    id: 'siwa-salt-lakes',
    name: 'Siwa Salt Lakes & Cleopatra Spring',
    city: 'Siwa Oasis',
    citySlug: 'siwa',
    category: 'wellness',
    adultEgp: 250,
    studentEgp: 125,
    imageUrl: '/assets/egypt/siwa-salt-lakes.jpg',
    summary: 'Crystal hypersaline pools where you float effortlessly, paired with Dakrur desert wellness.',
    practicalTip: 'Higher salinity than the Dead Sea; rinse in Cleopatra’s natural warm spring right after.',
  },
  {
    id: 'siwa-shali',
    name: 'Shali Fortress & Oracle of Amun',
    city: 'Siwa Oasis',
    citySlug: 'siwa',
    category: 'cultural',
    adultEgp: 200,
    studentEgp: 100,
    imageUrl: '/assets/egypt/siwa-oasis.jpg',
    summary: '13th-century salt-mud kershef citadel and the temple where Alexander the Great was crowned.',
    practicalTip: 'Climb Shali Fortress at golden hour overlooking 300,000 oasis palm trees.',
  },
  {
    id: 'tunis-village',
    name: 'Tunis Village Pottery & Lake Qarun',
    city: 'Fayoum',
    citySlug: 'fayoum',
    category: 'cultural',
    adultEgp: 150,
    studentEgp: 75,
    imageUrl: '/assets/egypt/tunis-village.jpg',
    summary: 'International eco-art village overlooking Lake Qarun known for hand-thrown ceramics.',
    practicalTip: 'Try a private pottery wheel workshop and farm-to-table rural lunch.',
  },
  {
    id: 'nubian-village',
    name: 'Nubian Village (Gharb Soheil & Heisa)',
    city: 'Aswan',
    citySlug: 'aswan',
    category: 'cultural',
    adultEgp: 300,
    studentEgp: 150,
    imageUrl: '/assets/egypt/nubian-village.jpg',
    summary: 'Vibrant hand-painted Nubian homes, Nile riverside music, henna art, and warm hospitality.',
    practicalTip: 'Reached by traditional Nile felucca or boat directly from Aswan Corniche.',
  },
];

// File 3: Complete 27 Egyptian Governorates Hidden Gems Directory
export const ALL_27_GOVERNORATES: GovernorateGem[] = [
  { priority: 1, governorate: 'Fayoum', highlights: 'Wadi El-Hitan, Mudawara Mountain, Tunis Village, Medinet Madi ruins', theme: 'Nature / Geology / Heritage', category: 'nature' },
  { priority: 2, governorate: 'Matrouh', highlights: 'Siwa Oasis (Shali Fortress, Salt Lakes), El-Omayed Reserve, Ageeba & Gharam off-season', theme: 'Wellness / Eco / Cultural', category: 'wellness' },
  { priority: 3, governorate: 'New Valley', highlights: 'White Desert, Djara Cave, Hibis Temple, Al-Qasr Islamic Village (Dakhla)', theme: 'Safari / Heritage / Wellness', category: 'nature' },
  { priority: 4, governorate: 'South Sinai', highlights: 'Wadi El-Wishwash, Colored Canyon (Nuweiba), Fjord Bay (Taba), Abu Galum Reserve', theme: 'Adventure / Diving / Nature', category: 'nature' },
  { priority: 5, governorate: 'Red Sea', highlights: 'Wadi El Gemal Reserve, Old El-Quseir, Dolphin House (Samadai), Gebel Elba', theme: 'Eco / Wellness / Cultural', category: 'nature' },
  { priority: 6, governorate: 'Luxor', highlights: 'Medinet Habu Temple, Tombs of the Nobles, Deir el-Medina, Esna Temple', theme: 'Archaeological', category: 'archaeological' },
  { priority: 7, governorate: 'Aswan', highlights: 'Heisa Island, Gebel Sheesha, Kalabsha Temple, Wadi El-Sebua (Lake Nasser)', theme: 'Cultural / Archaeological / Wellness', category: 'cultural' },
  { priority: 8, governorate: 'Cairo', highlights: 'Prince Taz Palace, Bayt Al-Suhaymi, Manasterly Palace & Nilometer, Wadi Degla Reserve', theme: 'Islamic Heritage / Nature', category: 'cultural' },
  { priority: 9, governorate: 'Giza', highlights: 'Dahshur Pyramids, Abusir Pyramids, Bahariya Oasis (Black Desert & English Mountain)', theme: 'Archaeological / Safari', category: 'archaeological' },
  { priority: 10, governorate: 'Alexandria', highlights: 'Eastern Harbor Sunken Ruins, Kom El Shoqafa Catacombs, Koussa Pasha Fort (Abu Qir)', theme: 'Sunken Archaeology / Ptolemaic', category: 'archaeological' },
  { priority: 11, governorate: 'Minya', highlights: 'Beni Hasan Tombs, Tell el-Amarna, Monastery of Gabal el-Tayr, Tuna el-Gebel', theme: 'Archaeological / Religious', category: 'archaeological' },
  { priority: 12, governorate: 'Qena', highlights: 'Dendera Temple (Temple of Hathor), Prince Youssef Kamal Palace (Nag Hammadi)', theme: 'Archaeological / Architectural', category: 'archaeological' },
  { priority: 13, governorate: 'Sohag', highlights: 'Abydos Temple (Seti I), White Monastery & Red Monastery, Akhmim Heritage Site', theme: 'Archaeological / Religious', category: 'archaeological' },
  { priority: 14, governorate: 'Assiut', highlights: 'Al-Muharraq Monastery (El-Qusiya), Deir Dronka, Alexan Pasha Palace, Wadi El-Assiuti Reserve', theme: 'Religious / Architectural / Nature', category: 'cultural' },
  { priority: 15, governorate: 'Beni Suef', highlights: 'Wadi Sannur Cave Reserve, Meidum Pyramid (first attempt at a true pyramid)', theme: 'Geology / Archaeological', category: 'nature' },
  { priority: 16, governorate: 'Sharqia', highlights: 'Tell Basta (Bastet), Tanis / San El-Hagar (Third Intermediate capital)', theme: 'Pharaonic Archaeology', category: 'archaeological' },
  { priority: 17, governorate: 'Kafr El-Sheikh', highlights: 'Tell El-Fara’in (Buto — capital of Lower Egypt), Lake Burullus Reserve', theme: 'Archaeological / Eco', category: 'archaeological' },
  { priority: 18, governorate: 'Beheira', highlights: '4 Monasteries of Wadi El-Natrun, Rosetta / Rashid Historic Houses & Qaitbay Fort', theme: 'Religious / Islamic Heritage', category: 'cultural' },
  { priority: 19, governorate: 'Damietta', highlights: 'Ras El-Bar El-Lesan (Nile meets Sea), Old Damietta & Amr Ibn El-As Mosque', theme: 'Nature / Heritage', category: 'nature' },
  { priority: 20, governorate: 'Port Said', highlights: 'Ashtoum El-Gamil Reserve & Tennis Island, Historic Suez Canal HQ, Port Fouad Salt Mountains', theme: 'Eco / Historical', category: 'cultural' },
  { priority: 21, governorate: 'Ismailia', highlights: 'Lake Timsah & Fursan Island, Ismailia Antiquities Museum, El-Shagara Hill', theme: 'Nature / Military History', category: 'cultural' },
  { priority: 22, governorate: 'Suez', highlights: 'Springs of Moses (Ayun Musa), Adabiya Reserve, Old Ain Sokhna', theme: 'Religious / Eco', category: 'wellness' },
  { priority: 23, governorate: 'North Sinai', highlights: 'Zaranik Reserve & Lake Bardawil (global bird migration route), El-Arish Citadel', theme: 'Eco / Birdwatching', category: 'nature' },
  { priority: 24, governorate: 'Gharbia', highlights: 'Behbeit El-Hagara Temple (Isis of the Delta, Samannud), El-Sayed El-Badawi Mosque (Tanta)', theme: 'Archaeological / Religious', category: 'archaeological' },
  { priority: 25, governorate: 'Dakahlia', highlights: 'Tell El-Rub’a (Ancient Mendes), Dar Ibn Luqman (Mansoura)', theme: 'Archaeological / Historical', category: 'archaeological' },
  { priority: 26, governorate: 'Monufia', highlights: 'Denshway Historical Museum, Shamma Heritage Village, Mohamed Ali Barrages (Bagour)', theme: 'Historical', category: 'cultural' },
  { priority: 27, governorate: 'Qalyubia', highlights: 'El-Qanater El-Khairiya & Historic Gardens, Tell El-Yahudiya (Shibin El-Qanater)', theme: 'Historical / Leisure', category: 'cultural' },
];

// Vetted Partner Hotels across 3★, 4★, 5★, and 7★ tiers anchored to Booking.com Nov 2026 rates
export const PARTNER_HOTELS: PartnerHotel[] = [
  // Cairo & Giza (avg 3★ 1,074 | 4★ 1,183 | 5★ 1,505 EGP)
  { id: 'cai-3', name: 'Pyramids Horizon Inn (Partner)', citySlug: 'cairo-giza', cityName: 'Cairo & Giza', stars: 3, pricePerNightEgp: 1100, pricePerNightUsd: 22, badge: 'Direct Pyramid View · Verified Local Rate', imageUrl: '/assets/egypt/giza-pyramids.jpg' },
  { id: 'cai-4', name: 'Zamalek Nile Boutique Hotel (Partner)', citySlug: 'cairo-giza', cityName: 'Cairo & Giza', stars: 4, pricePerNightEgp: 1250, pricePerNightUsd: 25, badge: 'Heart of Zamalek · Partner Contracted', imageUrl: '/assets/egypt/cairo-nile.jpg' },
  { id: 'cai-5', name: 'Marriott Mena House / Nile Kempinski (Partner)', citySlug: 'cairo-giza', cityName: 'Cairo & Giza', stars: 5, pricePerNightEgp: 4250, pricePerNightUsd: 85, badge: 'Iconic Heritage Stay · Partner Rate', imageUrl: '/assets/egypt/egypt-luxury-hotel.jpg' },
  { id: 'cai-7', name: 'The St. Regis Cairo Royal Nile Suite', citySlug: 'cairo-giza', cityName: 'Cairo & Giza', stars: 7, pricePerNightEgp: 14500, pricePerNightUsd: 290, badge: '7★ Ultra-Luxury · Private Butler', imageUrl: '/assets/egypt/egypt-luxury-hotel.jpg' },

  // Luxor (avg 3★ 2,354 | 4★ 4,071 | 5★ 4,887 EGP)
  { id: 'lxr-3', name: 'Nile Lotus West Bank Hotel (Partner)', citySlug: 'luxor', cityName: 'Luxor', stars: 3, pricePerNightEgp: 2350, pricePerNightUsd: 47, badge: 'West Bank Quiet Stay · Verified', imageUrl: '/assets/egypt/luxor-balloons.jpg' },
  { id: 'lxr-4', name: 'Jolie Ville Kings Island Resort (Partner)', citySlug: 'luxor', cityName: 'Luxor', stars: 4, pricePerNightEgp: 4070, pricePerNightUsd: 81, badge: 'Private Nile Gardens · Partner Rate', imageUrl: '/assets/egypt/karnak-temple.jpg' },
  { id: 'lxr-5', name: 'Sofitel Winter Palace Luxor (Partner)', citySlug: 'luxor', cityName: 'Luxor', stars: 5, pricePerNightEgp: 4900, pricePerNightUsd: 98, badge: 'Royal 1886 Palace · Partner Contracted', imageUrl: '/assets/egypt/luxor-temple-night.jpg' },
  { id: 'lxr-7', name: 'Private Luxury Dahabiya Presidential Charter', citySlug: 'luxor', cityName: 'Luxor', stars: 7, pricePerNightEgp: 15000, pricePerNightUsd: 300, badge: '7★ Ultra-Luxury · Private Nile Sail', imageUrl: '/assets/egypt/egypt-nile-cruise.jpg' },

  // Aswan (avg 3★ 2,949 | 4★ 4,339 | 5★ 7,375 EGP)
  { id: 'asw-3', name: 'Kato Dool Nubian House (Partner)', citySlug: 'aswan', cityName: 'Aswan', stars: 3, pricePerNightEgp: 2950, pricePerNightUsd: 59, badge: 'Authentic Nubian Hospitality', imageUrl: '/assets/egypt/nubian-village.jpg' },
  { id: 'asw-4', name: 'Isis Corniche Nile Resort (Partner)', citySlug: 'aswan', cityName: 'Aswan', stars: 4, pricePerNightEgp: 4340, pricePerNightUsd: 87, badge: 'Riverfront Comfort · Partner Rate', imageUrl: '/assets/egypt/aswan-felucca.jpg' },
  { id: 'asw-5', name: 'Mövenpick Elephantine Island (Partner)', citySlug: 'aswan', cityName: 'Aswan', stars: 5, pricePerNightEgp: 7375, pricePerNightUsd: 148, badge: 'Private Island Panoramic Views', imageUrl: '/assets/egypt/philae-temple.jpg' },
  { id: 'asw-7', name: 'Sofitel Legend Old Cataract Palace', citySlug: 'aswan', cityName: 'Aswan', stars: 7, pricePerNightEgp: 18500, pricePerNightUsd: 370, badge: '7★ Ultra-Luxury · Agatha Christie Wing', imageUrl: '/assets/egypt/egypt-luxury-hotel.jpg' },

  // Sharm El Sheikh & Sinai (avg 3★ 2,311 | 4★ 12,093 | 5★ 12,291 EGP)
  { id: 'ssh-3', name: 'Dahab Lagoon Eco Stay (Partner)', citySlug: 'sharm-el-sheikh', cityName: 'Sharm & Sinai', stars: 3, pricePerNightEgp: 2310, pricePerNightUsd: 46, badge: 'Reef-Side Stay · Verified Local Rate', imageUrl: '/assets/egypt/dahab-sinai.jpg' },
  { id: 'ssh-4', name: 'Naama Bay Promenade Resort (Partner)', citySlug: 'sharm-el-sheikh', cityName: 'Sharm & Sinai', stars: 4, pricePerNightEgp: 12090, pricePerNightUsd: 242, badge: 'All-Inclusive Coral Coast', imageUrl: '/assets/egypt/sharm-el-sheikh.jpg' },
  { id: 'ssh-5', name: 'Rixos Premium Seagate / Savoy (Partner)', citySlug: 'sharm-el-sheikh', cityName: 'Sharm & Sinai', stars: 5, pricePerNightEgp: 12290, pricePerNightUsd: 246, badge: '5★ Red Sea Luxury · Partner Rate', imageUrl: '/assets/egypt/sharm-el-sheikh.jpg' },
  { id: 'ssh-7', name: 'Four Seasons Resort Sharm El Sheikh', citySlug: 'sharm-el-sheikh', cityName: 'Sharm & Sinai', stars: 7, pricePerNightEgp: 22000, pricePerNightUsd: 440, badge: '7★ Ultra-Luxury · Cliffside Villa', imageUrl: '/assets/egypt/egypt-luxury-hotel.jpg' },

  // Hurghada & Red Sea (avg 3★ 4,126 | 4★ 2,095 | 5★ 6,875 EGP)
  { id: 'hrg-3', name: 'Red Sea Marina Boutique Stay (Partner)', citySlug: 'hurghada', cityName: 'Hurghada & Red Sea', stars: 3, pricePerNightEgp: 2100, pricePerNightUsd: 42, badge: 'Steps from Marina & Boats', imageUrl: '/assets/egypt/hurghada-red-sea.jpg' },
  { id: 'hrg-4', name: 'El Gouna Cook’s Club & Lagoon (Partner)', citySlug: 'hurghada', cityName: 'Hurghada & Red Sea', stars: 4, pricePerNightEgp: 2950, pricePerNightUsd: 59, badge: 'Best-Value 4★ Partner Rate', imageUrl: '/assets/egypt/marsa-alam-coral.jpg' },
  { id: 'hrg-5', name: 'Steigenberger Aldau Beach Hotel (Partner)', citySlug: 'hurghada', cityName: 'Hurghada & Red Sea', stars: 5, pricePerNightEgp: 6875, pricePerNightUsd: 138, badge: 'Private Beach & Championship Golf', imageUrl: '/assets/egypt/hurghada-red-sea.jpg' },
  { id: 'hrg-7', name: 'Oberoi Beach Resort Sahl Hasheesh', citySlug: 'hurghada', cityName: 'Hurghada & Red Sea', stars: 7, pricePerNightEgp: 17500, pricePerNightUsd: 350, badge: '7★ Ultra-Luxury · Private Pool Suite', imageUrl: '/assets/egypt/egypt-luxury-hotel.jpg' },

  // Alexandria (avg 3★ 1,428 | 4★ 3,200 | 5★ 3,148 EGP)
  { id: 'alx-3', name: 'Steigenberger Cecil Historic Wing (Partner)', citySlug: 'alexandria', cityName: 'Alexandria', stars: 3, pricePerNightEgp: 1430, pricePerNightUsd: 29, badge: 'Corniche Heritage Landmark', imageUrl: '/assets/egypt/alexandria-corniche.jpg' },
  { id: 'alx-4', name: 'Hilton Alexandria Corniche (Partner)', citySlug: 'alexandria', cityName: 'Alexandria', stars: 4, pricePerNightEgp: 3200, pricePerNightUsd: 64, badge: 'Mediterranean Rooftop Pool', imageUrl: '/assets/egypt/qaitbay-citadel.jpg' },
  { id: 'alx-5', name: 'Helnan Palestine Montaza Palace (Partner)', citySlug: 'alexandria', cityName: 'Alexandria', stars: 5, pricePerNightEgp: 3500, pricePerNightUsd: 70, badge: 'Royal Gardens Seafront', imageUrl: '/assets/egypt/alexandria-corniche.jpg' },
  { id: 'alx-7', name: 'Four Seasons Hotel San Stefano', citySlug: 'alexandria', cityName: 'Alexandria', stars: 7, pricePerNightEgp: 14000, pricePerNightUsd: 280, badge: '7★ Ultra-Luxury · Sea View Suite', imageUrl: '/assets/egypt/egypt-luxury-hotel.jpg' },

  // Siwa / Fayoum / White Desert Partners
  { id: 'siw-4', name: 'Talist Siwa Eco-Lodge (Partner)', citySlug: 'siwa', cityName: 'Siwa Oasis', stars: 4, pricePerNightEgp: 4100, pricePerNightUsd: 82, badge: 'Thermal Pool & Palm Groves', imageUrl: '/assets/egypt/siwa-oasis.jpg' },
  { id: 'siw-7', name: 'Adrère Amellal Desert Ecolodge', citySlug: 'siwa', cityName: 'Siwa Oasis', stars: 7, pricePerNightEgp: 24000, pricePerNightUsd: 480, badge: '7★ Ultra-Luxury · Candlelit Salt Lodge', imageUrl: '/assets/egypt/siwa-salt-lakes.jpg' },
  { id: 'fay-4', name: 'Lazib Inn Tunis Village (Partner)', citySlug: 'fayoum', cityName: 'Fayoum', stars: 4, pricePerNightEgp: 3100, pricePerNightUsd: 62, badge: 'Boutique Arts & Pottery Retreat', imageUrl: '/assets/egypt/tunis-village.jpg' },
  { id: 'wds-4', name: 'Luxury Starlight Bedouin Eco Camp (Partner)', citySlug: 'white-desert', cityName: 'White Desert', stars: 4, pricePerNightEgp: 3400, pricePerNightUsd: 68, badge: 'Private Camp & 4x4 Expedition', imageUrl: '/assets/egypt/white-desert.jpg' },
];

export const EGYPTIAN_FOODS: EgyptianFood[] = [
  {
    id: 'koshary',
    name: 'Authentic Egyptian Koshary',
    arabicName: 'كشري مصري',
    partnerVenue: 'Abou Tarek / Koshary El Tahrir (Vetted Partner)',
    description: 'Egypt’s iconic comforting bowl of lentils, pasta, rice, crispy onions, and spiced tomato sauce.',
    estimatedUsd: 6,
    imageUrl: '/assets/egypt/egypt-koshary.jpg',
  },
  {
    id: 'molokhia-pigeon',
    name: 'Molokhia & Stuffed Pigeon (Hamam Mahshi)',
    arabicName: 'ملوخية وحمام محشي',
    partnerVenue: 'Sobhy Kaber / Andrea Mariouteya (Vetted Partner)',
    description: 'Fragrant garlic-coriander Molokhia paired with golden roasted pigeon stuffed with spiced freekeh.',
    estimatedUsd: 22,
    imageUrl: '/assets/egypt/egypt-grills.jpg',
  },
  {
    id: 'baladi-breakfast',
    name: 'Egyptian Baladi Breakfast (Ful, Taameya & Feteer)',
    arabicName: 'فول وطعمية وفطير مشلتت',
    partnerVenue: 'Zooba / Eish + Malh / Tunis Village Farm',
    description: 'Crispy fava-bean taameya, slow-simmered ful, flaky layered Feteer Meshaltet with black honey & clotted cream.',
    estimatedUsd: 10,
    imageUrl: '/assets/egypt/tunis-village.jpg',
  },
  {
    id: 'charcoal-grills',
    name: 'Charcoal Kebabs, Kofta & Hawawshi',
    arabicName: 'كباب وكفتة وحواوشي',
    partnerVenue: 'El Prince Imbaba / Kebdet El Prince (Vetted Partner)',
    description: 'Smoky charcoal-grilled spiced lamb kofta, tender shish kebab, and crisp spiced meat hawawshi.',
    estimatedUsd: 18,
    imageUrl: '/assets/egypt/egypt-grills.jpg',
  },
  {
    id: 'nubian-feast',
    name: 'Traditional Nubian Nile Dinner',
    arabicName: 'أكل نوبي أصيل',
    partnerVenue: 'Solaih Nubian House, Gharb Soheil (Aswan)',
    description: 'Slow-cooked clay-pot tagines, freshly baked sun-bread, grilled Nile perch, and cold hibiscus.',
    estimatedUsd: 16,
    imageUrl: '/assets/egypt/nubian-village.jpg',
  },
  {
    id: 'red-sea-seafood',
    name: 'Red Sea & Alexandria Fresh Seafood',
    arabicName: 'سي فود البحر الأحمر وإسكندرية',
    partnerVenue: 'Fish Market Alexandria / El Halaka Hurghada',
    description: 'Day-caught Red Sea grouper, jumbo shrimp, calamari, and smoky sayadeya rice by the water.',
    estimatedUsd: 24,
    imageUrl: '/assets/egypt/alexandria-corniche.jpg',
  },
  {
    id: 'tea-sweets',
    name: 'Khan el-Khalili Mint Tea, Om Ali & Kunafa',
    arabicName: 'شاي بالنعناع وأم علي وكنافة',
    partnerVenue: 'El Fishawy Historic Café (Cairo)',
    description: 'Fresh mint tea, spiced karkadeh, and warm bubbling Om Ali bread pudding inside historic Cairo.',
    estimatedUsd: 8,
    imageUrl: '/assets/egypt/egypt-tea-cafe.jpg',
  },
];

export const NAV_DESTINATIONS: NavMenuItem[] = [
  { label: 'Cairo & Giza', slug: 'cairo-giza', imageUrl: '/assets/egypt/giza-pyramids.jpg' },
  { label: 'Luxor', slug: 'luxor', imageUrl: '/assets/egypt/karnak-temple.jpg' },
  { label: 'Aswan', slug: 'aswan', imageUrl: '/assets/egypt/philae-temple.jpg' },
  { label: 'Abu Simbel', slug: 'aswan', imageUrl: '/assets/egypt/abu-simbel.jpg' },
  { label: 'Sharm El Sheikh', slug: 'sharm-el-sheikh', imageUrl: '/assets/egypt/sharm-el-sheikh.jpg' },
  { label: 'Hurghada & Red Sea', slug: 'hurghada', imageUrl: '/assets/egypt/hurghada-red-sea.jpg' },
  { label: 'Alexandria', slug: 'alexandria', imageUrl: '/assets/egypt/qaitbay-citadel.jpg' },
  { label: 'Siwa Oasis', slug: 'siwa', imageUrl: '/assets/egypt/siwa-oasis.jpg' },
  { label: 'Fayoum Oasis', slug: 'fayoum', imageUrl: '/assets/egypt/fayoum-wadi-hitan.jpg' },
  { label: 'White Desert', slug: 'white-desert', imageUrl: '/assets/egypt/white-desert.jpg' },
];

export const NAV_TRAVEL_STYLES: NavMenuItem[] = [
  { label: 'Private Tour', slug: 'private-tour', imageUrl: '/assets/egypt/giza-pyramids.jpg' },
  { label: 'Curated Small Group', slug: 'group-tour', imageUrl: '/assets/egypt/karnak-temple.jpg' },
  { label: 'Nile Cruise & Dahabiya', slug: 'nile-cruise', imageUrl: '/assets/egypt/egypt-nile-cruise.jpg' },
  { label: 'Hidden Gems & Oases', slug: 'hidden-gems', imageUrl: '/assets/egypt/white-desert.jpg' },
  { label: 'Red Sea & Diving', slug: 'red-sea', imageUrl: '/assets/egypt/marsa-alam-coral.jpg' },
  { label: 'Culinary & Heritage', slug: 'culinary', imageUrl: '/assets/egypt/egypt-koshary.jpg' },
  { label: 'Wellness & Salt Lakes', slug: 'wellness', imageUrl: '/assets/egypt/siwa-salt-lakes.jpg' },
  { label: '7-Star Ultra-Luxury', slug: 'luxury', imageUrl: '/assets/egypt/egypt-luxury-hotel.jpg' },
];

export const SEARCH_DESTINATIONS: SearchDestination[] = [
  { name: 'Cairo & Giza', slug: 'cairo-giza', subtitle: 'Pyramids, GEM & Citadel', imageUrl: '/assets/egypt/giza-pyramids.jpg', isTop: true },
  { name: 'Luxor', slug: 'luxor', subtitle: 'Valley of the Kings & Karnak', imageUrl: '/assets/egypt/karnak-temple.jpg', isTop: true },
  { name: 'Aswan', slug: 'aswan', subtitle: 'Abu Simbel, Philae & Nubia', imageUrl: '/assets/egypt/philae-temple.jpg', isTop: true },
  { name: 'Sharm El Sheikh & Sinai', slug: 'sharm-el-sheikh', subtitle: 'Ras Mohammed & Dahab', imageUrl: '/assets/egypt/sharm-el-sheikh.jpg', isTop: true },
  { name: 'Hurghada & Red Sea', slug: 'hurghada', subtitle: 'Giftun Islands & Marsa Alam', imageUrl: '/assets/egypt/hurghada-red-sea.jpg', isTop: true },
  { name: 'Alexandria', slug: 'alexandria', subtitle: 'Qaitbay Citadel & Corniche', imageUrl: '/assets/egypt/qaitbay-citadel.jpg', isTop: true },
  { name: 'Siwa Oasis', slug: 'siwa', subtitle: 'Shali Fortress & Salt Lakes', imageUrl: '/assets/egypt/siwa-oasis.jpg' },
  { name: 'Fayoum & Wadi El-Hitan', slug: 'fayoum', subtitle: 'Whale Valley & Tunis Village', imageUrl: '/assets/egypt/fayoum-wadi-hitan.jpg' },
  { name: 'White Desert & New Valley', slug: 'white-desert', subtitle: 'Farafra Chalk Safari', imageUrl: '/assets/egypt/white-desert.jpg' },
  { name: 'Abu Simbel', slug: 'aswan', subtitle: 'Sun Temple of Ramesses II', imageUrl: '/assets/egypt/abu-simbel.jpg' },
  { name: 'Dahab & Wadi El-Wishwash', slug: 'sharm-el-sheikh', subtitle: 'Sinai Canyon & Blue Hole', imageUrl: '/assets/egypt/dahab-sinai.jpg' },
  { name: 'Dendera & Abydos', slug: 'luxor', subtitle: 'Upper Egypt Painted Temples', imageUrl: '/assets/egypt/dendera-temple.jpg' },
];

export const USP_ITEMS: UspItem[] = [
  {
    title: 'Honest local prices',
    description: 'Official 2026 ticket rates and partnered local hotel pricing in USD with zero tourist markups',
    iconSrc: '/assets/usp/free-planning.svg',
  },
  {
    title: 'Multi-city & hidden gems',
    description: 'Combine icons like Giza & Luxor with Egypt’s 27 governorates of oases, reefs, and canyons',
    iconSrc: '/assets/usp/personalized-trip.svg',
  },
  {
    title: 'Licensed guides & vetted stays',
    description: 'Choose solo private travel or a small group with contracted 3★–7★ hotels and partner dining',
    iconSrc: '/assets/usp/expert-advice.svg',
  },
  {
    title: 'Airport-to-airport care',
    description: 'Full pickup, private transfers, 48h pre-trip verification, and 25% arrival / 75% departure USD pay',
    iconSrc: '/assets/usp/comfort-support.svg',
  },
];

export const MOMENTS_AVATARS = [
  '/assets/moments/avatar-1.webp',
  '/assets/moments/avatar-2.webp',
  '/assets/moments/avatar-3.webp',
  '/assets/moments/avatar-4.webp',
];

export const EGYPT_MOMENTS: MomentItem[] = [
  { headline: 'Sunrise at the Giza Plateau', subheadline: 'Cairo & Giza', imageUrl: '/assets/egypt/giza-pyramids.jpg' },
  { headline: 'Inside the Grand Egyptian Museum', subheadline: 'Giza', imageUrl: '/assets/egypt/grand-egyptian-museum.jpg' },
  { headline: 'Hot air balloons over Luxor', subheadline: 'West Bank, Luxor', imageUrl: '/assets/egypt/luxor-balloons.jpg' },
  { headline: 'Sailing by felucca in Aswan', subheadline: 'Nile River, Aswan', imageUrl: '/assets/egypt/aswan-felucca.jpg' },
  { headline: 'Evening lights at Luxor Temple', subheadline: 'Avenue of Sphinxes', imageUrl: '/assets/egypt/luxor-temple-night.jpg' },
  { headline: 'Abu Simbel twin rock temples', subheadline: 'Lake Nasser, Aswan', imageUrl: '/assets/egypt/abu-simbel.jpg' },
  { headline: 'Floating in Siwa’s salt lakes', subheadline: 'Siwa Oasis, Matrouh', imageUrl: '/assets/egypt/siwa-salt-lakes.jpg' },
  { headline: 'Under the stars in the White Desert', subheadline: 'Farafra, New Valley', imageUrl: '/assets/egypt/white-desert.jpg' },
  { headline: 'Diving pristine Red Sea reefs', subheadline: 'Marsa Alam & Hurghada', imageUrl: '/assets/egypt/marsa-alam-coral.jpg' },
  { headline: 'Dinner in the Nubian Village', subheadline: 'Gharb Soheil, Aswan', imageUrl: '/assets/egypt/nubian-village.jpg' },
];

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    number: 1,
    title: 'Design your Egypt trip',
    description:
      'Pick your arrival airport, combine cities and hidden gems, star your must-see sites, select authentic Egyptian meals, and choose your 3★–7★ hotel tier.',
  },
  {
    number: 2,
    title: '48-hour check & matching',
    description:
      'Within 2 days, our local operations team confirms partner hotel & restaurant availability, matches you into a curated group if requested, and locks your transparent USD quote.',
  },
  {
    number: 3,
    title: 'Arrive, pay 25% & enjoy',
    description:
      'We meet you at the airport gate and handle every ride, ticket, and meal. Pay just 25% in USD upon arrival in Egypt and the remaining 75% upon departure.',
  },
];

export const EXAMPLE_TRIPS: ExampleTrip[] = [
  {
    tabTitle: 'Cairo & Giza',
    slug: 'cairo-giza',
    title: 'Pyramids, Grand Museum & Historic Cairo',
    duration: '4 nights',
    numberOfStops: '6 landmarks',
    transportMode: 'Private car & guide',
    accommodationTag: '5★ Pyramids View',
    activityTag: 'Giza & GEM',
    transportTag: 'CAI / SPX Pickup',
    foodTag: 'Koshary & Grills',
    flightTag: '25% Arrival / 75% Exit',
    customerLabel: 'Curated by EGYVIBES for',
    customerName: 'Daniel & Claire (UK)',
    customerImageUrl: '/assets/moments/avatar-1.webp',
    ctaCopy: 'Plan your Cairo & Giza trip for free',
    photos: [
      { url: '/assets/egypt/giza-pyramids.jpg', tag: 'Giza Pyramids' },
      { url: '/assets/egypt/grand-egyptian-museum.jpg', tag: 'Grand Museum' },
      { url: '/assets/egypt/citadel-saladin.jpg', tag: 'Saladin Citadel' },
      { url: '/assets/egypt/khan-el-khalili.jpg', tag: 'Khan el-Khalili' },
      { url: '/assets/egypt/cairo-nile.jpg' },
    ],
  },
  {
    tabTitle: 'Luxor & Aswan',
    slug: 'luxor',
    title: 'Royal Tombs, Temples & Nile Heritage',
    duration: '6 nights',
    numberOfStops: '8 temples',
    transportMode: 'Private guide + Dahabiya',
    accommodationTag: '5★ Palace & Cruise',
    activityTag: 'Valley of the Kings',
    transportTag: 'LXR → ASW Route',
    foodTag: 'Nubian & Molokhia',
    flightTag: 'Official 2026 Tickets',
    customerLabel: 'Curated by EGYVIBES for',
    customerName: 'Hannah & Lucas (Germany)',
    customerImageUrl: '/assets/moments/avatar-2.webp',
    ctaCopy: 'Plan your Luxor & Aswan trip for free',
    photos: [
      { url: '/assets/egypt/karnak-temple.jpg', tag: 'Karnak Temple' },
      { url: '/assets/egypt/valley-of-kings.jpg', tag: 'Valley of Kings' },
      { url: '/assets/egypt/philae-temple.jpg', tag: 'Philae Island' },
      { url: '/assets/egypt/abu-simbel.jpg', tag: 'Abu Simbel' },
      { url: '/assets/egypt/aswan-felucca.jpg' },
    ],
  },
  {
    tabTitle: 'Sharm & Sinai',
    slug: 'sharm-el-sheikh',
    title: 'Red Sea Reefs, Dahab & Sinai Canyons',
    duration: '5 nights',
    numberOfStops: '4 bays & wadis',
    transportMode: '4x4 & Reef Charter',
    accommodationTag: '4★–7★ Coral Resort',
    activityTag: 'Blue Hole & Ras Mohammed',
    transportTag: 'SSH Airport Care',
    foodTag: 'Red Sea Seafood',
    flightTag: 'Group or Private',
    customerLabel: 'Curated by EGYVIBES for',
    customerName: 'Sofia & Matteo (Italy)',
    customerImageUrl: '/assets/moments/avatar-3.webp',
    ctaCopy: 'Plan your Sharm & Sinai trip for free',
    photos: [
      { url: '/assets/egypt/sharm-el-sheikh.jpg', tag: 'Sharm Coast' },
      { url: '/assets/egypt/dahab-sinai.jpg', tag: 'Dahab Blue Hole' },
      { url: '/assets/egypt/marsa-alam-coral.jpg', tag: 'Coral Reefs' },
      { url: '/assets/egypt/egypt-desert-safari.jpg', tag: 'Sinai Canyons' },
      { url: '/assets/egypt/hurghada-red-sea.jpg' },
    ],
  },
  {
    tabTitle: 'Hurghada & Red Sea',
    slug: 'hurghada',
    title: 'Giftun Islands, El Gouna & Dolphin Reefs',
    duration: '5 nights',
    numberOfStops: '4 islands',
    transportMode: 'Private Boat & Driver',
    accommodationTag: '5★ Beachfront',
    activityTag: 'Wadi El Gemal',
    transportTag: 'HRG Airport Pickup',
    foodTag: 'Fresh Grill & Fish',
    flightTag: 'No Hidden Fees',
    customerLabel: 'Curated by EGYVIBES for',
    customerName: 'Emma & Noah (USA)',
    customerImageUrl: '/assets/moments/avatar-4.webp',
    ctaCopy: 'Plan your Hurghada & Red Sea trip for free',
    photos: [
      { url: '/assets/egypt/hurghada-red-sea.jpg', tag: 'Giftun Island' },
      { url: '/assets/egypt/marsa-alam-coral.jpg', tag: 'Dolphin House' },
      { url: '/assets/egypt/egypt-luxury-hotel.jpg', tag: 'Red Sea Resort' },
      { url: '/assets/egypt/egypt-grills.jpg', tag: 'Partner Dining' },
      { url: '/assets/egypt/aswan-felucca.jpg' },
    ],
  },
  {
    tabTitle: 'Siwa & White Desert',
    slug: 'siwa',
    title: 'Hidden Oases, Salt Lakes & Milky Way Safari',
    duration: '6 nights',
    numberOfStops: '5 hidden gems',
    transportMode: 'Private 4x4 Expedition',
    accommodationTag: 'Ecolodge & Star Camp',
    activityTag: 'Siwa Salt Lakes',
    transportTag: 'Cairo → Siwa → Farafra',
    foodTag: 'Oasis Dates & Feteer',
    flightTag: 'Vetted Local Escort',
    customerLabel: 'Curated by EGYVIBES for',
    customerName: 'Amélie & Julien (France)',
    customerImageUrl: '/assets/moments/avatar-2.webp',
    ctaCopy: 'Plan your Siwa & White Desert trip for free',
    photos: [
      { url: '/assets/egypt/siwa-oasis.jpg', tag: 'Shali Fortress' },
      { url: '/assets/egypt/siwa-salt-lakes.jpg', tag: 'Salt Lakes' },
      { url: '/assets/egypt/fayoum-wadi-hitan.jpg', tag: 'Whale Valley' },
      { url: '/assets/egypt/white-desert.jpg', tag: 'White Desert' },
      { url: '/assets/egypt/tunis-village.jpg' },
    ],
  },
];

export const TRUSTPILOT_REVIEWS: TrustpilotReview[] = [
  {
    tripLabel: 'Cairo, Giza & Fayoum',
    tripSlug: 'cairo-giza',
    tripPhotoUrl: '/assets/egypt/giza-pyramids.jpg',
    reviewerName: 'Steven Dessert',
    avatarUrl: '/assets/reviews/steven.png',
    initial: 'S',
    text: 'We worried about getting overcharged in Cairo, but EGYVIBES handled everything from our airport landing to the last day. Transparent USD pricing, authentic local restaurants, and zero street hassle.',
    date: '10/14/2026',
  },
  {
    tripLabel: 'Luxor & Aswan Route',
    tripSlug: 'luxor',
    tripPhotoUrl: '/assets/egypt/karnak-temple.jpg',
    reviewerName: 'Nicole Renard',
    avatarUrl: '/assets/reviews/nicole.png',
    initial: 'N',
    text: 'Paying 25% on arrival and 75% before flying out gave us huge confidence. Within 48 hours of submitting our plan, they matched us into a small 6-person group and booked Dendera and Medinet Habu!',
    date: '09/28/2026',
  },
  {
    tripLabel: 'Siwa Oasis & White Desert',
    tripSlug: 'siwa',
    tripPhotoUrl: '/assets/egypt/siwa-salt-lakes.jpg',
    reviewerName: 'Amy Hughes',
    avatarUrl: '/assets/reviews/amy.png',
    initial: 'A',
    text: 'I never knew Egypt had hypersaline crystal lakes in Siwa and whale fossils in Fayoum. Our guide spoke fluent English, every contracted hotel was spotless, and the koshary and Nubian dinners were unforgettable.',
    date: '09/03/2026',
  },
  {
    tripLabel: 'Sharm El Sheikh & Dahab',
    tripSlug: 'sharm-el-sheikh',
    tripPhotoUrl: '/assets/egypt/dahab-sinai.jpg',
    reviewerName: 'Jim Franklin',
    avatarUrl: '/assets/reviews/jim.png',
    initial: 'J',
    text: 'We landed at Sharm airport with our private driver waiting outside. Hiking Wadi El-Wishwash and snorkeling the Blue Hole felt effortless because every permit and local meal was already covered.',
    date: '08/19/2026',
  },
  {
    tripLabel: 'Aswan & Abu Simbel',
    tripSlug: 'aswan',
    tripPhotoUrl: '/assets/egypt/abu-simbel.jpg',
    reviewerName: 'Marilyn Alvarado',
    initial: 'M',
    text: 'Being able to pick my hotel star tier and immediately see vetted partner hotels at real Booking.com local rates made planning stress-free. Even the Philae motorboat was arranged transparently.',
    date: '08/04/2026',
  },
  {
    tripLabel: 'Alexandria & Cairo',
    tripSlug: 'alexandria',
    tripPhotoUrl: '/assets/egypt/qaitbay-citadel.jpg',
    reviewerName: 'Robin Lenay',
    initial: 'R',
    text: 'Our student ID discounts were properly honored at the Grand Egyptian Museum and Giza Pyramids, and our driver took us to the best local seafood spot on Alexandria’s Corniche.',
    date: '07/22/2026',
  },
];

export const STATS_ITEMS: StatItem[] = [
  { value: '27', label: 'Egyptian governorates covered' },
  { value: '100%', label: 'transparent local pricing' },
  { value: '37+', label: 'vetted partner hotels (3★–7★)' },
  { value: '25% / 75%', label: 'arrival & departure USD pay' },
];

export const DISCOVER_DESTINATIONS: DiscoverDestination[] = [
  { name: 'Cairo & Giza', slug: 'cairo-giza', imageUrl: '/assets/egypt/giza-pyramids.jpg', alt: 'Pyramids of Giza', subtitle: 'Pyramids & GEM' },
  { name: 'Luxor', slug: 'luxor', imageUrl: '/assets/egypt/karnak-temple.jpg', alt: 'Karnak Temple in Luxor', subtitle: 'Temples & Royal Tombs' },
  { name: 'Aswan', slug: 'aswan', imageUrl: '/assets/egypt/philae-temple.jpg', alt: 'Philae Temple in Aswan', subtitle: 'Nile Islands & Nubia' },
  { name: 'Abu Simbel', slug: 'aswan', imageUrl: '/assets/egypt/abu-simbel.jpg', alt: 'Abu Simbel Temple', subtitle: 'Rock-Carved Wonder' },
  { name: 'Sharm El Sheikh', slug: 'sharm-el-sheikh', imageUrl: '/assets/egypt/sharm-el-sheikh.jpg', alt: 'Sharm El Sheikh Red Sea', subtitle: 'Sinai Coral Coast' },
  { name: 'Hurghada & Red Sea', slug: 'hurghada', imageUrl: '/assets/egypt/hurghada-red-sea.jpg', alt: 'Giftun Island Hurghada', subtitle: 'Islands & Diving' },
  { name: 'Alexandria', slug: 'alexandria', imageUrl: '/assets/egypt/qaitbay-citadel.jpg', alt: 'Citadel of Qaitbay Alexandria', subtitle: 'Mediterranean Heritage' },
  { name: 'Siwa Oasis', slug: 'siwa', imageUrl: '/assets/egypt/siwa-oasis.jpg', alt: 'Shali Fortress Siwa Oasis', subtitle: 'Salt Lakes & Eco-Lodges' },
  { name: 'Fayoum & Wadi El-Hitan', slug: 'fayoum', imageUrl: '/assets/egypt/fayoum-wadi-hitan.jpg', alt: 'Wadi El-Hitan Fayoum', subtitle: 'UNESCO Whale Valley' },
  { name: 'White Desert', slug: 'white-desert', imageUrl: '/assets/egypt/white-desert.jpg', alt: 'White Desert Farafra', subtitle: 'Starlight Desert Safari' },
  { name: 'Dendera & Abydos', slug: 'luxor', imageUrl: '/assets/egypt/dendera-temple.jpg', alt: 'Dendera Temple ceiling', subtitle: 'Painted Sanctuaries' },
  { name: 'Dahab & Sinai', slug: 'sharm-el-sheikh', imageUrl: '/assets/egypt/dahab-sinai.jpg', alt: 'Dahab Blue Hole Sinai', subtitle: 'Canyons & Blue Hole' },
];

export const FOOTER_ABOUT_LINKS = [
  { label: 'Why EGYVIBES', action: 'scroll-why' as const },
  { label: 'About us', action: 'modal-about' as const },
  { label: 'Vetted Partners', action: 'modal-careers' as const },
  { label: '2026 Ticket Guide', action: 'scroll-discover' as const },
  { label: 'Egypt Moments', action: 'scroll-moments' as const },
  { label: 'AI Concierge', action: 'open-ai' as const },
  { label: 'Support portal', action: 'modal-support' as const },
];

export const FOOTER_DEST_LINKS = [
  { label: 'Cairo & Giza', slug: 'cairo-giza' },
  { label: 'Luxor', slug: 'luxor' },
  { label: 'Aswan', slug: 'aswan' },
  { label: 'Sharm El Sheikh', slug: 'sharm-el-sheikh' },
  { label: 'Hurghada & Red Sea', slug: 'hurghada' },
  { label: 'Alexandria', slug: 'alexandria' },
  { label: 'Siwa Oasis', slug: 'siwa' },
  { label: '27 Governorates Atlas', slug: 'all' },
];
