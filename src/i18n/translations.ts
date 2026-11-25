export {
  SUPPORTED_LANGUAGES,
  type LanguageCode,
  type LanguageOption,
  type TranslationStrings,
  type CitySlug,
  type TravelStyleSlug,
  type AirportCode,
} from './types';
import type { LanguageCode, TranslationStrings } from './types';
import { EN } from './locales/en';
import { AR } from './locales/ar';
import { FR } from './locales/fr';
import { DE } from './locales/de';
import { ES } from './locales/es';
import { IT } from './locales/it';
import { RU } from './locales/ru';
import { ZH } from './locales/zh';
import { JA } from './locales/ja';
import { PT } from './locales/pt';

export const TRANSLATIONS: Record<LanguageCode, TranslationStrings> = {
  en: EN,
  ar: AR,
  fr: FR,
  de: DE,
  es: ES,
  it: IT,
  ru: RU,
  zh: ZH,
  ja: JA,
  pt: PT,
};

export function localizeCityName(slug: string, fallbackName: string, t: TranslationStrings): string {
  if (fallbackName in t.specialPlaceNames) {
    return t.specialPlaceNames[fallbackName];
  }
  if (slug in t.cityNames) {
    return t.cityNames[slug as keyof typeof t.cityNames];
  }
  return fallbackName;
}
