import { NotePlayer } from "@/lib/song";
import { Song } from "./canvas-player";


const secondsPerCanvas: number = 10;
export type Position = { x: number, y: number }

export class KaraokePlayerBuilder {

    song: Song;
    image: HTMLImageElement;
    canvas: HTMLCanvasElement;
    micPlayer: MicPlayer;
    notesMap: NotesMap;

    constructor(canvas: HTMLCanvasElement, song: Song,fps:number) {
        this.song = song;
        this.canvas = canvas;

        this.notesMap = new NotesMap(this.canvas, this.song,fps);
        this.micPlayer = new MicPlayer(this.canvas, this.song);
        this.image = new Image();
    }


}

export class NotesMap {

    canvas: HTMLCanvasElement;
    canvasCtx: CanvasRenderingContext2D | null;

    virtualCanvas: VirtualCanvasScaffold;
    virtualCanvasCtx: CanvasRenderingContext2D ;

    position: { x: number, y: number };
    img: HTMLImageElement;
    fps: number;
    song: Song;
    noteHeight: number = 20;
    

    constructor(canvas: HTMLCanvasElement, song: Song,fps:number) {
        this.fps = fps;
        this.song = song;
        this.canvas = canvas;
        this.virtualCanvas = new VirtualCanvasScaffold(canvas);

        const ctx = this.canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not supported');
        this.canvasCtx = ctx;


        const virtualCtx = this.virtualCanvas.canvas.getContext('2d');
        if (!virtualCtx) throw new Error('Canvas not supported');
        this.virtualCanvasCtx = virtualCtx;

        this.position = {
            x: 0,
            y: 0
        }

        let pixelCount = this.secsWidth(song.TotalTimeMs)
        this.virtualCanvas.resize({ width: this.virtualCanvas.canvas.width + pixelCount, height: this.virtualCanvas.canvas.height });

        this.img = new Image();
        this.img.src = this.generateBackground()
    }

    draw() {
        const ctx = this.canvas.getContext('2d');
        if (!ctx || !this.img) return;

        ctx.drawImage(this.img, this.position.x, this.position.y);

    }

    update() {
       console.log(this.img.width, this.position.x, this.canvas.width)
        if (this.img.width + this.position.x > this.canvas.width) {
            this.position.x -= this.canvas.width / secondsPerCanvas / this.fps;
        } else {
            this.position.x = 0;
        }

        this.draw()
    }

    generateBackground(): string {
        // Draw background soft blue with a little bit of transparency
        const ctx = this.virtualCanvas.canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not supported');

        // Background
        this.virtualCanvasCtx.globalAlpha = 0.2;
        // soft purple
        this.virtualCanvasCtx.fillStyle = `rgba(20, 90, 90)`;
        this.virtualCanvasCtx.fillRect(0, 0, this.virtualCanvas.canvas.width, this.virtualCanvas.canvas.height);
        this.virtualCanvasCtx.globalAlpha = 1

        //Notes 
        const notes = this.song.Notes;
        let widthShift = this.virtualCanvas.paddingLeft
        for (let index = 0; index < notes.length; index++) {

            const note = notes[index];
            this.placeNote(index, widthShift);
            widthShift += this.noteWidth(note);
        }


        return this.virtualCanvas.canvas.toDataURL("image/png");

    }

    placeNote(index: number, widhtShift: number) {

        const currentNote = this.song.Notes[index];
        const nextNote = this.song.Notes[index + 1];
        const prevNote = this.song.Notes[index - 1];

        if (!this.virtualCanvasCtx) return;


        let canvasHeight = this.virtualCanvas.canvas.height;

        const canvasHeightDrawable = canvasHeight - this.noteHeight

        const notePercentHeight = (currentNote.freq - this.song.LowestFreq)

        const heightPos = canvasHeightDrawable - (notePercentHeight / this.song.freqDiff) * canvasHeightDrawable;

        const y = heightPos;
        const x = widhtShift;

        const noteWidth = this.noteWidth(currentNote);


        const borderWidth = 1;

        this.virtualCanvasCtx.beginPath();
        this.virtualCanvasCtx.fillStyle = 'white';
        this.virtualCanvasCtx.fillRect(x, y, noteWidth, this.noteHeight);
        this.virtualCanvasCtx.strokeStyle = 'gold';
        this.virtualCanvasCtx.lineWidth = borderWidth;
        this.virtualCanvasCtx.strokeRect(x, y, noteWidth, this.noteHeight);

    }

    noteWidth(note: NotePlayer): number {
        // Use the width of the canvas to calculate the width of the note using the fps too
        return this.secsWidth(note.duration);
    }

    secsWidth(milliseconds: number): number {
        return (milliseconds / 1000) * this.fps;

    }

}


class MicPlayer {

    canvas: HTMLCanvasElement;
    canvasCtx: CanvasRenderingContext2D | null;
    song: Song;
    position: Position
    radius: number = 10;
    constructor(canvas: HTMLCanvasElement, song: Song) {

        this.canvas = canvas;
        this.canvasCtx = canvas.getContext("2d");
        this.position = { x: this.canvas.width * 0.2, y: this.canvas.height * 0.5 }
        this.song = song;

    }

    init() {
        this.draw()
    }

    draw() {
        if (!this.canvasCtx) return;
        // Line
        this.canvasCtx.fillStyle = `red`;
        this.canvasCtx.fillRect(this.canvas.width * 0.1, 0, 2, this.canvas.height);

        // draw a circle
        this.canvasCtx.fillStyle = `blue`;
        this.canvasCtx.closePath()
        this.canvasCtx.beginPath();
        this.canvasCtx.arc(this.canvas.width * 0.1, this.position.y, this.radius, 0, 2 * Math.PI);
        this.canvasCtx.fill();
        this.canvasCtx.closePath()

    }

    update(freq: number) {
        this.position.y = this.getPitchHeight(freq);
        this.draw();
    }

    getPitchHeight(pitch: number) {
        const CanvasHeight = this.canvas.height;

        const heightPercent = ((pitch - this.song.LowestFreq) / this.song.freqDiff);

        return CanvasHeight - heightPercent * CanvasHeight
    }



}

class VirtualCanvasScaffold {
    originalCanvas: HTMLCanvasElement;
    canvas: HTMLCanvasElement;

    pixelWidthBySecond: number = 30;

    paddingLeft: number;
    paddingRight: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = document.createElement('canvas');
        this.originalCanvas = canvas;
        this.paddingLeft = this.originalCanvas.width;
        this.paddingRight = this.originalCanvas.width;
        this.canvas.width = this.paddingLeft+ this.paddingRight;
        this.canvas.height = this.originalCanvas.height;

    }

    resize(size: { width: number, height: number }) {

        this.canvas.width = size.width;
        this.canvas.height = size.height;

        return this;

    }

}