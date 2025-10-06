# API Reference

## Overview

Markaz uses Next.js API routes to provide server-side functionality. All API endpoints return JSON responses with a consistent structure.

## Response Format

All API endpoints return responses in the following format:

```json
{
  "success": boolean,
  "data": object | array | null,
  "error": string | null,
  "message": string | null
}
```

## Quran API Endpoints

### GET `/api/surahs`

Retrieves a list of all Quran surahs.

**Response:**
```json
{
  "success": true,
  "surahs": [
    {
      "number": 1,
      "name": {
        "short": "الفاتحة",
        "long": "سُورَةُ الفَاتِحَةِ",
        "transliteration": {
          "en": "Al-Fatihah",
          "id": "Al-Fatihah"
        },
        "translation": {
          "en": "The Opening",
          "id": "Pembukaan"
        }
      },
      "numberOfVerses": 7,
      "revelation": {
        "arab": "مكية",
        "en": "Meccan",
        "id": "Makkiyah"
      }
    }
  ]
}
```

### GET `/api/surah/[number]`

Retrieves detailed information for a specific surah.

**Parameters:**
- `number` (path): Surah number (1-114)

**Response:**
```json
{
  "success": true,
  "surah": {
    "number": 1,
    "name": { /* surah name object */ },
    "numberOfVerses": 7,
    "revelation": { /* revelation object */ },
    "verses": [
      {
        "number": {
          "inQuran": 1,
          "inSurah": 1
        },
        "text": {
          "arab": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
          "transliteration": {
            "en": "Bismillaahir Rahmaanir Raheem"
          }
        },
        "translation": {
          "en": "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
          "id": "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang."
        },
        "audio": {
          "primary": "https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/1",
          "secondary": ["https://cdn.alquran.cloud/media/audio/ayah/ar.ahmedajamy/1"]
        },
        "tafsir": {
          "id": {
            "short": "Tafsir singkat dalam bahasa Indonesia",
            "long": "Tafsir lengkap dalam bahasa Indonesia"
          }
        }
      }
    ]
  }
}
```

**Error Responses:**
- `400`: Invalid surah number
- `500`: Internal server error

### GET `/api/search/quran`

Searches for verses in the Quran.

**Query Parameters:**
- `q` (required): Search query
- `cache` (optional): Whether to use cache (default: true)

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "surahId": 2,
      "ayahNumber": 255,
      "arabicText": "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
      "translation": "Allah, tidak ada tuhan melainkan Dia...",
      "transliteration": "Allahu la ilaha illa huwa alhayyu alqayyumu"
    }
  ],
  "total": 1
}
```

**Error Responses:**
- `400`: Missing query parameter
- `500`: Search failed

## Hadith API Endpoints

### GET `/api/hadith/collections`

Retrieves available hadith collections.

**Response:**
```json
{
  "success": true,
  "collections": [
    {
      "id": "bukhari",
      "name": "Sahih Bukhari",
      "available": 7563
    },
    {
      "id": "muslim",
      "name": "Sahih Muslim",
      "available": 3033
    }
  ]
}
```

### GET `/api/search/hadith`

Searches for hadith across collections.

**Query Parameters:**
- `q` (required): Search query
- `cache` (optional): Whether to use cache (default: true)

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "collectionId": "bukhari",
      "hadithNumber": 1,
      "arabicText": "حدثنا الحميدي...",
      "translation": "",
      "narrator": "Al-Humaidi",
      "grade": "Sahih"
    }
  ],
  "total": 1
}
```

**Error Responses:**
- `400`: Missing query parameter
- `500`: Search failed

## Error Handling

All endpoints follow consistent error handling:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable error message"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limiting

- API endpoints implement rate limiting to prevent abuse
- External API calls are cached to reduce load
- Large requests may be paginated

## Authentication

Most endpoints are public, but user-specific features require authentication via Supabase session cookies.

## Caching

- Quran and Hadith data are cached using SQLite
- Cache automatically refreshes to ensure data freshness
- Search results may be cached for performance

## External Dependencies

The API routes depend on external services:
- **Quran API**: `https://api.quran.gading.dev`
- **Hadith API**: `https://api.hadith.gading.dev`
- **Search API**: `https://api.alquran.cloud`

All external API calls include proper error handling and fallbacks.