"use client";
import useGame from "@/hooks/useGame";
import useIsMounted from "@/hooks/useIsMounted";
import { type NotePlayer } from "@/lib/song";
import React, { useCallback, useEffect, useRef } from "react";
import { CanvasPlayer, Song } from "../_config/canvas-player";

const song_notes: NotePlayer[] = [
  { freq: 220, duration: 1000, type: "flat" }, // C4
  { freq: 220, duration: 1000, type: "flat" }, // C4
  { freq: 165, duration: 1000, type: "flat" }, // G4
  { freq: 165, duration: 1000, type: "flat" }, // G4
  { freq: 220, duration: 1000, type: "flat" }, // C4
  { freq: 196, duration: 1000, type: "flat" }, // A4
  { freq: 165, duration: 2000, type: "flat" }, // G4
  { freq: 146.5, duration: 1000, type: "flat" }, // E4
  { freq: 165, duration: 1000, type: "flat" }, // G4
  { freq: 196, duration: 1000, type: "flat" }, // A4
  { freq: 146.5, duration: 1000, type: "flat" }, // E4
  { freq: 220, duration: 2000, type: "flat" }, // C4
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

    const FPS = 60
 
    const song = new Song(song_notes)

    const canvasPlayer = new CanvasPlayer({ canvas: canvasRef.current, song, frames: FPS });

    let start = Date.now();

    setInterval(() => {
      const now = Date.now();
      const diff = now - start;

      if (canvasPlayer.song.TotalTimeMs <= diff) {
        start = Date.now();
      }
      canvasPlayer.draw(now - start);
    }, fps(FPS));
  }, []);

  useEffect(() => {
    if (isMounted && !song) {
      initialize();
    }
  }, [initialize, isMounted, song]);

  return (
    <div className="relative w-fit m-2  rounded-2xl overflow-clip border bg-white mx-auto">
      <canvas ref={canvasRef} width={800} height={200} />
    </div>
  );
};

export default NotePlayer;
