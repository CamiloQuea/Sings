import React, { Ref, RefObject, useEffect, useState } from 'react'

type Dimensions = {
    height: number;
    width: number;
};

const useCanvasDimension = (canvasRef: RefObject<HTMLCanvasElement>) => {

    const [dimensions, setDimensions] = useState<Dimensions>({
        height: -1,
        width: -1
    })

    useEffect(() => {
        const canvas = canvasRef.current;;

        if (!canvas || !window) return;

        setDimensions({
            height: canvas.clientHeight,
            width: canvas.clientWidth
        })

        // handleResize();

        window?.addEventListener("resize", (e) => {
            setDimensions({
                height: canvas.clientHeight,
                width: canvas.clientWidth
            })
        });

        return () => {
            window.addEventListener("resize", (e) => {
                setDimensions({
                    height: -1,
                    width: -1
                })
            })
        };
    }, []);




    return dimensions
}

export default useCanvasDimension