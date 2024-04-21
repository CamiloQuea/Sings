"use client";

import { ElementRef, useEffect, useRef, useState } from "react";
import { GraphProcessor } from "../_config/graph-processor";

const WaveSection = () => {
  const [graphProcessor, setGraphProcessor] = useState<GraphProcessor | null>(
    null,
  );
  // const { dimensions, setDimensions } = useDimension();

  const canvasRef = useRef<ElementRef<"canvas">>(null);

  //   const dimensions = useCanvasDimension(canvasRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasContext = canvas?.getContext("2d");

    if (!canvas || !canvasContext || canvasContext === null) return;

    if (!graphProcessor) {
      setGraphProcessor(new GraphProcessor());
      return;
    }

    const analyser = graphProcessor.init();
    analyser.fftSize = 2048;
    const bufferLength = analyser.fftSize;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    // analyzer.getByteFrequencyData(dataArray);
    // console.log(dataArray);

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      analyser.getByteTimeDomainData(dataArray);

      canvasContext.fillStyle = "rgb(0 0 0)";
      canvasContext.fillRect(0, 0, width, height);

      canvasContext.lineWidth = 1;
      canvasContext.strokeStyle = "rgb(256 256 256)";

      const sliceWidth = (width * 2) / bufferLength;
      let x = 0;

      canvasContext.beginPath();
      for (let i = 0; i < bufferLength; i++) {
        const value = dataArray[i];

        if (typeof value === "undefined") {
          continue;
        }

        const v = value / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          canvasContext.moveTo(x, y);
        } else {
          canvasContext.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasContext.lineTo(width, height / 2);
      canvasContext.stroke();
    };
    setInterval(() => {
      draw();
    }, 1000 / 60);
  }, [graphProcessor]);

  return (
    <>
      <div className="h-20 w-full min-w-0 overflow-hidden rounded  border ">
        <canvas ref={canvasRef} className="h-full w-full " />
      </div>
    </>
  );
};

export default WaveSection;
