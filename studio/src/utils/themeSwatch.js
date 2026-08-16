export const getBubbleSceneStyles = (theme) => {
  const isDark = theme === "dark" || theme === "metal";
  const isMetal = theme === "metal";

  const styles = {
    section: isDark ? "bg-black" : "bg-white",
    text: theme === "dark" ? "text-white" : isMetal ? "text-red-500" : "text-neutral-800",
    accent: isMetal ? "text-red-400" : "text-gray-500",
    orbitBorder: isDark ? "border-white/10" : "border-black/10",
    fadeGradient: isDark ? "from-black via-black/90 to-transparent" : "from-white via-white/90 to-transparent",
    subProfileText: isDark ? "text-white/50" : isMetal ? "text-red-500/50" : "text-black/50",
    box: isDark
      ? "bg-white/[0.04] border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      : "bg-black/[0.03] border-black/10 shadow-xl",
  };

  const gridLineColor = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.045)";
  const gridBackground = `linear-gradient(${gridLineColor} 1px, transparent 1px), linear-gradient(90deg, ${gridLineColor} 1px, transparent 1px)`;

  return { isDark, isMetal, styles, gridBackground };
};

// ---

export const getCardStackStyles = (theme) => {
  const isDark = theme === "dark";
  const isMetal = theme === "metal";

  return {
    section: isDark || isMetal ? "bg-black" : "bg-white",
    bgGradient: isMetal
      ? "bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.1),transparent_55%)]"
      : isDark
        ? "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_55%)]"
        : "bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04),transparent_55%)]",
    title: isDark ? "text-white/50" : isMetal ? "text-red-500/50" : "text-black/50",
    desc: isDark ? "text-white/40" : isMetal ? "text-red-500/40" : "text-black/35",

    cardBg: isDark
      ? "bg-[#0a0a0a] border-white/10 shadow-[0_4px_20px_rgba(255,255,255,0.03)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.08)]"
      : isMetal
        ? "bg-[#0a0a0a] border-red-500/30 shadow-[0_4px_20px_rgba(239,68,68,0.05)] hover:shadow-[0_8px_30px_rgba(239,68,68,0.15)]"
        : "bg-white border-neutral-200 shadow-md hover:shadow-xl",
    badge: isDark
      ? "border-white/20 bg-white/5 text-white/55"
      : isMetal
        ? "border-red-500/30 bg-red-500/10 text-red-500/70"
        : "border-black/10 bg-neutral-50 text-black/55",
    cardTitle: isDark ? "text-white" : isMetal ? "text-red-500" : "text-black",
    cardCaption: isDark ? "text-white/45" : isMetal ? "text-red-500/45" : "text-black/45",
    cardDesc: isDark ? "text-white/70" : isMetal ? "text-red-200/70" : "text-black/70",

    button: isDark
      ? "border-white/20 bg-white text-black hover:bg-white/90 shadow-[0_12px_30px_rgba(255,255,255,0.15)]"
      : isMetal
        ? "border-red-500/20 bg-red-500 text-black hover:bg-red-600 shadow-[0_12px_30px_rgba(239,68,68,0.15)]"
        : "border-black/10 bg-black text-white hover:bg-black/90 shadow-[0_12px_30px_rgba(0,0,0,0.18)]",

    footerBorder: isDark ? "border-white/10" : isMetal ? "border-red-500/20" : "border-neutral-100",
    footerLabel: isDark ? "text-white/45" : isMetal ? "text-red-500/45" : "text-black/45",
    footerYear: isDark ? "text-white" : isMetal ? "text-red-500" : "text-black",
  };
};

// ---

export const getCreateInputStyles = (theme) => {
  const isDark = theme === "dark";
  const isMetal = theme === "metal";

  const labelClass = isDark ? "text-white/60" : isMetal ? "text-red-500/60" : "text-neutral-500";
  const inputClass = `mt-2 w-full border px-5 py-4 outline-none transition-colors rounded-none text-sm ${
    isDark
      ? "border-white/20 bg-[#111] text-white focus:border-white"
      : isMetal
        ? "border-red-500/20 bg-[#110000] text-red-500 focus:border-red-500"
        : "border-neutral-300 bg-white text-black focus:border-black"
  }`;

  return { labelClass, inputClass };
};

