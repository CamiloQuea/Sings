import { MicrophoneConnection } from "./microphone";

interface MicProcessorInterface {
  init(): this;
}

export class NoteMicProcessor implements MicProcessorInterface {
  micConnection = new MicrophoneConnection();
  audioCtx: AudioContext | null = null;
  analyser: AnalyserNode | null = null;

  init() {
    this.micConnection.connect((audioStream) => {
      const state = this.startCtx();
      const microphoneStream = state.ctx?.createMediaStreamSource(audioStream);
      microphoneStream?.connect(state.analyser);
    });

    return this;
  }

  private startCtx() {
    this.audioCtx = new AudioContext();
    this.analyser = this.audioCtx.createAnalyser();

    return {
      ctx: this.audioCtx,
      analyser: this.analyser,
    };
  }

  getPitch = () => {
    let bufferLength = this.analyser?.fftSize || 0;
    let buffer = new Float32Array(bufferLength);
    this.analyser?.getFloatTimeDomainData(buffer);
    // console.log(num_samples, buffer)
    return this.autoCorrelate(buffer, this.audioCtx?.sampleRate || 0);
    // return this.detect_pitch(buffer, 200, 1, this.audioCtx?.sampleRate || 0, [20, 2000]);
  };

  noteIsSimilarEnough(
    noteFreq: number,
    previousValueToDisplay: number,
    smoothingThreshold: number,
  ) {
    if (noteFreq === -1) {
      return false;
    }
    return Math.abs(noteFreq - previousValueToDisplay) < smoothingThreshold;
  }

  autoCorrelate(buffer: Float32Array, sampleRate: number) {
    // Perform a quick root-mean-square to see if we have enough signal
    // console.log(buffer)
    let SIZE = buffer.length;
    let sumOfSquares = 0;
    for (let i = 0; i < SIZE; i++) {
      let val = buffer[i];

      if (val === undefined) {
        continue;
      }

      sumOfSquares += Math.pow(val, 2);
    }
    let rootMeanSquare = Math.sqrt(sumOfSquares / SIZE);

    if (rootMeanSquare < 0.01) {
      return -1;
    }

    // Find a range in the buffer where the values are below a given threshold.
    let r1 = 0;
    let r2 = SIZE - 1;
    let threshold = 0.02;

    // Walk up for r1
    for (let i = 0; i < SIZE / 2; i++) {
      const value = buffer[i];

      if (value === undefined) {
        continue;
      }

      if (Math.abs(value) > threshold) {
        r1 = i;
        break;
      }
    }

    // Walk down for r2
    for (let i = 1; i < SIZE / 2; i++) {
      const value = buffer[SIZE - i];

      if (value === undefined) {
        continue;
      }

      if (Math.abs(value) > threshold) {
        r2 = SIZE - i;
        break;
      }
    }

    // Trim the buffer to these ranges and update SIZE.
    buffer = buffer.slice(r1, r2);
    // console.log(r1, r2, buffer)
    SIZE = buffer.length;
    // console.log(r1, r2, buffer)

    // Create a new array of the sums of offsets to do the autocorrelation
    let c = new Array(SIZE).fill(0);
    // For each potential offset, calculate the sum of each buffer value times its offset value
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE - i; j++) {
        const valueBuff1 = buffer[j];
        const valueBuff2 = buffer[i];

        if (valueBuff1 === undefined || valueBuff2 === undefined) {
          continue;
        }

        c[i] += valueBuff1 * valueBuff2;
      }
    }

    // Find the last index where that value is greater than the next one (the dip)
    let d = 0;
    while (c[d] > c[d + 1]) {
      d++;
    }

    // Iterate from that index through the end and find the maximum sum
    let maxValue = -1;
    let maxIndex = -1;
    for (let i = d; i < SIZE; i++) {
      if (c[i] > maxValue) {
        maxValue = c[i];
        maxIndex = i;
      }
    }

    let T0 = maxIndex;

    // Not as sure about this part, don't @ me
    // From the original author:
    // interpolation is parabolic interpolation. It helps with precision. We suppose that a parabola pass through the
    // three points that comprise the peak. 'a' and 'b' are the unknowns from the linear equation system and b/(2a) is
    // the "error" in the abscissa. Well x1,x2,x3 should be y1,y2,y3 because they are the ordinates.
    let y1 = c[T0 - 1];
    let y2 = c[T0];
    let y3 = c[T0 + 1];

    let a = (y1 + y3 - 2 * y2) / 2;
    let b = (y3 - y1) / 2;
    if (a !== 0) {
      T0 = T0 - b / (2 * a);
    }

    return sampleRate / T0;
  }
}
// export class MicProcessor implements MicProcessorInterface {

//   audioCtx: AudioContext;
//   analyserNode: AnalyserNode;
//   microphoneStream: MediaStreamAudioSourceNode | null;

//   constructor() {
//     this.audioCtx = new AudioContext();
//     this.analyserNode = this.audioCtx.createAnalyser();

//     this.microphoneStream = null;
//   }

//   init(getFreq: (onResult: typeof this.getPitch) => void) {
//     this.analyserNode.minDecibels = -100;
//     this.analyserNode.maxDecibels = -10;
//     this.analyserNode.smoothingTimeConstant = 0.85;

//     if (!navigator?.mediaDevices?.getUserMedia) {
//       console.log("Sorry, getUserMedia is required for the app.");
//       return;
//     }

//     navigator.mediaDevices
//       .getUserMedia({
//         audio: {
//           noiseSuppression: true,
//           echoCancellation: true
//         }
//       })
//       .then((stream) => {
//         this.audioCtx.resume()
//         this.microphoneStream = this.audioCtx.createMediaStreamSource(stream);
//         this.microphoneStream.connect(this.analyserNode);

//         getFreq(this.getPitch);
//       })
//       .catch(function (err) {
//         console.log("mehhhhhh!! ERROR", { err });
//       });
//   }

//   getPitch = () => {
//     let bufferLength = this.analyserNode.fftSize;
//     let buffer = new Float32Array(bufferLength);
//     this.analyserNode.getFloatTimeDomainData(buffer);
//     // console.log({ bufferFirst: buffer[0], sampleRate: this.audioCtx.sampleRate })
//     let autoCorrelateValue = autoCorrelate(buffer, this.audioCtx.sampleRate);
//     return autoCorrelateValue;
//   };

//   noteIsSimilarEnough(noteFreq: number, previousValueToDisplay: number, smoothingThreshold: number) {

//     if (noteFreq === -1) {
//       return false;
//     }

//     return noteFreq - previousValueToDisplay < smoothingThreshold;
//   }
// }

// function
