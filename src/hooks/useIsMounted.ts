import React, { useState } from 'react'

const useIsMounted = () => {

    const [isMounted, setIsMounted] = useState(false);

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            setIsMounted(true);
        }
    }, [])

    return isMounted;
}

export default useIsMounted