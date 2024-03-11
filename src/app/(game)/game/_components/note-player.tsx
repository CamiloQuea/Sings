"use client";
import useIsMounted from "@/hooks/useIsMounted";
import React, { useEffect, useRef } from "react";

type NotePlayer = {
  freq: number;
  duration: number;
  type: string;
};

const smash_mountain_notes: NotePlayer[] = [
  { freq: 220, duration: 0.3, type: "flat" },
  { freq: 230, duration: 0.5, type: "flat" },
  { freq: 210, duration: 1, type: "flat" },
  { freq: 130, duration: 0.5, type: "flat" },
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

    for (let index = 0; index < smash_mountain_notes.length; index++) {
      const element = smash_mountain_notes[index];
      totalTime += element.duration;
    }

    function animate() {
      if (!canvas || !ctx) return;
      const note = smash_mountain_notes[i];

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

      for (let index = 0; index < smash_mountain_notes.length; index++) {
        const element = smash_mountain_notes[index];

        if (element.freq === note.freq) {
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

        if (index < smash_mountain_notes.length) {
          width_shift += width_note;
        } else {
          width_shift = 0;
        }
        console.log(width_note);
      }

      if (i + 1 < smash_mountain_notes.length) {
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
    <div>
      <canvas ref={canvasRef} className="w-full h-full border" />
    </div>
  );
};

export default NotePlayer;
