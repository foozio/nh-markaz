

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
    id: string;
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
      id: string;
    };
    long: string;
  };
  numberOfVerses: number;
}

export interface Surah extends SurahSummary {
  verses: Ayah[];
}
