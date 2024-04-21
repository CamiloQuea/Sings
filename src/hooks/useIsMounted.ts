import React, { useState } from "react";

const useIsMounted = () => {
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    const isMounted = typeof window !== "undefined";
    if (isMounted) {
      setIsMounted(true);
    }
  }, []);

  return isMounted;
};

export default useIsMounted;
