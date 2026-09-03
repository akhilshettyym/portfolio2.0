import { useState, useEffect } from "react";

export function useDeviceType() {
  const [device, setDevice] = useState({
    isTab: false,
    isMobile: false,
    isTab: false,
    isCompactDevice: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      setDevice({
        isMobile: width < 1024,
        isLargeDevice: width > 1366,
        isTab: width >= 768 && width <= 1024,
        isCompactDevice: width >= 1024 && width <= 1366,
      });
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return device;
}
