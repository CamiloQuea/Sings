"use client";
import useGame from "@/hooks/useGame";
import useIsMounted from "@/hooks/useIsMounted";
import { type NotePlayer } from "@/lib/song";
import React, { useCallback, useEffect, useRef } from "react";
import { CanvasPlayer } from "../_config/canvas-player";

const song_notes: NotePlayer[] = [
  { freq: 440, duration: 500, type: "flat" }, // C4
  { freq: 440, duration: 500, type: "flat" }, // C4
  { freq: 330, duration: 500, type: "flat" }, // G4
  { freq: 330, duration: 500, type: "flat" }, // G4
  { freq: 440, duration: 500, type: "flat" }, // C4
  { freq: 392, duration: 500, type: "flat" }, // A4
  { freq: 330, duration: 1000, type: "flat" }, // G4
  { freq: 293, duration: 500, type: "flat" }, // E4
  { freq: 330, duration: 500, type: "flat" }, // G4
  { freq: 392, duration: 500, type: "flat" }, // A4
  { freq: 293, duration: 500, type: "flat" }, // E4
  { freq: 440, duration: 1000, type: "flat" }, // C4
];

const fps = (fps: number) => {
  return 1000 / fps;
};

const NotePlayer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isMounted = useIsMounted();

  const { currentNote, loadSong, playSong, song } = useGame();

  const initialize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasPlayer = new CanvasPlayer(canvasRef.current, song_notes);

    let start = Date.now();

    setInterval(() => {
      const now = Date.now();
      const diff = now - start;
      // console.log({ diff, TotalTimeMs: canvasPlayer.TotalTimeMs });

      // if (canvasPlayer.currentIndex >= song_notes.length) {
      //   canvasPlayer.currentIndex = 0;
      // } else {
      //   canvasPlayer.currentIndex++;
      // }

      if (canvasPlayer.TotalTimeMs <= diff) {
        start = Date.now();
      }
      canvasPlayer.draw(now - start);
    }, fps(60));
  }, []);

  useEffect(() => {
    if (isMounted && !song) {
      initialize();
    }
  }, [initialize, isMounted, song]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-full border" />
      {/* <div className="absolute bottom-0 left-0  text-xs border px-2 py-1 rounded-tr bg-black">
        Playing... {currentNote?.freq}
      </div> */}
    </div>
  );
};

export default NotePlayer;
