import { useEffect, useState } from "react";

export const useDelay = (delay: number) => {
  const [isDelayed, setIsDelayed] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsDelayed(true);
    }, delay);
  }, [delay]);
  return isDelayed;
};
