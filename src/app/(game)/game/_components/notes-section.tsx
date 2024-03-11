"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { NoteMicProcessor } from "../_config/note-mic-processor";
import useIsMounted from "@/hooks/useIsMounted";

type Status = {
  ok: boolean;
  freq: number;
};

const getFpsMs = (fps: number) => {
  return 1000 / fps;
};

const NotesSection = () => {
  const micNoteRef = useRef<NoteMicProcessor>();

  const isMounted = useIsMounted();

  const [status, setStatus] = useState<Status | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isMounted) {
      initializeGraph();
      return () => {
        micNoteRef.current = undefined;
      };
    }
  }, [isMounted]);
  const value = String(status?.freq);

  const initializeGraph = () => {
    if (micNoteRef.current) {
      return;
    }

    micNoteRef.current = new NoteMicProcessor();

    const canvas = canvasRef.current;
    const canvasContext = canvas?.getContext("2d");

    if (!canvas || !canvasContext) return;

    const micNote = micNoteRef.current.init();

    const drawAlt = function () {
      const value = micNote.getPitch();

      const width = canvas.width;
      const height = canvas.height;
      // console.log(value);
      const isSimilar =
        micNoteRef.current?.noteIsSimilarEnough(value, 130.81, 20) || false;

      const frequency = Number(value.toFixed());

      canvasContext?.clearRect(0, 0, width, height);

      canvasContext.fillStyle = "black";
      canvasContext.fillRect(0, 0, width, height);

      var barWidth = width;
      var barHeight = height - (frequency % height);
      var x = 0;

      canvasContext.fillStyle = "rgb(" + (frequency * 0.4 + 50) + ",50,50)";
      canvasContext.fillRect(x, barHeight, barWidth, 20);

      setStatus({
        freq: frequency,
        ok: isSimilar,
      });
    };
    setInterval(() => {
      drawAlt();
    }, getFpsMs(60));
  };

  return (
    <div>
      <div className="rounded h-20 min-w-0  w-full overflow-hidden  border">
        <canvas ref={canvasRef} className="w-full h-full " />
      </div>
      <div className="text-center">
        {value === "-1" || value === "undefined" ? "-" : value}
      </div>
      {/* <button onClick={start}>start</button> */}
    </div>
  );
};

export default NotesSection;
