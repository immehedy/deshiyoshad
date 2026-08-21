import type { Locale } from './config';
import en from './dictionaries/en.json';
import bn from './dictionaries/bn.json';

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  bn: bn as Dictionary,
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale] ?? dictionaries.en;
}
