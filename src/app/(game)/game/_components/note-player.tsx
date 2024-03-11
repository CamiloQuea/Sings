"use client";
import useIsMounted from "@/hooks/useIsMounted";
import React, { useEffect, useRef } from "react";

type NotePlayer = {
  freq: number;
  duration: number;
  type: string;
};

const song: NotePlayer[] = [
  { freq: 440, duration: 0.5, type: "flat" }, // C4
  { freq: 440, duration: 0.5, type: "flat" }, // C4
  { freq: 330, duration: 0.5, type: "flat" }, // G4
  { freq: 330, duration: 0.5, type: "flat" }, // G4
  { freq: 440, duration: 0.5, type: "flat" }, // C4
  { freq: 392, duration: 0.5, type: "flat" }, // A4
  { freq: 330, duration: 1.0, type: "flat" }, // G4
  { freq: 293, duration: 0.5, type: "flat" }, // E4
  { freq: 293, duration: 0.5, type: "flat" }, // E4
  { freq: 330, duration: 0.5, type: "flat" }, // G4
  { freq: 392, duration: 0.5, type: "flat" }, // A4
  { freq: 440, duration: 1.0, type: "flat" }, // C4
];

const fps = (fps: number) => {
  return 1000 / fps;
};

const NotePlayer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isMounted = useIsMounted();

  function initialize() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let i = 0;

    let totalTime = 0;

    for (let index = 0; index < song.length; index++) {
      const element = song[index];
      totalTime += element.duration;
    }

    function animate() {
      if (!canvas || !ctx) return;
      const note = song[i];

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "white";
      ctx.font = "50px serif";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(
        note.freq.toString(),
        Math.round(canvas.width / 2),
        Math.round(canvas.height / 2)
      );

      let width_shift = 0;

      for (let index = 0; index < song.length; index++) {
        const element = song[index];

        if (element.freq === note.freq && index === i) {
          ctx.fillStyle = "red";
        } else {
          ctx.fillStyle = "white";
        }

        const width_note = canvas.width * (element.duration / totalTime);

        ctx.fillRect(
          width_shift,
          canvas.height - (element.freq % canvas.height),
          width_note,
          1
        );

        if (index < song.length) {
          width_shift += width_note;
        } else {
          width_shift = 0;
        }
      }

      if (i + 1 < song.length) {
        i++;
      } else {
        i = 0;
      }

      setTimeout(() => {
        animate();
      }, 1000 * note.duration);
    }

    animate();
  }

  useEffect(() => {
    if (isMounted) {
      initialize();
    }
  }, [isMounted]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-full border" />
      <div className="absolute bottom-0 left-0  text-xs border px-2 py-1 rounded-tr">
        Playing...
      </div>
    </div>
  );
};

export default NotePlayer;
