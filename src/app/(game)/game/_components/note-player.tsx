"use client";
import useGame from "@/hooks/useGame";
import useIsMounted from "@/hooks/useIsMounted";
import { type NotePlayer } from "@/lib/song";
import React, { useCallback, useEffect, useRef } from "react";
import { CanvasPlayer, GameState } from "../_config/canvas-player";

const song_notes: NotePlayer[] = [
  { freq: 220, duration: 500, type: "flat" }, // C4
  { freq: 220, duration: 500, type: "flat" }, // C4
  { freq: 165, duration: 500, type: "flat" }, // G4
  { freq: 165, duration: 500, type: "flat" }, // G4
  { freq: 220, duration: 500, type: "flat" }, // C4
  { freq: 196, duration: 500, type: "flat" }, // A4
  { freq: 165, duration: 1000, type: "flat" }, // G4
  { freq: 146.5, duration: 500, type: "flat" }, // E4
  { freq: 165, duration: 500, type: "flat" }, // G4
  { freq: 196, duration: 500, type: "flat" }, // A4
  { freq: 146.5, duration: 500, type: "flat" }, // E4
  { freq: 220, duration: 1000, type: "flat" }, // C4
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

    const gameState = new GameState(song_notes)

    const canvasPlayer = new CanvasPlayer(canvasRef.current, gameState);

    let start = Date.now();

    setInterval(() => {
      const now = Date.now();
      const diff = now - start;

      if (canvasPlayer.GameState.TotalTimeMs <= diff) {
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
