'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

type UserNote = {
  userId: string;
  noteType: 'quran' | 'hadith';
  content: string;
  collectionId?: string;
};

async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

export async function saveNotes(userId: string, notes: string) {
  const supabase = await createSupabaseServerClient();
  
  // First, try to find existing record
  const { data: existingNote } = await supabase
    .from('user_notes')
    .select('id')
    .eq('user_id', userId)
    .eq('note_type', 'quran')
    .single();

  let result;
  if (existingNote) {
    // Update existing record
    result = await supabase
      .from('user_notes')
      .update({
        content: notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingNote.id);
  } else {
    // Insert new record
    result = await supabase
      .from('user_notes')
      .insert({
        user_id: userId,
        note_type: 'quran',
        content: notes,
        updated_at: new Date().toISOString()
      });
  }
  
  if (result.error) {
    return { error: result.error.message };
  }
  
  return { success: true };
}

export async function loadNotes(userId: string): Promise<{ notes?: string; error?: string }> {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('user_notes')
    .select('content')
    .eq('user_id', userId)
    .eq('note_type', 'quran')
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No rows found
      return { notes: '' };
    }
    return { error: error.message };
  }
  
  return { notes: data?.content || '' };
}

export async function writeNotesForUser(userId: string, notes: string) {
  return saveNotes(userId, notes);
}

export async function readNotesForUser(userId: string) {
  return loadNotes(userId);
}

export async function saveHadithNotes(userId: string, collectionId: string, notes: string) {
  const supabase = await createSupabaseServerClient();
  
  // First, try to find existing record
  const { data: existingNote } = await supabase
    .from('user_notes')
    .select('id')
    .eq('user_id', userId)
    .eq('note_type', 'hadith')
    .eq('collection_id', collectionId)
    .single();

  let result;
  if (existingNote) {
    // Update existing record
    result = await supabase
      .from('user_notes')
      .update({
        content: notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingNote.id);
  } else {
    // Insert new record
    result = await supabase
      .from('user_notes')
      .insert({
        user_id: userId,
        note_type: 'hadith',
        content: notes,
        collection_id: collectionId,
        updated_at: new Date().toISOString()
      });
  }
  
  if (result.error) {
    return { error: result.error.message };
  }
  
  return { success: true };
}

export async function loadHadithNotes(userId: string, collectionId: string): Promise<{ notes?: string; error?: string }> {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('user_notes')
    .select('content')
    .eq('user_id', userId)
    .eq('note_type', 'hadith')
    .eq('collection_id', collectionId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No rows found
      return { notes: '' };
    }
    return { error: error.message };
  }
  
  return { notes: data?.content || '' };
}

export async function writeHadithNotesForUser(userId: string, collectionId: string, notes: string) {
  return saveHadithNotes(userId, collectionId, notes);
}

export async function readHadithNotesForUser(userId: string, collectionId: string) {
  return loadHadithNotes(userId, collectionId);
}