export const getCreateSomeStyles = (theme) => {
  const isDark = theme === "dark";
  const isMetal = theme === "metal";

  return {
    section: isDark ? "bg-[#0a0a0a] text-white" : isMetal ? "bg-[#050000] text-red-500" : "bg-white text-black",
    textMuted: isDark ? "text-white/40" : isMetal ? "text-red-500/40" : "text-neutral-400",
    textSecondary: isDark ? "text-white/80" : isMetal ? "text-red-400" : "text-neutral-700",
    dividerSoft: isDark ? "border-white/10" : isMetal ? "border-red-500/10" : "border-neutral-100",
    dividerHeavy: isDark ? "border-white" : isMetal ? "border-red-500" : "border-black",

    btnActive: isDark
      ? "bg-white border-white text-black"
      : isMetal
        ? "bg-red-500 border-red-500 text-black"
        : "bg-black border-black text-white",

    btnInactive: isDark
      ? "bg-transparent border-white/20 text-white hover:border-white"
      : isMetal
        ? "bg-transparent border-red-500/25 text-red-500 hover:border-red-500"
        : "bg-white border-neutral-200 text-black hover:border-black",

    selectContainer: isDark
      ? "border-white/20 focus-within:border-white bg-[#111]"
      : isMetal
        ? "border-red-500/20 focus-within:border-red-500 bg-[#110000]"
        : "border-neutral-300 focus-within:border-black bg-white",

    selectOption: isDark ? "bg-[#111] text-white" : isMetal ? "bg-[#110000] text-red-500" : "bg-white text-black",
    selectText: isDark ? "text-white" : isMetal ? "text-red-500" : "text-black",

    textarea: isDark
      ? "border-white/20 bg-[#111] text-white focus:border-white"
      : isMetal
        ? "border-red-500/20 bg-[#110000] text-red-500 focus:border-red-500"
        : "border-neutral-300 bg-white text-black focus:border-black",

    successText: isDark || isMetal ? "text-emerald-400" : "text-emerald-700",
    errorText: isDark || isMetal ? "text-red-400 font-bold" : "text-red-700 font-bold",
    labelClass: isDark ? "text-white/60" : isMetal ? "text-red-500/60" : "text-neutral-500",
  };
};

// ---

export const getDevTickerStyles = (theme) => {
  const dark = theme === "dark";
  const metal = theme === "metal";

  return {
    section: dark
      ? "border-y border-white/10 bg-black text-white selection:bg-white selection:text-black"
      : metal
        ? "border-y border-red-500/20 bg-black text-red-500 selection:bg-red-500 selection:text-black"
        : "border-y border-black/8 bg-white text-slate-900 selection:bg-slate-900 selection:text-white",
    fadeLeft: dark
      ? "bg-linear-to-r from-black via-black/95 to-transparent"
      : metal
        ? "bg-linear-to-r from-black via-black/95 to-transparent"
        : "bg-linear-to-r from-white via-white/95 to-transparent",
    fadeRight: dark
      ? "bg-linear-to-l from-black via-black/95 to-transparent"
      : metal
        ? "bg-linear-to-l from-black via-black/95 to-transparent"
        : "bg-linear-to-l from-white via-white/95 to-transparent",
    text: dark ? "text-white/45" : metal ? "text-red-500/45" : "text-black/45",
    separator: dark ? "text-white/15" : metal ? "text-red-500/20" : "text-black/15",
  };
};

// ---

export const getFooterMarqueeStyles = (theme) => {
  const isDark = theme === "dark";
  const isMetal = theme === "metal";
  const textColor = isDark ? "text-white/90" : isMetal ? "text-red-500" : "text-black/90";
  const dotColor = isDark ? "bg-white/90" : isMetal ? "bg-red-500" : "bg-black/90";

  return { textColor, dotColor };
};

