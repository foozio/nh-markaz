

export interface Ayah {
  number: {
    inQuran: number;
    inSurah: number;
  };
  text: {
    arab: string;
    transliteration: {
      en: string;
    };
  };
  translation: {
    en: string;
    ur: string; // Assuming Urdu translation will be added or handled elsewhere.
  };
  audio: {
    primary: string;
  };
}

export interface SurahSummary {
  number: number;
  name: {
    transliteration: {
      en: string;
    };
    translation: {
      en: string;
    };
    long: string;
  };
  numberOfVerses: number;
}

export interface Surah extends SurahSummary {
  verses: Ayah[];
}
