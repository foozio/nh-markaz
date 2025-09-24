
'use server';

import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export async function saveNotes(userId: string, notes: string) {
  try {
    const userNotesRef = doc(db, 'userNotes', userId);
    await setDoc(userNotesRef, {
      notes,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error saving notes: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
    return { success: false, error: errorMessage };
  }
}

export async function loadNotes(userId: string): Promise<{ notes?: string; error?: string }> {
  try {
    const userNotesRef = doc(db, 'userNotes', userId);
    const docSnap = await getDoc(userNotesRef);
    if (docSnap.exists()) {
      return { notes: docSnap.data().notes };
    }
    return { notes: '' };
  } catch (error) {
    console.error('Error loading notes: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
    return { error: errorMessage };
  }
}