export const getFooterStyles = (theme) => {
  const isDark = theme === "dark";
  const isMetal = theme === "metal";
  const isDarkOrMetal = isDark || isMetal;

  return {
    section: isDarkOrMetal ? "bg-black text-white" : "bg-white text-black",
    footerContainer: isDark ? "bg-[#0a0a0a]" : isMetal ? "bg-[#050000]" : "bg-white",
    textAccent: isDark ? "text-indigo-400" : isMetal ? "text-red-500" : "text-indigo-900",

    cardOuter: isDark ? "bg-white/10" : isMetal ? "bg-red-500/10" : "bg-gray-200",
    cardInner1: isDark ? "bg-white/10" : isMetal ? "bg-red-500/10" : "bg-gray-300",
    cardInner2: isDark ? "bg-black/40" : isMetal ? "bg-black/40" : "bg-gray-200",
    panelBg: isDark ? "bg-[#141414]" : isMetal ? "bg-[#140000]" : "bg-white",
    panelHeader: isDark ? "bg-white/5" : isMetal ? "bg-red-500/5" : "bg-slate-50",
    wrapperBg: isDark ? "bg-white/5" : isMetal ? "bg-red-500/5" : "bg-gray-300",
    footerBottom: isDark ? "bg-[#0a0a0a]" : isMetal ? "bg-[#050000]" : "bg-white",

    border: isDark ? "border-white/10" : isMetal ? "border-red-500/20" : "border-slate-200",
    borderLight: isDark ? "border-white/5" : isMetal ? "border-red-500/10" : "border-slate-50",

    textPrimary: isDark ? "text-white" : isMetal ? "text-red-500" : "text-black",
    textSecondary: isDark ? "text-white/80" : isMetal ? "text-red-400" : "text-black/80",
    textMuted: isDark ? "text-white/50" : isMetal ? "text-red-500/50" : "text-slate-500",

    socialCard: isDark
      ? "bg-neutral-900 hover:bg-neutral-800"
      : isMetal
        ? "bg-[#1a0000] hover:bg-[#2a0000]"
        : "bg-white",
    iconBoxBase: "flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors duration-300",
    iconBox: isDark
      ? "bg-white/10 group-hover:text-indigo-400 text-slate-300"
      : isMetal
        ? "bg-red-500/10 group-hover:text-red-400 text-red-500/80"
        : "bg-slate-100 group-hover:text-indigo-600 text-slate-600",
    buttonBg: isDark
      ? "text-white/50 hover:text-white"
      : isMetal
        ? "text-red-500/50 hover:text-red-500"
        : "text-black/50 hover:text-black",

    gridGlow: isDark ? "bg-white/20" : isMetal ? "bg-red-500/30" : "bg-white",
    imageBlend: isDarkOrMetal ? "invert mix-blend-screen opacity-90" : "mix-blend-multiply opacity-80",

    gridLines: isDark ? "rgba(255,255,255,0.08)" : isMetal ? "rgba(239,68,68,0.15)" : "rgba(0,0,0,0.05)",
    curtain: isDark ? "rgba(255,255,255,0.05)" : isMetal ? "rgba(239,68,68,0.08)" : "rgba(0,0,0,0.05)",
    topOverlay: isDark ? "rgba(255,255,255,0.04)" : isMetal ? "rgba(239,68,68,0.08)" : "rgba(0,0,0,0.04)",
    topBorder: isDark ? "bg-white/10" : isMetal ? "bg-red-500/20" : "bg-black/10",
    isDarkOrMetal,
  };
};

// ---

export const getGraphQlStyles = (theme) => {
  const isDark = theme === "dark";
  const isMetal = theme === "metal";

  const styles = {
    container: isDark ? "bg-[#0a0a0a] text-white" : isMetal ? "bg-[#050000] text-red-500" : "bg-white text-black",
    card: isDark
      ? "bg-[#111] border-white/10"
      : isMetal
        ? "bg-[#110000] border-red-500/20"
        : "bg-white border-gray-200",
    textPrimary: isDark ? "text-white" : isMetal ? "text-red-500" : "text-black",
    textSecondary: isDark ? "text-white/80" : isMetal ? "text-red-400" : "text-black/80",
    textMuted: isDark ? "text-white/50" : isMetal ? "text-red-500/50" : "text-black/50",
    textFaded: isDark ? "text-gray-500" : isMetal ? "text-red-900" : "text-gray-500",
    spinnerBase: "border-2 rounded-full h-4 w-4 animate-spin",
    spinnerColor: isDark
      ? "border-white/20 border-t-white"
      : isMetal
        ? "border-red-500/20 border-t-red-500"
        : "border-gray-300 border-t-black",
  };

  const themeColors = isDark
    ? ["#1f1f1f", "#444444", "#666666", "#999999", "#eeeeee"]
    : isMetal
      ? ["#1a0505", "#4d0a0a", "#991b1b", "#dc2626", "#f87171"]
      : ["#ebedf0", "#cccccc", "#999999", "#555555", "#111111"];

  return { isDark, isMetal, styles, themeColors };
};

// ---

