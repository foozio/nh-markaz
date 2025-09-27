-- Add unique constraints to user_notes table to support UPSERT operations

-- Add unique constraint for Quran notes (user_id + note_type)
ALTER TABLE user_notes 
ADD CONSTRAINT unique_user_quran_notes 
UNIQUE (user_id, note_type) 
WHERE note_type = 'quran';

-- Add unique constraint for Hadith notes (user_id + note_type + collection_id)
ALTER TABLE user_notes 
ADD CONSTRAINT unique_user_hadith_notes 
UNIQUE (user_id, note_type, collection_id) 
WHERE note_type = 'hadith' AND collection_id IS NOT NULL;