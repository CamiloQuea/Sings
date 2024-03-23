import { NotePlayer } from "@/lib/song";
import { NoteMicProcessor } from "./note-mic-processor";

export class CanvasPlayer {

    Canvas: HTMLCanvasElement;
    CanvasCtx: CanvasRenderingContext2D | null;

    micProcessor: NoteMicProcessor
    notePlayerCanvas: NotePlayerCanvas;

    GameState: GameState;


    constructor(canvas: HTMLCanvasElement, gameState: GameState) {

        this.Canvas = canvas;
        this.CanvasCtx = canvas.getContext("2d");

        this.GameState = gameState;

        this.micProcessor = new NoteMicProcessor();
        this.notePlayerCanvas = new NotePlayerCanvas(this.Canvas, this.GameState);

        this.initialize();

    }

    initialize() {
        this.micProcessor.init()
    }

    draw(timeNow: number) {

        const ctx = this.Canvas.getContext("2d");
        if (!ctx) return;

        const CanvasWidth = this.Canvas.width;
        let CanvasHeight = this.Canvas.height;

        // console.log(`${this.Canvas.width} ${this.Canvas.clientWidth} ${this.Canvas.offsetWidth} ${this.Canvas.scrollWidth}`)

        // Reset canvas
        ctx.fillStyle = `black`;
        ctx.fillRect(0, 0, CanvasWidth, CanvasHeight);

        const totalNotes = this.GameState.Notes.length;
        const noteWidth = CanvasWidth / totalNotes;

        const noteHeight = 20;

        const CanvasHeightDrawable = CanvasHeight - noteHeight;


        let widthShift = 0;

        const timePercent = timeNow / this.GameState.TotalTimeMs;

        const pitchHeight = this.notePlayerCanvas.getPitchHeight(this.micProcessor.getPitch());

        this.GameState.Notes.forEach((note, i) => {
            const notePercentHeight = (note.freq - this.GameState.LowestFreq)

            const heightPos = CanvasHeightDrawable - (notePercentHeight / this.GameState.freqDiff) * CanvasHeightDrawable;


            const y = heightPos;
            const x = i * noteWidth;

            if (pitchHeight >= heightPos && pitchHeight <= heightPos + noteHeight && timePercent * CanvasWidth >= x && timePercent * CanvasWidth <= x + noteWidth) {

                ctx.fillStyle = `green`;

            } else {

                ctx.fillStyle = `white`;
            }
            ctx.fillRect(x, y, noteWidth, noteHeight);

            widthShift = x + noteWidth;
        });



        ctx.fillStyle = `blue`;
        ctx.beginPath();
        ctx.arc(timePercent * CanvasWidth, pitchHeight, Math.abs(10 / 2), 0, 2 * Math.PI);
        ctx.fill();


        ctx.fillStyle = `red`;
        ctx.fillRect(timePercent * CanvasWidth, 0, 1, CanvasHeight);

        this.notePlayerCanvas.update(this.micProcessor.getPitch());


    }






}


type Position = { x: number, y: number }

class NotePlayerCanvas {

    canvas: HTMLCanvasElement;
    canvasCtx: CanvasRenderingContext2D | null;

    GameState: GameState;

    position: Position;
    radius = 5

    constructor(canvas: HTMLCanvasElement, gameState: GameState) {
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext("2d");
        this.GameState = gameState;

        this.position = {
            x: 0,
            y: (this.canvas.height / 2) - this.radius
        }
    }

    init() {
        this.draw()
    }

    draw() {
        if (!this.canvasCtx) return;


        // draw a circle
        this.canvasCtx.fillStyle = `red`;
        this.canvasCtx.beginPath();
        this.canvasCtx.arc(this.position.x + this.radius, this.position.y, this.radius, 0, 2 * Math.PI);
        this.canvasCtx.fill();

    }

    update(freq: number) {
        this.position.y = this.getPitchHeight(freq);
        this.draw();
    }

    getPitchHeight(pitch: number) {
        const CanvasHeight = this.canvas.height;
        // const padddingY = (CanvasHeight * this.PaddingYPercent) / 2;

        const heightPercent = ((pitch - this.GameState.LowestFreq) / this.GameState.freqDiff);

        return CanvasHeight - heightPercent * CanvasHeight
    }



}

export class GameState {
    Notes: NotePlayer[] = [];
    TotalTimeMs: number = 0;
    HighestFreq: number = 0;
    LowestFreq: number = 0;
    PaddingYPercent = 0.2;
    freqDiff: number = 0;

    constructor(notes: NotePlayer[]) {
        this.Notes = notes;
        this.analyzeSong();
    }

    analyzeSong() {

        this.Notes.forEach((note, i) => {
            this.TotalTimeMs += note.duration;

            if (i === 0) {
                this.HighestFreq = note.freq;
                this.LowestFreq = note.freq;
            }

            if (note.freq > this.HighestFreq) {
                this.HighestFreq = note.freq;
            }
            if (note.freq < this.LowestFreq) {
                this.LowestFreq = note.freq;
            }
        });

        this.freqDiff = Math.abs(this.HighestFreq - this.LowestFreq);

    }

}