export const getMyExperienceStyles = (isDark, isMetal) => {
  if (isMetal) {
    return {
      section: "bg-[#050000] text-red-500",
      outerBox: "border-red-900/60 bg-[#110000]/80 shadow-[0_0_50px_rgba(239,68,68,0.15)] backdrop-blur-md",
      innerBox: "border-red-950 bg-[#180000]",
      card: "border-red-700 bg-[#220000] text-red-400 hover:border-red-500 shadow-[6px_6px_0px_0px_rgba(239,68,68,0.8)] hover:shadow-[10px_10px_0px_0px_rgba(239,68,68,1)]",
      badge: "border-red-800 bg-red-950 text-red-400",
      cardTitle: "text-red-400 border-red-900",
      cardId: "text-red-950",
      textMuted: "text-red-500/60",
      line: "bg-red-800",
      marqueeBox: "border-red-900/50 bg-[#180000]",
    };
  }

  if (isDark) {
    return {
      section: "bg-[#080808] text-white",
      outerBox: "border-neutral-800 bg-[#111111]/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-md",
      innerBox: "border-neutral-800 bg-[#141414]",
      card: "border-neutral-700 bg-[#1c1c1c] text-white hover:border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,0.9)] hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)]",
      badge: "border-neutral-700 bg-neutral-800 text-neutral-300",
      cardTitle: "text-white border-neutral-700",
      cardId: "text-neutral-700",
      textMuted: "text-neutral-400",
      line: "bg-neutral-700",
      marqueeBox: "border-neutral-800 bg-[#141414]",
    };
  }

  return {
    section: "bg-neutral-50 text-black",
    outerBox: "border-neutral-300 bg-white shadow-2xl",
    innerBox: "border-neutral-200 bg-neutral-100/60",
    card: "border-black bg-white text-black hover:border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]",
    badge: "border-neutral-300 bg-neutral-200 text-neutral-800",
    cardTitle: "text-black border-neutral-300",
    cardId: "text-neutral-300",
    textMuted: "text-neutral-500",
    line: "bg-neutral-300",
    marqueeBox: "border-neutral-300 bg-neutral-100",
  };
};

export const getMarqueeCardStyle = (variant, isDark, isMetal) => {
  const isInverted = variant === "inverted";

  if (isDark) {
    return isInverted
      ? "border-neutral-300 bg-neutral-200 text-black hover:bg-[#1c1c1c] hover:text-white hover:border-neutral-700"
      : "border-neutral-700 bg-[#1c1c1c] text-white hover:bg-neutral-200 hover:text-black hover:border-neutral-300";
  }

  if (isMetal) {
    return isInverted
      ? "border-red-500 bg-red-600 text-black hover:bg-[#220000] hover:text-red-500 hover:border-red-800"
      : "border-red-800 bg-[#220000] text-red-500 hover:bg-red-600 hover:text-black hover:border-red-500";
  }

  return isInverted
    ? "border-black bg-black text-white hover:bg-white hover:text-black hover:border-neutral-400"
    : "border-neutral-400 bg-white text-black hover:bg-black hover:text-white hover:border-black";
};

// ---

export const THEME_STYLES = {
  light: {
    bg: "bg-white",
    textSub: "text-black/50",
    textMain: "text-black",
    textMuted: "text-black/40",
    textHighlight: "text-black/80",
    globeLines: "border-black/80",
    globeEquator: "border-black/80",
    divider: "via-black/15",
    glow: "bg-black/[0.1]",
    trailCard: "shadow-black/10 bg-white/50 border-black/5",
  },
  dark: {
    bg: "bg-black",
    textSub: "text-white/50",
    textMain: "text-white",
    textMuted: "text-white/40",
    textHighlight: "text-white/80",
    globeLines: "border-white/80",
    globeEquator: "border-white/80",
    divider: "via-white/15",
    glow: "bg-white/[0.1]",
    trailCard: "shadow-white/10 bg-black/50 border-white/10",
  },
  metal: {
    bg: "bg-black",
    textSub: "text-red-500/70",
    textMain: "text-red-500",
    textMuted: "text-red-500/50",
    textHighlight: "text-red-500",
    globeLines: "border-red-500/80",
    globeEquator: "border-red-500/80",
    divider: "via-red-500/20",
    glow: "bg-red-500/[0.1]",
    trailCard: "shadow-red-500/20 bg-black/80 border-red-500/20",
  },
};

// ---

