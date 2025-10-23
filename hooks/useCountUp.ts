import { useState, useEffect } from 'react';

export const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration / frameRate);

  useEffect(() => {
    // If the target is 0, just set it and don't start the interval.
    if (end === 0) {
      setCount(0);
      return;
    }

    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentCount = Math.round(end * progress);
      
      setCount(currentCount > end ? end : currentCount);

      if (frame >= totalFrames) {
        clearInterval(counter);
        // Ensure the final count is exactly the target number.
        setCount(end);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [end, duration, totalFrames]);

  return count;
};