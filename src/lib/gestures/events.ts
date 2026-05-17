export type GestureType = 
  | 'Swipe_Left' 
  | 'Swipe_Right' 
  | 'Pinch' 
  | 'Open_Palm' 
  | 'Thumb_Down' 
  | 'Unknown' 
  | 'None';

export interface GestureEvent {
  type: GestureType;
  timestamp: number;
  confidence: number;
}

export type GestureEventListener = (event: GestureEvent) => void;

/**
 * Clean Event-Driven Architecture.
 * Separates MediaPipe raw processing from UI state mutations.
 */
class GestureEventBus {
  private listeners: Set<GestureEventListener> = new Set();
  
  subscribe(listener: GestureEventListener) {
    this.listeners.add(listener);
    // Return unsubscribe function
    return () => this.listeners.delete(listener);
  }
  
  dispatch(event: GestureEvent) {
    this.listeners.forEach(listener => listener(event));
  }
}

// Singleton bus for global frontend orchestration
export const gestureBus = new GestureEventBus();