export const getNavbarStyles = (theme) => {
  const isDark = theme === "dark";
  const isMetal = theme === "metal";

  const headerBgClass =
    isDark || isMetal
      ? "bg-black/30 supports-backdrop-filter:bg-black/20 border-white/10"
      : "bg-white/30 supports-backdrop-filter:bg-white/20 border-black/10";

  const textColorClass = isMetal ? "text-red-500" : isDark ? "text-white" : "text-black";
  const textMutedClass = isMetal ? "text-red-500/50" : isDark ? "text-white/50" : "text-black/50";

  const mobileNavActiveClass = isMetal
    ? "bg-red-500 text-black"
    : isDark
      ? "bg-white text-black"
      : "bg-black text-white";

  const mobileNavInactiveClass = isMetal
    ? "bg-red-500/10 text-red-500"
    : isDark
      ? "bg-white/10 text-white"
      : "bg-black/10 text-black";

  const consoleSlideClass = isMetal ? "bg-red-500 text-black" : isDark ? "bg-white text-black" : "bg-black text-white";

  const mobileMenuIconGroupClass = isMetal
    ? "border-red-500 group-hover:bg-red-500 text-red-500 group-hover:text-black"
    : isDark
      ? "border-white group-hover:bg-white text-white group-hover:text-black"
      : "border-black group-hover:bg-black text-black group-hover:text-white";

  const marqueeFadeLeft = isDark || isMetal ? "from-black/60" : "from-white/60";
  const marqueeFadeRight = isDark || isMetal ? "from-black/60" : "from-white/60";

  const marqueeDiv1 = isMetal ? "bg-red-500/30" : isDark ? "bg-white/30" : "bg-black/30";
  const marqueeDiv2 = isMetal ? "bg-red-500/60" : isDark ? "bg-white/60" : "bg-black/60";

  const terminalBgClass = isDark || isMetal ? "bg-white/10" : "bg-white/40";
  const terminalHoverClass = isMetal
    ? "hover:bg-red-500 hover:text-black"
    : isDark
      ? "hover:bg-white hover:text-black"
      : "hover:bg-black hover:text-white";

  const logoInvertClass = isDark || isMetal ? "invert brightness-0" : "";

  return {
    isDark,
    isMetal,
    headerBgClass,
    textColorClass,
    textMutedClass,
    mobileNavActiveClass,
    mobileNavInactiveClass,
    consoleSlideClass,
    mobileMenuIconGroupClass,
    marqueeFadeLeft,
    marqueeFadeRight,
    marqueeDiv1,
    marqueeDiv2,
    terminalBgClass,
    terminalHoverClass,
    logoInvertClass,
  };
};

// ---

export const getWorkStyles = (theme) => {
  const isDark = theme === "dark";
  const isMetal = theme === "metal";

  const sectionBg = isDark ? "bg-black text-white" : isMetal ? "bg-[#050000] text-red-500" : "bg-white text-black";
  const headerText = isDark ? "text-white/90" : isMetal ? "text-red-500/90" : "text-black/90";
  const borderColor = isDark ? "border-white/20" : isMetal ? "border-red-500/30" : "border-black";

  const defaultBg = isDark ? "#000000" : isMetal ? "#050000" : "#ffffff";
  const defaultText = isDark ? "#ffffff" : isMetal ? "#ef4444" : "#000000";
  const activeBg = isDark ? "#ffffff" : isMetal ? "#ef4444" : "#000000";
  const activeText = isDark ? "#000000" : isMetal ? "#050000" : "#ffffff";

  return { isDark, isMetal, sectionBg, headerText, borderColor, defaultBg, defaultText, activeBg, activeText };
};

export const getWorkFloatStyles = (theme) => {
  const isDark = theme === "dark";
  const isMetal = theme === "metal";

  const cardBgClass = isDark
    ? "bg-black border-white/10 text-white"
    : isMetal
      ? "bg-[#050000] border-red-500/30 text-red-500"
      : "bg-white border-black/10 text-black";
  const gradientOverlay =
    isDark || isMetal
      ? "bg-linear-to-b from-black/10 via-black/30 to-black/90"
      : "bg-linear-to-b from-white/10 via-white/50 to-white/95";

  const accentGlow = isDark ? "rgba(255,255,255,0.18)" : isMetal ? "rgba(239,68,68,0.25)" : "rgba(0,0,0,0.1)";
  const patternOverlay =
    isDark || isMetal
      ? "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]"
      : "bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.04),transparent_30%)]";

  const textBody = isDark ? "text-white/80" : isMetal ? "text-red-400" : "text-black/80";
  const tagClass = isDark
    ? "border-white/20"
    : isMetal
      ? "border-red-500/30 bg-red-500/10"
      : "border-black/20 bg-black/5";
  const btnClass = isMetal ? "border-red-600 bg-red-600 text-white" : "border-white bg-[#f97316] text-black";

  return { cardBgClass, gradientOverlay, accentGlow, patternOverlay, textBody, tagClass, btnClass };
};

export const getWorkMobile = (theme) => {
  const isDark = theme === "dark";
  const isMetal = theme === "metal";

  const modalBg = isDark ? "bg-[#111111] text-white" : isMetal ? "bg-[#110000] text-red-500" : "bg-white text-black";
  const overlayBg = isDark || isMetal ? "bg-black/60" : "bg-black/40";
  const borderClass = isDark ? "border-white/10" : isMetal ? "border-red-500/20" : "border-black/10";
  const textMuted = isDark ? "text-white/50" : isMetal ? "text-red-500/50" : "text-black/50";
  const textBody = isDark ? "text-white/80" : isMetal ? "text-red-400" : "text-black/80";
  const tagClass = isDark
    ? "border-white/20 bg-white/5"
    : isMetal
      ? "border-red-500/20 bg-red-500/10"
      : "border-black/20 bg-black/5";
  const closeBtn = isDark
    ? "bg-white/10 active:bg-white/20"
    : isMetal
      ? "bg-red-500/10 active:bg-red-500/20 text-red-500"
      : "bg-black/5 active:bg-black/10";
  const ctaBtn = isMetal ? "bg-red-600 text-white" : "bg-[#f97316] text-black";

  return { modalBg, overlayBg, borderClass, textMuted, textBody, tagClass, closeBtn, ctaBtn };
};

