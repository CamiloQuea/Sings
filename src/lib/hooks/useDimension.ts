import { useState } from 'react'

type Dimensions = {
    height: number;
    width: number;
};

const useDimension = () => {
    const [dimensions, setDimensions] = useState<Dimensions | null>(null);

    return {
        dimensions,
        setDimensions
    }
}

export default useDimension