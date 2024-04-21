"use client";

import { useEffect, useRef, useState } from "react";
import { GraphProcessor } from "../_config/graph-processor";

const GraphSection = () => {
  const [graphProcessor, setGraphProcessor] = useState<GraphProcessor | null>(
    null,
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);

  //   const dimensions = useCanvasDimension(canvasRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasContext = canvas?.getContext("2d");

    if (!canvas || !canvasContext) return;

    if (!graphProcessor) {
      setGraphProcessor(new GraphProcessor());
      return;
    }
    const analyser = graphProcessor.init();
    analyser.fftSize = 128;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      requestAnimationFrame(draw);
      // console.log("first");
      const width = canvas.width;
      const height = canvas.height;
      analyser.getByteFrequencyData(dataArray);

      canvasContext.fillStyle = "black";
      canvasContext.fillRect(0, 0, width, height);

      const barWidth = width / bufferLength;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        if (typeof barHeight === "undefined") {
          continue;
        }

        // console.log(barHeight);
        canvasContext.fillStyle = `white`;
        canvasContext.fillRect(
          x,
          height - barHeight / 3,
          barWidth,
          barHeight / 2,
        );

        x += barWidth;
      }
    };
    draw();
  }, [graphProcessor]);

  return (
    <>
      <div className="h-20 w-full min-w-0 overflow-hidden rounded  border ">
        <canvas ref={canvasRef} className="h-full w-full " />
      </div>
    </>
  );
};

export default GraphSection;