// ---

export const getProfileMarqueeStyles = (theme) => {
  const isDark = theme === "dark";
  const isMetal = theme === "metal";
  const textColorClass = isDark ? "text-white" : isMetal ? "text-red-500" : "text-slate-900";
  const iconColorClass = isDark ? "text-white/80" : isMetal ? "text-red-500/80" : "text-black/80";

  return { textColorClass, iconColorClass };
};

export const getProfileStyles = (theme) => {
  const dark = theme === "dark";
  const metal = theme === "metal";

  return {
    section: dark
      ? "bg-black text-white selection:bg-white selection:text-black"
      : metal
        ? "bg-black text-red-500 selection:bg-red-500 selection:text-black"
        : "bg-white text-slate-900 selection:bg-slate-900 selection:text-white",
    h1Main: dark ? "text-white" : metal ? "text-red-500" : "text-black",
    h1Sub: dark ? "text-white/90" : metal ? "text-red-500/90" : "text-black/90",
    h2Sub: dark ? "text-white/95" : metal ? "text-red-500/95" : "text-black/95",
    pSub: dark ? "text-white/45" : metal ? "text-red-500/45" : "text-black/45",
    subProfileText: dark ? "text-white/50" : metal ? "text-red-500/50" : "text-black/50",
    coordsGroup: dark ? "text-white/35" : metal ? "text-red-500/35" : "text-black/35",
    coordDatePre: dark ? "text-white/45" : metal ? "text-red-500/45" : "text-black/45",
    coordDate: dark ? "text-white/70" : metal ? "text-red-500/70" : "text-black/70",
    lineStatic: dark ? "bg-white/10" : metal ? "bg-red-500/20" : "bg-black/6",
    lineAnim: dark ? "bg-white/60" : metal ? "bg-red-500/60" : "bg-black/40",
    lineStaticThin: dark ? "bg-white/10" : metal ? "bg-red-500/10" : "bg-black/8",
    gridLines: dark ? "rgba(255, 255, 255, 0.1)" : metal ? "rgba(239, 68, 68, 0.1)" : "rgba(148, 163, 184, 0.1)",
    cardBg: dark ? "bg-black border-white/20" : metal ? "bg-black border-red-500/30" : "bg-white border-slate-200/80",
    textBody: dark ? "text-white/70" : metal ? "text-red-500/70" : "text-slate-600",
    textHighlight: dark ? "text-white" : metal ? "text-red-500" : "text-slate-900",
    textHighlightBg: dark ? "bg-white text-black" : metal ? "bg-red-500 text-black" : "bg-slate-100 text-slate-950",
    underline: dark ? "decoration-white/50" : metal ? "decoration-red-500/50" : "decoration-slate-300",
    nodeStatus: dark
      ? "border-white/20 bg-black"
      : metal
        ? "border-red-500/20 bg-black"
        : "border-slate-100 bg-slate-950",
    nodeStatusText: dark
      ? "text-white/70 border-white/20 bg-black/60"
      : metal
        ? "text-red-500 border-red-500/20 bg-black/60"
        : "text-slate-300 border-white/10 bg-black/60",
    mainCard: dark ? "bg-black border-white" : metal ? "bg-black border-red-500" : "bg-white border-slate-900",
    borderCorner: dark ? "border-white" : metal ? "border-red-500" : "border-slate-900",
    workflowBox: dark
      ? "bg-white/5 border-white"
      : metal
        ? "bg-red-950/20 border-red-500"
        : "bg-slate-50/80 border-slate-900",
    workflowLabel: dark ? "text-white/60" : metal ? "text-red-500/60" : "text-slate-500",
    workflowText: dark ? "text-white/90" : metal ? "text-red-500/90" : "text-slate-700",
    workflowArrow: dark ? "text-white/50" : metal ? "text-red-500/50" : "text-black/60",
    hoverCard: dark
      ? "bg-white/5 border-white/20 hover:border-white"
      : metal
        ? "bg-red-950/10 border-red-500/20 hover:border-red-500"
        : "bg-slate-50/40 border-slate-200 hover:border-slate-400",
    hoverCardText: dark
      ? "text-white/60 group-hover:text-white"
      : metal
        ? "text-red-500/60 group-hover:text-red-500"
        : "text-slate-600 group-hover:text-slate-900",
    imgCardContainer: dark
      ? "border-white/20 bg-black"
      : metal
        ? "border-red-500/30 bg-black"
        : "border-slate-200 bg-slate-50",
    imgPlaceholder: dark ? "bg-white/10" : metal ? "bg-red-500/10" : "bg-slate-200",
    sysPanel: dark
      ? "bg-black/90 border-white/20 text-white"
      : metal
        ? "bg-black/90 border-red-500/30 text-red-500"
        : "bg-slate-900/90 border-slate-700/50 text-white",
    sysDot: metal ? "bg-red-500" : "bg-emerald-400",
    sysHeader: dark ? "text-white/90" : metal ? "text-red-500/90" : "text-slate-200",
    sysText: dark ? "text-white/50" : metal ? "text-red-500/50" : "text-slate-400",
    marqueeBorder: dark ? "border-white/20" : metal ? "border-red-500/30" : "border-slate-200/80",
    textH3: dark ? "text-white/90" : metal ? "text-red-500/90" : "text-slate-800",
  };
};

