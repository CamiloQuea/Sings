export class GraphProcessor {

    audioCtx: AudioContext;
    analyserNode: AnalyserNode;
    microphoneStream: MediaStreamAudioSourceNode | null;

    constructor() {
        this.audioCtx = new AudioContext();
        this.analyserNode = this.audioCtx.createAnalyser();


        this.microphoneStream = null;
    }

    init(
        // getFreq: (onResult: typeof this.getPitch) => void
    ): AnalyserNode {
        this.analyserNode.minDecibels = -80;
        this.analyserNode.maxDecibels = -10;
        this.analyserNode.smoothingTimeConstant = 0.35;

        if (!navigator?.mediaDevices?.getUserMedia) {
            // console.log("Sorry, getUserMedia is required for the app.");
            throw new Error('Sorry, getUserMedia is required for the app.')
        }

        navigator.mediaDevices
            .getUserMedia({
                audio: true
            })
            .then((stream) => {
                this.audioCtx.resume()
                this.microphoneStream = this.audioCtx.createMediaStreamSource(stream);
                this.microphoneStream.connect(this.analyserNode);
            })
            .catch(function (err) {
                console.log("mehhhhhh!! ERROR", { err });
            });

        return this.analyserNode

    }

    getArray() { }

}