
export interface Ayah {
  id: number;
  text: string;
  translations: {
    en: string;
    ur: string;
  };
  audio: string;
}

export interface Surah {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  total_verses: number;
  verses: Ayah[];
}

export const surahs: Surah[] = [
  {
    id: 1,
    name: "سُورَةُ ٱلْفَاتِحَةِ",
    transliteration: "Al-Fatihah",
    translation: "The Opening",
    total_verses: 7,
    verses: [
      {
        id: 1,
        text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
        translations: {
          en: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
          ur: "شروع الله کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔",
        },
        audio: "https://everyayah.com/data/Alafasy_128kbps/001001.mp3",
      },
      {
        id: 2,
        text: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ",
        translations: {
          en: "All praise is due to Allah, Lord of the worlds.",
          ur: "سب تعریفیں الله کے لیے ہیں جو تمام جہانوں کا پالنے والا ہے۔",
        },
        audio: "https://everyayah.com/data/Alafasy_128kbps/001002.mp3",
      },
      {
        id: 3,
        text: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
        translations: {
          en: "The Entirely Merciful, the Especially Merciful.",
          ur: "بڑا مہربان نہایت رحم والا ہے۔",
        },
        audio: "https://everyayah.com/data/Alafasy_128kbps/001003.mp3",
      },
      {
        id: 4,
        text: "مَـٰلِكِ يَوْمِ ٱلدِّينِ",
        translations: {
          en: "Sovereign of the Day of Recompense.",
          ur: "قیامت کے دن کا مالک ہے۔",
        },
        audio: "https://everyayah.com/data/Alafasy_128kbps/001004.mp3",
      },
      {
        id: 5,
        text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        translations: {
          en: "It is You we worship and You we ask for help.",
          ur: "ہم تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد مانگتے ہیں۔",
        },
        audio: "https://everyayah.com/data/Alafasy_128kbps/001005.mp3",
      },
      {
        id: 6,
        text: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
        translations: {
          en: "Guide us to the straight path.",
          ur: "ہمیں سیدھے راستے کی ہدایت فرما۔",
        },
        audio: "https://everyayah.com/data/Alafasy_128kbps/001006.mp3",
      },
      {
        id: 7,
        text: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
        translations: {
          en: "The path of those upon whom You have bestowed favor, not of those who have earned Your anger or of those who are astray.",
          ur: "ان لوگوں کا راستہ جن پر تو نے انعام کیا، نہ کہ ان کا جن پر غضب کیا گیا اور نہ ہی گمراہوں کا۔",
        },
        audio: "https://everyayah.com/data/Alafasy_128kbps/001007.mp3",
      },
    ],
  },
  {
    id: 2,
    name: "سُورَةُ البَقَرَةِ",
    transliteration: "Al-Baqarah",
    translation: "The Cow",
    total_verses: 286,
    verses: [
      {
        id: 1,
        text: "الٓمٓ",
        translations: {
          en: "Alif, Lam, Meem.",
          ur: "الم",
        },
        audio: "https://everyayah.com/data/Alafasy_128kbps/002001.mp3",
      },
      {
        id: 2,
        text: "ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
        translations: {
          en: "This is the Book about which there is no doubt, a guidance for those conscious of Allah.",
          ur: "یہ وہ کتاب ہے جس میں کوئی شک نہیں، پرہیزگاروں کے لیے ہدایت ہے۔",
        },
        audio: "https://everyayah.com/data/Alafasy_128kbps/002002.mp3",
      },
      {
        id: 3,
        text: "ٱلَّذِينَ يُؤْمِنُونَ بِٱلْغَيْبِ وَيُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا رَزَقْنَـٰهُمْ يُنفِقُونَ",
        translations: {
          en: "Who believe in the unseen, establish prayer, and spend out of what We have provided for them.",
          ur: "جو غیب پر ایمان لاتے ہیں، نماز قائم کرتے ہیں، اور جو ہم نے انہیں دیا ہے اس میں سے خرچ کرتے ہیں۔",
        },
        audio: "https://everyayah.com/data/Alafasy_128kbps/002003.mp3",
      },
      {
        id: 4,
        text: "وَٱلَّذِينَ يُؤْمِنُونَ بِمَآ أُنزِلَ إِلَيْكَ وَمَآ أُنزِلَ مِن قَبْلِكَ وَبِٱلْـَٔاخِرَةِ هُمْ يُوقِنُونَ",
        translations: {
          en: "And who believe in what has been revealed to you, [O Muhammad], and what was revealed before you, and of the Hereafter they are certain [in faith].",
          ur: "اور جو اس پر ایمان لاتے ہیں جو آپ پر نازل کیا گیا اور جو آپ سے پہلے نازل کیا گیا، اور آخرت پر وہ یقین رکھتے ہیں۔",
        },
        audio: "https://everyayah.com/data/Alafasy_128kbps/002004.mp3",
      },
      {
        id: 5,
        text: "أُو۟لَـٰٓئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُو۟لَـٰٓئِكَ هُمُ ٱلْمُفْلِحُونَ",
        translations: {
          en: "Those are upon [right] guidance from their Lord, and it is those who are the successful.",
          ur: "یہی لوگ اپنے رب کی طرف سے ہدایت پر ہیں، اور یہی لوگ فلاح پانے والے ہیں۔",
        },
        audio: "https://everyayah.com/data/Alafasy_128kbps/002005.mp3",
      },
    ],
  },
];
