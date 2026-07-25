"use client";

import { useContext, memo } from "react";
import { LoadingContext } from "@/components/basic/LoaderWrapper";

const NavbarWrapper = ({ children }) => {
  const context = useContext(LoadingContext);
  const navReady = context?.navReady ?? false;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-opacity duration-300 ${navReady ? "opacity-100 animate-navbar-enter" : "opacity-0 pointer-events-none"}`}
    >
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md backdrop-saturate-50 border-b border-black/10" />
      <div className="relative">{navReady && children}</div>
    </header>
  );
};

export default memo(NavbarWrapper);
