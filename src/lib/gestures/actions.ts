import { GestureType } from './events';

export type CinematicAction = 
  | 'ACTIVATE_GESTURE_MODE'
  | 'DEACTIVATE_GESTURE_MODE'
  | 'NAVIGATE_NEXT_CLAUSE'
  | 'NAVIGATE_PREV_CLAUSE'
  | 'EXPAND_RISK_DETAILS'
  | 'FLAG_DANGEROUS_CLAUSE'
  | 'NONE';

/**
 * Intentional Interaction Design Core:
 * Requires an explicit activation ('Open_Palm') before processing destructive or navigational gestures.
 * Prevents accidental UI triggers while the user is simply moving their hands.
 */
export function mapGestureToAction(gesture: GestureType, isModeActive: boolean): CinematicAction {
  // Always allow activation via Open Palm
  if (gesture === 'Open_Palm') {
    return 'ACTIVATE_GESTURE_MODE';
  }
  
  // Drop all other gestures if the system is resting to ensure intentionality
  if (!isModeActive) {
    return 'NONE';
  }
  
  switch (gesture) {
    case 'Swipe_Left':
      return 'NAVIGATE_NEXT_CLAUSE';
    case 'Swipe_Right':
      return 'NAVIGATE_PREV_CLAUSE';
    case 'Pinch':
      return 'EXPAND_RISK_DETAILS';
    case 'Thumb_Down':
      return 'FLAG_DANGEROUS_CLAUSE';
    default:
      return 'NONE';
  }
}
