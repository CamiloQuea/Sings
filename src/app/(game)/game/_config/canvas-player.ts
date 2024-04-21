import { NotePlayer } from "@/lib/song";
import { NoteMicProcessor } from "./note-mic-processor";
import { NotesMap, KaraokePlayerBuilder } from "./notes-map-creator";

export class CanvasPlayer {

    Canvas: HTMLCanvasElement;
    CanvasCtx: CanvasRenderingContext2D | null;

    micProcessor: NoteMicProcessor
    
    song: Song;
    karaokePlayer: KaraokePlayerBuilder;

    constructor(opts: {canvas: HTMLCanvasElement, song: Song, frames : number}) {

        this.Canvas = opts.canvas;
        this.CanvasCtx = this.Canvas.getContext("2d");

        this.song = opts.song;

        this.micProcessor = new NoteMicProcessor();
        // this.notePlayerCanvas = new NotePlayerCanvas(this.Canvas, this.song);
        this.karaokePlayer = new KaraokePlayerBuilder(this.Canvas, this.song,opts.frames);
        this.initialize();

    }

    initialize() {
        this.micProcessor.init()
    }

    draw(timeNow: number) {
        if (!this.CanvasCtx) return;

        const CanvasWidth = this.Canvas.width;
        let CanvasHeight = this.Canvas.height;

        // Reset canvas
        
        this.CanvasCtx.clearRect(0, 0, CanvasWidth, CanvasHeight);

        this.CanvasCtx?.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
        this.karaokePlayer?.notesMap.update();
        this.karaokePlayer.micPlayer.update(this.micProcessor.getPitch());

    }

}


export class Song {
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