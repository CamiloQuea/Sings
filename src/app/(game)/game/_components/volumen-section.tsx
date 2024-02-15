"use client";

import useCanvasDimension from "@/lib/hooks/useCanvasDimension";
import useDimension from "@/lib/hooks/useDimension";
import React, { useEffect, useRef, useState } from "react";
import { MicProcessor } from "../_config/mic-processor";
import { GraphProcessor } from "../_config/graph-processor";

const VolumeSection = () => {
  const [graphProcessor, setGraphProcessor] = useState<GraphProcessor | null>(
    null
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);

  //   const dimensions = useCanvasDimension(canvasRef);
  function log10(x: number) {
    return Math.log(x) / Math.LN10;
  }
  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasContext = canvas?.getContext("2d");

    if (!canvas || !canvasContext) return;

    if (!graphProcessor) {
      setGraphProcessor(new GraphProcessor());
      return;
    }

    // console.log(dimensions);
    const analyzer = graphProcessor.init();

    const dataArray = new Uint8Array(analyzer.frequencyBinCount);

    const draw = () => {
      analyzer.getByteFrequencyData(dataArray);

      const width = canvas.width;
      const height = canvas.height;

      canvasContext?.clearRect(0, 0, width, height);

      let sum = 0;
      dataArray.forEach((amplitude) => {
        sum += amplitude * amplitude;
      });

      let volume = Math.sqrt(sum / dataArray.length);

      const decibel_level = 20 * log10(volume);

      volume = Math.pow(10, decibel_level / 20);

      // console.log(volume);

      canvasContext.fillStyle = `rgb(${(volume / 50 + 0.2) * 256}, 30, 30)`;
      canvasContext.fillRect(
        0,
        height - height * (volume / 25),
        width,
        height * (volume / 25)
      );
    };
    setInterval(() => {
      draw();
    }, 1000 / 60);
  }, [graphProcessor]);

  return (
    <>
      <div className="rounded h-20 min-w-0  w-full overflow-hidden  border ">
        <canvas ref={canvasRef} className="w-full h-full " />
      </div>
    </>
  );
};

export default VolumeSection;
