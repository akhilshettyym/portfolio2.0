import { useState, useEffect } from "react";

export function useDeviceType() {
  const [device, setDevice] = useState({
    isMobile: false,
    isCompactDevice: false,
    isLargeDevice: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setDevice({
        isMobile: width < 1024,
        isCompactDevice: width >= 1024 && width <= 1366,
        isLargeDevice: width > 1366,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return device;
}
