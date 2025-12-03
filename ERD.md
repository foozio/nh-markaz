# NH Markaz — Conceptual ERD

The current app stores notes in-memory; this ERD captures the intended persistent model to support per-user notes, bookmarks, and auditability.

## Entities
- **Users** (`id`, `email`, `name`, `avatarUrl`, `createdAt`)
- **QuranNotes** (`id`, `userId`, `surahNumber`, `contentHtml`, `updatedAt`)
- **HadithNotes** (`id`, `userId`, `collectionId`, `contentHtml`, `updatedAt`)
- **Bookmarks** (`id`, `userId`, `type` ["quran"|"hadith"], `surahNumber?`, `verseNumber?`, `collectionId?`, `hadithNumber?`, `excerpt`, `createdAt`)
- **HadithCollections** (`id`, `name`, `availableCount`, `source`, `fetchedAt`)
- **HadithEntries** (`id`, `collectionId`, `number`, `arab`, `translationId`, `audioUrl?`, `fetchedAt`)

## Relationships
- Users 1—* QuranNotes (per-user Quran notes)
- Users 1—* HadithNotes (per-user Hadith notes)
- Users 1—* Bookmarks; Bookmarks optionally link to a Surah/Ayah or Hadith entry
- HadithCollections 1—* HadithEntries

## Diagram (text)
```
[Users]───┬───────────────┬──────────────┐
          │               │              │
      1..*│           1..*│          1..*│
          ▼               ▼              ▼
   [QuranNotes]     [HadithNotes]   [Bookmarks]
                                            │0..*
                                            ▼
                                    [HadithEntries] 1..*──[HadithCollections]
```

## Notes
- `contentHtml` stores TipTap output; consider companion text index for search.
- Add indices on `(userId, surahNumber, verseNumber)` and `(userId, collectionId, hadithNumber)` for fast lookups.
- Consider soft-delete flags for auditability and restore features.
