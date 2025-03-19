import { useEffect, useState } from "react";

type WindowSize = {
  height: number;
  width: number;
};

export default function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>(() => {
    if (typeof window === "undefined") {
      return {
        height: 0,
        width: 0,
      };
    }

    return {
      height: window.innerHeight,
      width: window.innerWidth,
    };
  });

  useEffect(() => {
    const handleSize = (): void => {
      if (
        window.innerWidth !== size.width ||
        window.innerHeight !== size.height
      ) {
        setSize({ height: window.innerHeight, width: window.innerWidth });
      }
    };

    window.addEventListener("resize", handleSize);

    return () => {
      window.removeEventListener("resize", handleSize);
    };
  }, [size]);

  return size;
}