// ---

export const getTrailStyles = (theme) => {
  const isDark = theme === "dark";
  const isMetal = theme === "metal";

  return {
    wrapper: isDark ? "bg-[#0a0a0a]" : isMetal ? "bg-black" : "bg-white",

    container: isDark
      ? "bg-[#0a0a0a] border-white/10 hover:border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.9)]"
      : isMetal
        ? "bg-black border-red-500/20 hover:border-red-500/40 shadow-[0_8px_30px_rgba(0,0,0,0.9)]"
        : "bg-white border-neutral-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]",

    rankBox: isDark
      ? "bg-[#0a0a0a] border-white/10"
      : isMetal
        ? "bg-black border-red-500/20"
        : "bg-linear-to-b from-white to-neutral-50/50 border-neutral-100",

    rankGlow: isDark ? "bg-neutral-800/20" : isMetal ? "bg-red-950/30" : "bg-blue-400/10",
    rankTitle: isDark ? "text-white" : isMetal ? "text-red-500" : "text-neutral-800",

    divider: isDark ? "bg-white/10" : isMetal ? "bg-red-500/20" : "bg-neutral-100",

    statValue: isDark ? "text-white" : isMetal ? "text-red-500" : "text-neutral-900",
    statLabel: isDark ? "text-white/40" : isMetal ? "text-red-500/50" : "text-neutral-400",

    marqueeBox: isDark
      ? "bg-[#0a0a0a] border-white/10"
      : isMetal
        ? "bg-black border-red-500/20"
        : "bg-neutral-50/40 border-neutral-100",

    imageFilter: isDark || isMetal ? "drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]" : "drop-shadow-sm",
  };
};

// ---

export const getButtonStyles = (theme) => {
  const isDark = theme === "dark";
  const isMetal = theme === "metal";

  return {
    containerBorder: isDark
      ? "border-white/20 bg-[#0a0a0a]"
      : isMetal
        ? "border-red-600/40 bg-[#050000]"
        : "border-zinc-300 bg-white",

    baseMain: isDark ? "bg-white text-black" : isMetal ? "bg-red-600 text-black font-black" : "bg-zinc-900 text-white",

    baseSide: isDark
      ? "bg-neutral-200 text-black border-black/10"
      : isMetal
        ? "bg-red-700 text-black border-black/20"
        : "bg-zinc-800 text-white border-white/10",

    hoverMain: isDark
      ? "bg-[#1c1c1c] text-white"
      : isMetal
        ? "bg-[#110000] text-red-500 font-black"
        : "bg-white text-black",

    hoverSide: isDark
      ? "bg-[#111] text-white border-white/10"
      : isMetal
        ? "bg-[#050000] text-red-500 border-red-500/20"
        : "bg-black text-white border-black/10",
  };
};

// ---

export const getEmergencyStyles = (theme) => {
  const isDark = theme === "dark";
  const isMetal = theme === "metal";
  const isDarkOrMetal = isDark || isMetal;

  return {
    bg: isDarkOrMetal ? "bg-black" : "bg-white",
    text: isMetal
      ? "text-red-500 group-hover:text-red-400 decoration-red-500"
      : isDark
        ? "text-white group-hover:text-gray-500 decoration-white"
        : "text-black group-hover:text-gray-500 decoration-black",
    image: isDarkOrMetal ? "invert mix-blend-screen" : "mix-blend-multiply",
  };
};

// ---

