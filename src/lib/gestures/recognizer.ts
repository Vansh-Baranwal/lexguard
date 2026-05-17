import { GestureType } from './events';

// Map MediaPipe's raw standard gestures to our strictly defined domain types
const GESTURE_MAP: Record<string, GestureType> = {
  'Open_Palm': 'Open_Palm',
  'Closed_Fist': 'Pinch', // Simplification for cinematic 'grab/pinch' actions
  'Thumb_Down': 'Thumb_Down',
};

export function parseRawGesture(categoryName: string): GestureType {
  return GESTURE_MAP[categoryName] || 'Unknown';
}

export interface Coordinates {
  x: number;
  y: number;
  z: number;
}

/**
 * Calculates synthetic swipe gestures from hand landmark delta histories.
 * MediaPipe tasks-vision does not provide "swipe" natively, so we calculate the spatial delta.
 */
export function detectSwipe(history: Coordinates[]): GestureType {
  if (history.length < 5) return 'None';
  
  const start = history[0];
  const end = history[history.length - 1];
  
  const dx = end.x - start.x;
  
  // Normalized threshold across the viewport width
  // If the hand moves > 15% across the screen in our short history buffer
  if (dx > 0.15) return 'Swipe_Right';
  if (dx < -0.15) return 'Swipe_Left';
  
  return 'None';
}
