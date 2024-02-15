"use client";

import useDimension from "@/lib/hooks/useDimension";
import { useEffect, useRef, useState } from "react";
import { MicProcessor } from "../_config/mic-processor";

type Status = {
  ok: boolean;
  freq: number;
};

const NotesSection = () => {
  const [micProcessor, setMicProcessor] = useState<MicProcessor | null>(null);

  const { dimensions, setDimensions } = useDimension();
  const [status, setStatus] = useState<Status | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasContext = canvas?.getContext("2d");

    if (!canvas || !canvasContext) return;

    if (!dimensions) {
      setDimensions({
        width: canvas.clientWidth,
        height: canvas.clientHeight,
      });
      return;
    }

    if (!micProcessor) {
      setMicProcessor(new MicProcessor());
      return;
    }

    micProcessor?.init((getPitch) => {
      const drawAlt = function () {
        const value = getPitch();

        const isSimilar =
          micProcessor?.noteIsSimilarEnough(value, 130.81, 20) || false;

        const frequency = Number(value.toFixed());

        canvasContext?.clearRect(0, 0, dimensions.width, dimensions.height);

        canvasContext.fillStyle = "rgb(0, 0, 0)";
        canvasContext.fillRect(0, 0, dimensions.width, dimensions.height);

        var barWidth = dimensions.width;
        var barHeight = dimensions.height - (frequency % dimensions.height);
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
      }, 1000 / 30);
    });
  }, [dimensions, micProcessor, setDimensions]);
  const value = String(status?.freq);
  return (
    <div>
      <div className="rounded h-20 min-w-0  w-full overflow-hidden  border">
        <canvas
          width={dimensions?.width}
          height={dimensions?.height}
          ref={canvasRef}
          className="w-full h-full "
        />
      </div>
      <div className="text-center">
        {value === "-1" || value === "undefined" ? "-" : value}
      </div>
    </div>
  );
};

export default NotesSection;