export const getThemeTransforms = (theme) => {
  const isDark = theme === "dark";
  const isMetal = theme === "metal";

  if (isDark) {
    return {
      bg: ["rgba(10,10,10,0.42)", "rgba(10,10,10,0.98)"],
      border: ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.15)"],
      shadow: ["0 30px 80px rgba(0,0,0,0.5)", "0 40px 120px rgba(255,255,255,0.08)"],
    };
  }

  if (isMetal) {
    return {
      bg: ["rgba(10,10,10,0.42)", "rgba(10,10,10,0.98)"],
      border: ["rgba(239,68,68,0.15)", "rgba(239,68,68,0.30)"],
      shadow: ["0 30px 80px rgba(0,0,0,0.5)", "0 40px 120px rgba(239,68,68,0.15)"],
    };
  }

  return {
    bg: ["rgba(255,255,255,0.42)", "rgba(255,255,255,0.98)"],
    border: ["rgba(255,255,255,0.70)", "rgba(0,0,0,0.08)"],
    shadow: ["0 30px 80px rgba(0,0,0,0.08)", "0 40px 120px rgba(0,0,0,0.14)"],
  };
};

export const getFloatingCardStyles = (theme) => {
  const isDark = theme === "dark";
  const isMetal = theme === "metal";

  return {
    badge: isDark
      ? "border-white/20 bg-black/40 text-white/55"
      : isMetal
        ? "border-red-500/30 bg-black/40 text-red-500/70"
        : "border-black/10 bg-white/70 text-black/55",
    title: isDark ? "text-white" : isMetal ? "text-red-500" : "text-black",
    caption: isDark ? "text-white/45" : isMetal ? "text-red-500/45" : "text-black/45",
    desc: isDark ? "text-white/70" : isMetal ? "text-red-200/70" : "text-black/68",
    divider: isDark ? "bg-white/10" : isMetal ? "bg-red-500/20" : "bg-black/10",
    button: isDark
      ? "border-white/20 bg-white text-black hover:bg-white/90 shadow-[0_12px_30px_rgba(255,255,255,0.15)]"
      : isMetal
        ? "border-red-500/20 bg-red-500 text-black hover:bg-red-600 shadow-[0_12px_30px_rgba(239,68,68,0.15)]"
        : "border-black/10 bg-black text-white hover:bg-black/90 shadow-[0_12px_30px_rgba(0,0,0,0.18)]",
  };
};

// ---

export const getLimpModalStyles = (theme) => {
  const isDark = theme === "dark";
  const isMetal = theme === "metal";

  return {
    modalBox: isDark
      ? "bg-[#0a0a0a] border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.5)]"
      : isMetal
        ? "bg-black border-red-500/20 shadow-[0_25px_80px_rgba(0,0,0,0.8)]"
        : "bg-white border-neutral-200 shadow-[0_25px_80px_rgba(0,0,0,0.08)]",

    title: isDark ? "text-white" : isMetal ? "text-red-500" : "text-black",
    description: isDark ? "text-white/60" : isMetal ? "text-red-500/70" : "text-gray-500",

    line1: isMetal ? "via-red-500" : "via-cyan-500",
    line2: isMetal ? "via-red-800" : "via-purple-500",
  };
};

// ---

export const getLoaderStyles = (theme) => {
  const isDark = theme === "dark";
  const isMetal = theme === "metal";

  const bgColorClass = isDark || isMetal ? "bg-black" : "bg-white";
  const textColorClass = isMetal ? "text-red-500" : isDark ? "text-white" : "text-black";
  const textFadedClass = isMetal ? "text-red-500/40" : isDark ? "text-white/40" : "text-black/40";
  const progressBgClass = isMetal ? "bg-red-500/20" : isDark ? "bg-white/20" : "bg-black/10";
  const progressFillClass = isMetal ? "bg-red-500" : isDark ? "bg-white" : "bg-black";

  return { bgColorClass, textColorClass, textFadedClass, progressBgClass, progressFillClass };
};

// ---

export const getLocationStyles = (theme) => {
  const isDark = theme === "dark";
  const isMetal = theme === "metal";

  return {
    modalBox: isDark
      ? "bg-[#0a0a0a] border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.5)]"
      : isMetal
        ? "bg-black border-red-500/20 shadow-[0_25px_80px_rgba(0,0,0,0.8)]"
        : "bg-white border-neutral-200 shadow-[0_25px_80px_rgba(0,0,0,0.08)]",

    title: isDark ? "text-white" : isMetal ? "text-red-500" : "text-gray-900",
    description: isDark ? "text-white/60" : isMetal ? "text-red-500/70" : "text-gray-600",

    optionCard: isDark
      ? "border-white/10 bg-white/[0.02]"
      : isMetal
        ? "border-red-500/20 bg-red-950/10"
        : "border-zinc-200 bg-zinc-50/50",

    optionText: isDark ? "text-white/40" : isMetal ? "text-red-500/50" : "text-gray-500",
  };
};

// ---

export const getPageRevealStyles = (theme) => {
  const bgColor = theme === "metal" ? "bg-red-500" : "bg-black";

  return { bgColor };
};
