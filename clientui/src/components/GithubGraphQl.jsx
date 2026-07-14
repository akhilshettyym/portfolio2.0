"use client";

import { FaGitAlt } from "react-icons/fa";
import { MONTHS } from "@/utils/basic-utils";
import { GiRaiseZombie } from "react-icons/gi";
import { DiCoffeescript } from "react-icons/di";
import { useDeviceType } from "@/hooks/useDeviceType";
import { getCachedOrFetch, getCachedData } from "@/utils/cache-utils";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { motion, animate, AnimatePresence, useMotionValue } from "framer-motion";

const GithubGraphQlComponent = ({ username = "akhilshettyym" }) => {
  const { isMobile } = useDeviceType();
  const { isTier2 } = usePerformanceTier();

  // Guard against hydration mismatches
  const [mounted, setMounted] = useState(false);

  const [total, setTotal] = useState(0);
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const motionTotal = useMotionValue(0);

  const panelRef = useRef(null);
  const [aiDisplay, setAiDisplay] = useState("100M+");
  const [coffeeDisplay, setCoffeeDisplay] = useState("2.9k+");
  const [commitDisplay, setCommitDisplay] = useState("0");
  const [aiNotif, setAiNotif] = useState(null);
  const [coffeeNotif, setCoffeeNotif] = useState(null);
  const [commitNotif, setCommitNotif] = useState(null);

  // Set mounted flag on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  const range = useMemo(() => {
    // Return a stable placeholder during SSR to prevent hydration errors
    if (!mounted) return { from: "", to: "" };

    const currentDate = new Date();
    const end = new Date(currentDate);
    const start = new Date(currentDate);

    if (isMobile) {
      start.setDate(start.getDate() - 100);
    } else {
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
      start.setMonth(start.getMonth() - 11);
      start.setDate(1);
    }

    return {
      from: start.toISOString(),
      to: end.toISOString(),
    };
  }, [mounted, isMobile]);

  // Initialize state from cache immediately once mounted
  useEffect(() => {
    if (!mounted || !range.from) return;

    const cacheKey = `github:${username}:${range.from}:${range.to}`;
    const cachedData = getCachedData(cacheKey);

    if (cachedData) {
      const calendar = cachedData?.data?.user?.contributionsCollection?.contributionCalendar;
      if (calendar) {
        setWeeks(calendar.weeks || []);
        setTotal(calendar.totalContributions || 0);
        setLoading(false);
      }
    }
  }, [username, range, mounted]);

  useEffect(() => {
    if (isTier2) return undefined;

    const controls = animate(motionTotal, total, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (latest) => {
        setCommitDisplay(Math.round(latest).toString());
      },
    });
    return () => controls.stop();
  }, [total, motionTotal, isTier2]);

  const displayedCommitCount = isTier2 ? total.toString() : commitDisplay;

  // Primary fetch effect
  useEffect(() => {
    if (!mounted || !range.from) return;

    let active = true;
    const abortController = new AbortController();

    const fetchContributions = async () => {
      try {
        const params = new URLSearchParams({ username, from: range.from, to: range.to });
        const cacheKey = `github:${username}:${range.from}:${range.to}`;

        const hasCachedData = getCachedData(cacheKey);
        if (!hasCachedData) {
          setLoading(true);
        }

        const responseData = await getCachedOrFetch(cacheKey, async () => {
          const response = await fetch(`/api/github?${params.toString()}`, {
            signal: abortController.signal,
            next: { revalidate: 43200 },
          });

          if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}`);
          }
          return response.json();
        });

        if (!active || !responseData) return;

        const calendar = responseData?.data?.user?.contributionsCollection?.contributionCalendar;
        setWeeks(calendar?.weeks || []);
        setTotal(calendar?.totalContributions || 0);

      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("GitHub contributions fetch failed:", err.message);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchContributions();
    return () => {
      active = false;
      abortController.abort();
    };
  }, [username, range, mounted]);

  const monthLabels = useMemo(() => {
    if (!mounted) return [];
    const labels = [];
    const renderedMonths = new Set();

    weeks.forEach((week, index) => {
      const contributionDays = week.contributionDays;
      if (!contributionDays?.length) return;

      const visibleDay = contributionDays.find((day) => {
        const date = new Date(day.date);
        return date >= new Date(range.from) && date <= new Date(range.to);
      });

      if (!visibleDay) return;

      const d = new Date(visibleDay.date);
      const month = d.getMonth();
      const year = d.getFullYear();
      const key = `${month}-${year}`;

      if (!renderedMonths.has(key)) {
        renderedMonths.add(key);
        labels.push({ index, label: MONTHS[month] });
      }
    });

    return labels;
  }, [weeks, range, mounted]);

  const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

  const triggerGlitch = (finalText, setter) => {
    if (isTier2) {
      setter(finalText);
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      const glitched = finalText
        .split("")
        .map((char, index) => {
          if (char === "." || char === "+") return char;
          if (index < iteration) return finalText[index];
          return randomChars[Math.floor(Math.random() * randomChars.length)];
        })
        .join("");
      setter(glitched);
      iteration += 1 / 2.5;

      if (iteration >= finalText.length) {
        setter(finalText);
        clearInterval(interval);
      }
    }, 35);
  };

  useEffect(() => {
    if (!panelRef.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.12 },
    );
    observer.observe(panelRef.current);

    return () => observer.disconnect();
  }, [mounted]);

  useEffect(() => {
    if (!isVisible || isTier2) return undefined;

    const createNotification = (setter, max) => {
      const value = Math.floor(Math.random() * max) + 1;
      setter({ id: Date.now() + Math.random(), value });

      setTimeout(() => {
        setter(null);
      }, 500);
    };

    const aiInterval = setInterval(() => {
      createNotification(setAiNotif, 100);
    }, 5000);

    const coffeeInterval = setInterval(() => {
      createNotification(setCoffeeNotif, 10);
    }, 3500);

    const commitInterval = setInterval(() => {
      createNotification(setCommitNotif, 10);
    }, 3000);

    return () => {
      clearInterval(aiInterval);
      clearInterval(coffeeInterval);
      clearInterval(commitInterval);
    };
  }, [isTier2, isVisible]);

  // Don't render anything structurally sensitive until mounted on the client
  if (!mounted) {
    return (
      <div className="w-full min-h-60 flex items-center justify-center bg-white">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
      </div>
    );
  }

  const themeColors = ["#ebedf0", "#cccccc", "#999999", "#555555", "#111111"];

  const renderMobile = () => {
    return (
      <div className="mb-5 grid grid-cols-3 gap-4 uppercase">
        <div className="relative flex flex-col items-center justify-center px-5 py-5 text-center">
          <AnimatePresence>
            {aiNotif && (
              <motion.div key={aiNotif.id}
                initial={{ opacity: 0, y: 8, scale: 0.8 }}
                animate={{ opacity: 1, y: -12, scale: 1 }}
                exit={{ opacity: 0, y: -24, scale: 1.5 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute top-3 right-12 text-[10px] font-semibold text-black">
                +{aiNotif.value}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.p onHoverStart={() => triggerGlitch("100M+", setAiDisplay)} className="cursor-default text-[15px] font-black tracking-tight text-black/80">
            {aiDisplay}
          </motion.p>

          <p className="flex items-center mt-1 text-[10px] font-bold tracking-tight text-black/50">
            AI tokens used
          </p>
        </div>

        <div className="relative flex flex-col items-center justify-center px-5 py-5 text-center">
          <AnimatePresence>
            {coffeeNotif && (
              <motion.div key={coffeeNotif.id}
                initial={{ opacity: 0, y: 8, scale: 0.8 }}
                animate={{ opacity: 1, y: -12, scale: 1 }}
                exit={{ opacity: 0, y: -24, scale: 1.5 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute top-3 right-12 text-[10px] font-semibold text-gray-500">
                +{coffeeNotif.value}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.p onHoverStart={() => triggerGlitch("2.9k+", setCoffeeDisplay)} className="cursor-default text-[15px] font-black tracking-tight text-black/80">
            {coffeeDisplay}
          </motion.p>

          <p className="flex items-center mt-1 text-[10px] font-bold tracking-tight text-black/50">
            Coffees drank
          </p>
        </div>

        <div className="relative flex flex-col items-center justify-center px-5 py-5 text-center">
          <AnimatePresence>
            {commitNotif && (
              <motion.div key={commitNotif.id}
                initial={{ opacity: 0, y: 8, scale: 0.8 }}
                animate={{ opacity: 1, y: -12, scale: 1 }}
                exit={{ opacity: 0, y: -24, scale: 1.5 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute top-3 right-12 text-[11px] font-semibold text-gray-500">
                +{commitNotif.value}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.p onHoverStart={() => triggerGlitch(total.toString(), setCommitDisplay)} className="cursor-default text-[15px] font-black tracking-tight text-black">
            {displayedCommitCount}
          </motion.p>

          <p className="flex items-center mt-1 text-[10px] font-bold tracking-wider text-black/50">
            Code Commits
          </p>
        </div>
      </div>
    )
  }

  return (
    <motion.div ref={panelRef}
      initial={false}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: isTier2 ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full p-6 md:p-8 bg-white text-black">

      {isMobile ? (renderMobile()) : (
        <div className="mb-5 grid grid-cols-1 sm:grid-cols-3 gap-4 uppercase">
          <div className="relative flex flex-col items-center justify-center px-5 py-5 text-center">
            <AnimatePresence>
              {aiNotif && (
                <motion.div key={aiNotif.id}
                  initial={{ opacity: 0, y: 8, scale: 0.8 }}
                  animate={{ opacity: 1, y: -12, scale: 1 }}
                  exit={{ opacity: 0, y: -24, scale: 1.5 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute top-3 right-12 text-[11px] font-semibold text-black">
                  +{aiNotif.value}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.p onHoverStart={() => triggerGlitch("100M+", setAiDisplay)} className="cursor-default text-[26px] font-black tracking-tight text-black/80">
              {aiDisplay}
            </motion.p>

            <p className="flex items-center mt-2 text-xs font-bold tracking-wider text-black/50">
              <span className="mr-1.5">
                <GiRaiseZombie size={18} />
              </span>
              AI tokens used
            </p>
          </div>

          <div className="relative flex flex-col items-center justify-center px-5 py-5 text-center">
            <AnimatePresence>
              {coffeeNotif && (
                <motion.div key={coffeeNotif.id}
                  initial={{ opacity: 0, y: 8, scale: 0.8 }}
                  animate={{ opacity: 1, y: -12, scale: 1 }}
                  exit={{ opacity: 0, y: -24, scale: 1.5 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute top-3 right-12 text-[11px] font-semibold text-gray-500">
                  +{coffeeNotif.value}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.p onHoverStart={() => triggerGlitch("2.9k+", setCoffeeDisplay)} className="cursor-default text-[26px] font-black tracking-tight text-black/80">
              {coffeeDisplay}
            </motion.p>
            <p className="flex items-center mt-2 text-xs font-bold tracking-wider text-gray-500">
              <span className="mr-1.5 text-gray-600">
                <DiCoffeescript size={18} />
              </span>
              Coffees drank
            </p>
          </div>

          <div className="relative flex flex-col items-center justify-center px-5 py-5 text-center">
            <AnimatePresence>
              {commitNotif && (
                <motion.div key={commitNotif.id}
                  initial={{ opacity: 0, y: 8, scale: 0.8 }}
                  animate={{ opacity: 1, y: -12, scale: 1 }}
                  exit={{ opacity: 0, y: -24, scale: 1.5 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute top-3 right-12 text-[11px] font-semibold text-gray-500">
                  +{commitNotif.value}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.p onHoverStart={() => triggerGlitch(total.toString(), setCommitDisplay)} className="cursor-default text-[26px] font-black tracking-tight text-black">
              {displayedCommitCount}
            </motion.p>

            <p className="flex items-center mt-2 text-xs font-bold tracking-wider text-black/50">
              <span className="mr-1.5">
                <FaGitAlt size={18} />
              </span>
              Code Commits
            </p>
          </div>
        </div>
      )}

      <div className="mb-5 text-center">
        <h2 className="text-xl md:text-2xl font-black tracking-tight text-black/80 uppercase">
          My Personal GitHub Activity
        </h2>
        <p className="mt-1 text-xs italic text-gray-500 font-medium">
          (Work commits are hiding in another dimension)
        </p>
      </div>

      <div className="min-h-60 w-full rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
        {loading ? (
          <div className="flex h-65 items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
              <p className="text-sm font-medium text-black/50">
                Loading contributions...
              </p>
            </div>
          </div>
        ) : (
          <>
            {weeks.length > 0 && (
              <div className={`mb-3 ml-8 grid text-[10px] font-bold uppercase tracking-wider text-gray-500 ${isMobile ? "max-w-85 mx-auto" : ""}`} style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}>
                {monthLabels.map((month) => (
                  <div key={month.index} style={{ gridColumnStart: month.index + 1 }}>
                    {month.label}
                  </div>
                ))}
              </div>
            )}
            <div className="flex w-full justify-center md:justify-start">
              <div className="mr-3 flex flex-col justify-between py-1 text-[10px] font-bold text-gray-500 uppercase">
                <span> Mon </span>
                <span> Wed </span>
                <span> Fri </span>
              </div>

              {weeks.length > 0 ? (
                <div className={`grid flex-1 gap-1 overflow-hidden ${isMobile ? "max-w-85" : ""}`} style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}>
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-rows-7 gap-1">

                      {week.contributionDays.map((day, dayIndex) => {
                        const count = day.contributionCount;
                        let backgroundColor = themeColors[0];

                        if (count > 0 && count <= 2) backgroundColor = themeColors[1];
                        if (count > 2 && count <= 5) backgroundColor = themeColors[2];
                        if (count > 5 && count <= 10) backgroundColor = themeColors[3];
                        if (count > 10) backgroundColor = themeColors[4];

                        return (
                          <motion.div key={day.date} initial={false}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: isTier2 ? 0 : weekIndex * 0.006 + dayIndex * 0.001, duration: isTier2 ? 0 : 0.12 }}
                            whileHover={isTier2 ? undefined : { scale: 1.15, zIndex: 10 }}
                            title={`${day.contributionCount} contributions on ${day.date}`}
                            className="aspect-square w-full rounded-xs transition-all duration-100 cursor-crosshair border border-black/5"
                            style={{ backgroundColor }} />
                        );
                      })}
                    </div>
                  ))}
                </div>

              ) : (
                <div className="flex-1 flex items-center justify-center py-12 text-sm text-gray-400 font-medium text-center">
                  No tracking log history discovered within this date range scope boundary.
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-center text-[11px] font-bold uppercase tracking-wider text-gray-500">
              <div className="flex items-center gap-2">
                <span> Less </span>
                <div className="flex gap-1">
                  {themeColors.map((color) => (
                    <div key={color} className="h-3 w-3 rounded-xs border border-black/5" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <span> More </span>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

const GithubGraphQl = memo(GithubGraphQlComponent);

export default GithubGraphQl;