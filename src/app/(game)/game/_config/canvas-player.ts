import { NotePlayer } from "@/lib/song";

export class CanvasPlayer {

    Notes: NotePlayer[] = [];
    Canvas: HTMLCanvasElement;
    TotalTimeMs: number = 0;
    HighestFreq: number = 0;
    LowestFreq: number = 0;
    PaddingYPercent = 0.2;


    constructor(canvas: HTMLCanvasElement, notes: NotePlayer[]) {
        this.Notes = notes;
        this.Canvas = canvas;
        this.initialize();
    }

    initialize() {
        console.log("initialize");

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

    }

    draw(timeNow: number) {

        const ctx = this.Canvas.getContext("2d");
        if (!ctx) return;

        // Reset canvas


        const CanvasWidth = this.Canvas.width;
        const CanvasHeight = this.Canvas.height;
        ctx.fillStyle = `black`;
        ctx.fillRect(0, 0, CanvasWidth, CanvasHeight);

        const totalNotes = this.Notes.length;

        const padddingY = CanvasHeight * this.PaddingYPercent;

        const noteWidth = CanvasWidth / totalNotes;

        const noteHeight = (CanvasHeight / totalNotes) - padddingY;

        const freqDiff = Math.abs(this.HighestFreq - this.LowestFreq);

        let widthShift = 0;


        const timePercent = timeNow / this.TotalTimeMs;

        let currentRageTime = [0, 0]

        let posY = 0;

        this.Notes.forEach((note, i) => {

            const heightPos = CanvasHeight - (((Math.abs(note.freq - this.LowestFreq)) / freqDiff) * (CanvasHeight - padddingY / 2));

            currentRageTime[0] = currentRageTime[0] + note.duration;
            currentRageTime[1] = currentRageTime[0] + note.duration;

            const y = heightPos;
            const x = i * noteWidth;

            ctx.fillStyle = `white`;
            ctx.fillRect(x, y, noteWidth, noteHeight);

            widthShift = x + noteWidth;
        });



        ctx.fillStyle = `blue`;
        ctx.beginPath();
        ctx.arc(timePercent * CanvasWidth, posY - Math.abs(noteHeight / 2), Math.abs(noteHeight / 2), 0, 2 * Math.PI);
        ctx.fill();


        ctx.fillStyle = `red`;
        ctx.fillRect(timePercent * CanvasWidth, 0, 1, CanvasHeight);

    }



}