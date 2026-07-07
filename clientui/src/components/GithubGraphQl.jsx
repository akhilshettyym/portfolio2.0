"use client";

import axios from "axios";
import { FaGitAlt } from "react-icons/fa";
import { MONTHS } from "@/utils/basic-utils";
import { GiRaiseZombie } from "react-icons/gi";
import { DiCoffeescript } from "react-icons/di";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { motion, animate, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

const GithubGraphQlComponent = ({ username = "akhilshettyym" }) => {
  const [total, setTotal] = useState(0);
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const panelRef = useRef(null);
  const { isTier2 } = usePerformanceTier();

  const motionTotal = useMotionValue(0);

  useSpring(motionTotal, {
    stiffness: 100,
    damping: 30,
  });

  const [aiDisplay, setAiDisplay] = useState("100M+");
  const [coffeeDisplay, setCoffeeDisplay] = useState("2.9k+");
  const [commitDisplay, setCommitDisplay] = useState("0");

  const [aiNotif, setAiNotif] = useState(null);
  const [coffeeNotif, setCoffeeNotif] = useState(null);
  const [commitNotif, setCommitNotif] = useState(null);

  const currentDate = useMemo(() => new Date(), []);

  const range = useMemo(() => {
    const end = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );

    const start = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 11,
      1,
    );

    return {
      from: start.toISOString(),
      to: end.toISOString(),
    };
  }, [currentDate]);

  useEffect(() => {
    if (isTier2) {
      // For tier_2, show commits directly without animation
      setCommitDisplay(total.toString());
      return;
    }

    const controls = animate(motionTotal, total, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (latest) => {
        setCommitDisplay(Math.round(latest).toString());
      },
    });
    return () => controls.stop();
  }, [total, motionTotal, isTier2]);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true);

        const response = await axios.get("/api/github", {
          params: {
            username: username,
            from: range.from,
            to: range.to,
          },
        });

        const calendar = response.data?.data?.user?.contributionsCollection?.contributionCalendar;
        const fetchedWeeks = calendar?.weeks || [];
        const totalContributions = calendar?.totalContributions || 0;

        setWeeks(fetchedWeeks);
        setTotal(totalContributions);
        setFromCache(false);

      } catch (err) {
        console.error("GitHub contributions fetch failed:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [username, range]);

  const monthLabels = [];
  const renderedMonths = new Set();

  weeks.forEach((week, index) => {
    const contributionDays = week.contributionDays;

    if (!contributionDays?.length) return;

    const visibleDay = contributionDays.find((day) => {
      const date = new Date(day.date);
      return date >= new Date(range.from) && date <= new Date(range.to);
    });

    if (!visibleDay) return;

    const month = new Date(visibleDay.date).getMonth();
    const year = new Date(visibleDay.date).getFullYear();
    const key = `${month}-${year}`;

    if (!renderedMonths.has(key)) {
      renderedMonths.add(key);

      monthLabels.push({
        index,
        label: MONTHS[month],
      });
    }
  });

  const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

  const triggerGlitch = (finalText, setter) => {
    let iteration = 0;

    const interval = setInterval(() => {
      const glitched = finalText
        .split("")
        .map((char, index) => {
          if (char === "." || char === "+") {
            return char;
          }

          if (index < iteration) {
            return finalText[index];
          }
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
  }, []);

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

  return (
    <motion.div ref={panelRef} initial={{ opacity: 0, y: 34, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: isTier2 ? 0.35 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full p-8">

      <div className="mb-5 grid grid-cols-3 gap-4 uppercase">
        <div className="relative flex flex-col items-center justify-center px-5 py-5 text-center">
          <AnimatePresence>
            {aiNotif && (
              <motion.div key={aiNotif.id}
                initial={{ opacity: 0, y: 8, scale: 0.8 }}
                animate={{ opacity: 1, y: -12, scale: 1 }}
                exit={{ opacity: 0, y: -24, scale: 1.9 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute top-3 right-33 text-[11px] font-semibold text-zinc-500">
                +{aiNotif.value}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.p onHoverStart={() => triggerGlitch("100M+", setAiDisplay)}
            className="cursor-default text-[26px] font-bold tracking-tight text-black">
            {" "}{aiDisplay}{" "}
          </motion.p>

          <p className="flex items-center mt-2 text-sm font-medium tracking-wide text-zinc-500 transition-colors duration-200 hover:text-zinc-700">
            <span className="mr-1 animate-pulse-slow">
              {" "}
              <GiRaiseZombie size={20} />{" "}
            </span>{" "}
            AI tokens used
          </p>
        </div>

        <div className="relative flex flex-col items-center justify-center px-5 py-5 text-center">
          <AnimatePresence>
            {coffeeNotif && (
              <motion.div key={coffeeNotif.id}
                initial={{ opacity: 0, y: 8, scale: 0.8 }}
                animate={{ opacity: 1, y: -12, scale: 1 }}
                exit={{ opacity: 0, y: -24, scale: 0.9 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute top-3 right-35 text-[11px] font-semibold text-zinc-500">
                {" "}
                +{coffeeNotif.value}{" "}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.p onHoverStart={() => triggerGlitch("2.9k+", setCoffeeDisplay)} className="cursor-default text-[26px] font-bold tracking-tight text-black">
            {" "}{coffeeDisplay}{" "}
          </motion.p>

          <p className="flex items-center mt-2 text-sm font-medium tracking-wide text-zinc-500 transition-colors duration-200 hover:text-zinc-700">
            <span className="mr-1 animate-pulse-slow">
              {" "}
              <DiCoffeescript size={20} />{" "}
            </span>{" "}
            Coffees drank
          </p>
        </div>

        <div className="relative flex flex-col items-center justify-center px-5 py-5 text-center">
          <AnimatePresence>
            {commitNotif && (
              <motion.div key={commitNotif.id}
                initial={{ opacity: 0, y: 8, scale: 0.8 }}
                animate={{ opacity: 1, y: -12, scale: 1 }}
                exit={{ opacity: 0, y: -24, scale: 0.9 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute top-3 right-36 text-[11px] font-semibold text-zinc-500">
                {" "}+{commitNotif.value}{" "}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.p onHoverStart={() =>
            triggerGlitch(total.toString(), setCommitDisplay)
          }
            className="cursor-default text-[26px] font-bold tracking-tight text-black">
            {" "}{commitDisplay}{" "}
          </motion.p>

          <p className="flex items-center mt-2 text-sm font-medium tracking-wide text-zinc-500 transition-colors duration-200 hover:text-zinc-700">
            <span className="mr-1 animate-pulse-slow">
              {" "}
              <FaGitAlt size={20} />{" "}
            </span>{" "}
            Code Commits
          </p>
        </div>
      </div>

      <div className="mb-5 text-center">
        <h2 className="text-[28px] font-semibold tracking-tight text-black uppercase">
          {" "}My - Personal GitHub Activity{" "}
        </h2>
        <p className="mt-1 text-sm italic text-zinc-500">
          {" "}(Work commits are hiding in another dimension){" "}
        </p>
      </div>

      <div className="min-h-60 w-full rounded-xl border border-zinc-200 p-6">
        {loading ? (
          <div className="flex h-65 items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-black" />
              <p className="text-sm font-medium text-zinc-500">
                {" "}Loading contributions...{" "}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-3 ml-8 grid text-[11px] font-medium text-zinc-500"
              style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}>
              {monthLabels.map((month) => (
                <div key={month.index} style={{ gridColumnStart: month.index + 1 }}>
                  {month.label}
                </div>
              ))}
            </div>

            <div className="flex w-full">
              <div className="mr-3 flex flex-col justify-between py-1 text-[11px] text-zinc-400">
                <span> Mon </span>
                <span> Wed </span>
                <span> Fri </span>
              </div>

              <div className="grid flex-1 gap-1 overflow-hidden" style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}>
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-rows-7 gap-1">
                    {week.contributionDays.map((day, dayIndex) => {
                      const count = day.contributionCount;
                      let backgroundColor = "#f4f4f5";

                      if (count > 0 && count <= 2) {
                        backgroundColor = "#d4d4d8";
                      }

                      if (count > 2 && count <= 5) {
                        backgroundColor = "#a1a1aa";
                      }

                      if (count > 5 && count <= 10) {
                        backgroundColor = "#52525b";
                      }

                      if (count > 10) {
                        backgroundColor = "#09090b";
                      }

                      return (
                        <motion.div key={day.date}
                          initial={isTier2 ? false : { opacity: 0, scale: 0.85 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: isTier2 ? 0 : weekIndex * 0.01 + dayIndex * 0.002, duration: isTier2 ? 0 : 0.16 }}
                          whileHover={isTier2 ? undefined : { scale: 1, y: -1 }}
                          title={`${day.contributionCount} contributions on ${day.date}`}
                          className="aspect-square w-full rounded-[3px] transition-all duration-150 hover:ring-1  hover:ring-black/10"
                          style={{ backgroundColor }} />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center text-[12px] text-zinc-500">
              <div className="flex items-center gap-2">
                <span> Less </span>
                <div className="flex gap-0.75">
                  {["#f4f4f5", "#d4d4d8", "#a1a1aa", "#52525b", "#09090b"].map(
                    (color) => (
                      <div key={color} className="h-3 w-3 rounded-xs" style={{ backgroundColor: color }} />
                    ),
                  )}
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