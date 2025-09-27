-- Add unique constraints for user_notes table to support ON CONFLICT operations

-- Create a unique index for Quran notes (user_id, note_type) where collection_id is NULL
CREATE UNIQUE INDEX unique_user_quran_notes_idx 
ON user_notes (user_id, note_type) 
WHERE note_type = 'quran' AND collection_id IS NULL;

-- Create a unique index for Hadith notes (user_id, note_type, collection_id) where collection_id is NOT NULL
CREATE UNIQUE INDEX unique_user_hadith_notes_idx 
ON user_notes (user_id, note_type, collection_id) 
WHERE note_type = 'hadith' AND collection_id IS NOT NULL;