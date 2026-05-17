import { FilesetResolver, GestureRecognizer, GestureRecognizerResult } from '@mediapipe/tasks-vision';
import { gestureBus, GestureType } from './events';
import { parseRawGesture, detectSwipe, Coordinates } from './recognizer';

const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task';

export class GestureTracker {
  private recognizer: GestureRecognizer | null = null;
  private isRunning = false;
  private lastVideoTime = -1;
  private handCenterHistory: Coordinates[] = [];
  
  // Throttle limiters to prevent cinematic animation spam
  private lastGestureTime = 0;
  private readonly GESTURE_COOLDOWN = 800; // ms

  async initialize() {
    if (this.recognizer) return;
    
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
    );
    
    this.recognizer = await GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: MODEL_URL,
        delegate: 'GPU'
      },
      runningMode: 'VIDEO',
      numHands: 1 // Single hand keeps interactions intentional
    });
  }

  processVideoFrame(videoElement: HTMLVideoElement) {
    if (!this.recognizer || !this.isRunning) return;
    
    const nowInMs = Date.now();
    
    if (videoElement.currentTime !== this.lastVideoTime) {
      this.lastVideoTime = videoElement.currentTime;
      
      const results = this.recognizer.recognizeForVideo(videoElement, nowInMs);
      this.analyzeResults(results, nowInMs);
    }
    
    // Non-blocking render cycle binding
    if (this.isRunning) {
      requestAnimationFrame(() => this.processVideoFrame(videoElement));
    }
  }

  private analyzeResults(results: GestureRecognizerResult, timestamp: number) {
    if (timestamp - this.lastGestureTime < this.GESTURE_COOLDOWN) {
      return; 
    }

    let detectedGesture: GestureType = 'None';
    let confidence = 0;

    // 1. Map native static poses
    if (results.gestures.length > 0 && results.gestures[0].length > 0) {
      const topGesture = results.gestures[0][0];
      detectedGesture = parseRawGesture(topGesture.categoryName);
      confidence = topGesture.score;
    }

    // 2. Calculate dynamic structural swipes
    if (results.landmarks.length > 0) {
      const wrist = results.landmarks[0][0];
      this.handCenterHistory.push({ x: wrist.x, y: wrist.y, z: wrist.z });
      
      if (this.handCenterHistory.length > 10) {
        this.handCenterHistory.shift(); 
      }
      
      const swipeGesture = detectSwipe(this.handCenterHistory);
      if (swipeGesture !== 'None') {
        detectedGesture = swipeGesture;
        confidence = 0.9;
      }
    } else {
      this.handCenterHistory = []; // Hand lost, reset delta history
    }

    // 3. Dispatch purely via EventBus (no direct DOM mutation)
    if (detectedGesture !== 'None' && detectedGesture !== 'Unknown') {
      gestureBus.dispatch({ type: detectedGesture, timestamp, confidence });
      this.lastGestureTime = timestamp;
      this.handCenterHistory = []; 
    }
  }

  start(videoElement: HTMLVideoElement) {
    this.isRunning = true;
    this.processVideoFrame(videoElement);
  }

  stop() {
    this.isRunning = false;
    this.handCenterHistory = [];
  }
}
