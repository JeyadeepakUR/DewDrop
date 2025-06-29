export interface RecordingConfig {
  audio: {
    sampleRate: number;
    channelCount: number;
    bitDepth: number;
  };
  video?: {
    width: number;
    height: number;
    frameRate: number;
  };
}

export class RecordingService {
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private chunks: Blob[] = [];
  private isRecording = false;

  async initialize(config: RecordingConfig): Promise<{ success: boolean; error?: string }> {
    try {
      const constraints: MediaStreamConstraints = {
        audio: {
          sampleRate: config.audio.sampleRate,
          channelCount: config.audio.channelCount,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };

      if (config.video) {
        constraints.video = {
          width: config.video.width,
          height: config.video.height,
          frameRate: config.video.frameRate
        };
      }

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.chunks.push(event.data);
        }
      };

      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  startRecording(): { success: boolean; error?: string } {
    try {
      if (!this.mediaRecorder) {
        throw new Error('Recording not initialized');
      }

      this.chunks = [];
      this.mediaRecorder.start(1000); // Collect data every second
      this.isRecording = true;

      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  stopRecording(): Promise<{ success: boolean; blob?: Blob; error?: string }> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve({ success: false, error: 'Recording not initialized' });
        return;
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: 'audio/webm' });
        this.isRecording = false;
        resolve({ success: true, blob });
      };

      this.mediaRecorder.stop();
    });
  }

  pauseRecording(): { success: boolean; error?: string } {
    try {
      if (!this.mediaRecorder || !this.isRecording) {
        throw new Error('Not currently recording');
      }

      this.mediaRecorder.pause();
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  resumeRecording(): { success: boolean; error?: string } {
    try {
      if (!this.mediaRecorder) {
        throw new Error('Recording not initialized');
      }

      this.mediaRecorder.resume();
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  getAudioLevel(): number {
    if (!this.stream) return 0;

    // Create audio context for real-time audio analysis
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(this.stream);
    
    source.connect(analyser);
    analyser.fftSize = 256;
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    
    // Calculate average volume
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    return average / 255; // Normalize to 0-1
  }

  cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.chunks = [];
    this.isRecording = false;
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }
}