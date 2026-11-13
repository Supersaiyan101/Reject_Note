// Real-time Neural Face Tracker powered by MediaPipe BlazeFace
import { FilesetResolver, FaceDetector, type FaceDetectorResult } from '@mediapipe/tasks-vision';

export interface FaceDetectionResult {
  hasFace: boolean;
  isCentered: boolean;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  motionDelta: number;
}

class NeuralFaceTracker {
  private detector: FaceDetector | null = null;
  private isInitializing: boolean = false;
  private isReady: boolean = false;
  private lastTimestamp: number = 0;
  private lastBox: { x: number; y: number; w: number; h: number } | null = null;

  public async initialize(): Promise<boolean> {
    if (this.isReady || this.isInitializing) return this.isReady;
    this.isInitializing = true;

    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      this.detector = await FaceDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        minDetectionConfidence: 0.5,
      });

      this.isReady = true;
      this.isInitializing = false;
      return true;
    } catch (err) {
      console.warn('Failed to initialize MediaPipe GPU, trying CPU delegate:', err);
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );
        this.detector = await FaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
            delegate: 'CPU',
          },
          runningMode: 'VIDEO',
          minDetectionConfidence: 0.5,
        });
        this.isReady = true;
        this.isInitializing = false;
        return true;
      } catch (cpuErr) {
        console.error('MediaPipe initialization failed completely, falling back to local CV:', cpuErr);
        this.isInitializing = false;
        return false;
      }
    }
  }

  public detectFace(videoEl: HTMLVideoElement): FaceDetectionResult {
    if (!this.isReady || !this.detector || videoEl.readyState < 2) {
      return { hasFace: false, isCentered: false, confidence: 0, motionDelta: 0 };
    }

    try {
      const now = performance.now();
      // MediaPipe requires strictly increasing timestamps
      const timestamp = now > this.lastTimestamp ? now : this.lastTimestamp + 1;
      this.lastTimestamp = timestamp;

      const result: FaceDetectorResult = this.detector.detectForVideo(videoEl, timestamp);
      const detections = result.detections;

      if (!detections || detections.length === 0) {
        this.lastBox = null;
        return { hasFace: false, isCentered: false, confidence: 0, motionDelta: 0 };
      }

      // Found primary face
      const primaryFace = detections[0];
      const box = primaryFace.boundingBox;
      const confidence = primaryFace.categories?.[0]?.score ?? 0.85;

      const vWidth = videoEl.videoWidth || 640;
      const vHeight = videoEl.videoHeight || 480;

      let motionDelta = 0;
      if (box) {
        if (this.lastBox) {
          const dx = Math.abs(box.originX - this.lastBox.x);
          const dy = Math.abs(box.originY - this.lastBox.y);
          const dw = Math.abs(box.width - this.lastBox.w);
          motionDelta = Math.min(1.0, (dx + dy + dw) / 35);
        }
        this.lastBox = { x: box.originX, y: box.originY, w: box.width, h: box.height };
      }

      // Check if face is centered in the surveillance reticle
      // Normalized reticle range: X between 15% and 85%, Y between 10% and 90%
      let isCentered = false;
      if (box) {
        const faceCenterX = box.originX + box.width / 2;
        const faceCenterY = box.originY + box.height / 2;
        const normX = faceCenterX / vWidth;
        const normY = faceCenterY / vHeight;

        isCentered = normX >= 0.18 && normX <= 0.82 && normY >= 0.12 && normY <= 0.88;
      }

      return {
        hasFace: true,
        isCentered,
        confidence,
        boundingBox: box
          ? {
              x: box.originX,
              y: box.originY,
              width: box.width,
              height: box.height,
            }
          : undefined,
        motionDelta,
      };
    } catch {
      return { hasFace: false, isCentered: false, confidence: 0, motionDelta: 0 };
    }
  }
}

export const neuralFaceTracker = new NeuralFaceTracker();

