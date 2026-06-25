// Minimal Surah metadata needed for display. Only surahs actually referenced
// in content need real data — add more entries here as new reflections are added.

export interface SurahMeta {
  number: number;
  name: string; // English transliteration
  arabicName: string;
  englishMeaning: string;
  totalAyahs: number;
}

export const surahs: Record<number, SurahMeta> = {
  31: {
    number: 31,
    name: "Luqman",
    arabicName: "لقمان",
    englishMeaning: "Luqman",
    totalAyahs: 34,
  },
  49: {
    number: 49,
    name: "Al-Hujurat",
    arabicName: "الحجرات",
    englishMeaning: "The Chambers",
    totalAyahs: 18,
  },
};

export function getSurahMeta(number: number): SurahMeta {
  return (
    surahs[number] ?? {
      number,
      name: `Surah ${number}`,
      arabicName: "",
      englishMeaning: "",
      totalAyahs: 0,
    }
  );
}
