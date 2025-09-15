import { ref, set, onValue, off } from 'firebase/database';
import { db } from './firebase';
import type { Clip } from './types';

// Function to write or update a clip
export async function writeClip(clip: Clip): Promise<void> {
  if (!db) {
    console.warn("Firebase not initialized, skipping writeClip.");
    return;
  }
  try {
    await set(ref(db, 'clips/' + clip.id), clip);
  } catch (error) {
    console.error("Error writing clip to database: ", error);
    throw error;
  }
}

// Function to listen for real-time updates to clips
export function onClipsValue(callback: (clips: Clip[]) => void): () => void {
  if (!db) {
    console.warn("Firebase not initialized, skipping onClipsValue.");
    return () => {}; // Return a no-op unsubscribe function
  }
  const clipsRef = ref(db, 'clips/');
  const listener = onValue(clipsRef, (snapshot) => {
    const data = snapshot.val();
    const clipsArray: Clip[] = data ? Object.values(data) : [];
    callback(clipsArray);
  }, (error) => {
    console.error("Firebase onValue error:", error);
    // When there is an error (e.g. permission denied), we can still provide an empty array.
    callback([]);
  });

  // Return an unsubscribe function
  return () => off(clipsRef, 'value', listener);
}
