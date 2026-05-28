"use client";

import { MONTHS } from "@/utils/basic-utils";
import { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, animate, useTransform, useSpring } from "framer-motion";


export default function GithubGraphQl({ username = "akhilshettyym" }) {

    const currentYear = useMemo(() => new Date().getFullYear(), []);
    const [weeks, setWeeks] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const [busiestDay, setBusiestDay] = useState(null);
    const [currentStreak, setCurrentStreak] = useState(0);

    const motionTotal = useMotionValue(0);
    const springTotal = useSpring(motionTotal, { stiffness: 100, damping: 30 });
    const animatedTotal = useTransform(springTotal, (value) => Math.round(value));

    useEffect(() => {
        const controls = animate(motionTotal, total, { duration: 1.2, ease: "easeOut" });
        return () => controls.stop();
    }, [total, motionTotal]);

    useEffect(() => {
        const fetchContributions = async () => {
            try {
                setLoading(true);

                const res = await fetch(`/api?username=${encodeURIComponent(username)}&year=${currentYear}`);

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                const data = await res.json();
                const calendar = data?.data?.user?.contributionsCollection?.contributionCalendar;
                const fetchedWeeks = calendar?.weeks || [];

                setWeeks(fetchedWeeks);
                setTotal(calendar?.totalContributions || 0);

                const allDays = fetchedWeeks.flatMap(
                    (week) => week.contributionDays
                );

                const maxDay = allDays.reduce((max, day) => {
                    return day.contributionCount > (max?.contributionCount || 0) ? day : max;
                }, null);

                setBusiestDay(maxDay);

                let streak = 0;

                for (let i = allDays.length - 1; i >= 0; i--) {
                    if (allDays[i].contributionCount > 0) {
                        streak++;
                    } else {
                        break;
                    }
                }

                setCurrentStreak(streak);
            } catch (err) {
                console.error("GitHub contributions fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchContributions();
    }, [username, currentYear]);

    const monthLabels = [];

    weeks.forEach((week, index) => {
        const firstDay = week.contributionDays?.[0];

        if (!firstDay) return;

        const month = new Date(firstDay.date).getMonth();
        const prevWeek = weeks[index - 1];
        const prevMonth = prevWeek ? new Date(prevWeek.contributionDays?.[0]?.date).getMonth() : -1;

        if (month !== prevMonth) {
            monthLabels.push({ index, label: MONTHS[month] });
        }
    });

    return (
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45 }} className="w-full p-8">
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h2 className="text-[20px] font-semibold tracking-tight text-black uppercase"> Contribution activity </h2>
                    <p className="mt-1 text-sm text-zinc-500"> Public contributions in {currentYear} </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <div className="rounded-xl border border-zinc-200 px-2 py-1">
                        <p className="mt-1 text-md font-bold tracking-tight text-black">
                            <span className="text-sm text-zinc-500"> Total contributions : </span>
                            <motion.span>{animatedTotal}</motion.span>
                        </p>
                    </div>

                    <div className="rounded-xl border border-zinc-200 px-2 py-1">
                        <p className="mt-1 text-md font-bold tracking-tight text-black">
                            <span className="text-sm text-zinc-500"> Current streak : </span> {currentStreak}
                        </p>
                    </div>

                    <div className="rounded-xl border border-zinc-200 px-2 py-1">
                        <p className="mt-1 text-md font-bold tracking-tight text-black">
                            <span className="text-sm text-zinc-500"> Best day : </span> {busiestDay?.contributionCount || 0}
                        </p>
                    </div>
                </div>
            </div>

            <div className="min-h-70 w-full rounded-2xl border border-zinc-200 p-6 md:p-8">
                {loading ? (
                    <div className="flex h-65 items-center justify-center">
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-black" />
                            <p className="text-sm font-medium text-zinc-500">
                                Loading contributions...
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-3 ml-8 grid grid-cols-12 text-[11px] font-medium text-zinc-500">
                            {monthLabels.map((month) => (
                                <div key={month.index}>{month.label}</div>
                            ))}
                        </div>

                        <div className="flex w-full">
                            <div className="mr-3 flex flex-col justify-between py-1 text-[11px] text-zinc-400">
                                <span> Mon </span>
                                <span> Wed </span>
                                <span> Fri </span>
                            </div>

                            <div className="grid flex-1 grid-cols-53 gap-1">
                                {weeks.map((week, weekIndex) => (
                                    <div key={weekIndex} className="grid grid-rows-7 gap-1">
                                        {week.contributionDays.map((day, dayIndex) => (
                                            <motion.div key={day.date}
                                                initial={{ opacity: 0, scale: 0.85 }}
                                                whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                                                transition={{ delay: weekIndex * 0.01 + dayIndex * 0.002, duration: 0.16 }}
                                                whileHover={{ scale: 1.12, y: -1 }}
                                                title={`${day.contributionCount} contributions on ${day.date}`}
                                                className="aspect-square w-full rounded-[3px] transition-all duration-150 hover:ring-1 hover:ring-black/10"
                                                style={{ backgroundColor: day.contributionCount === 0 ? "#ebedf0" : day.color }} />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between text-[12px] text-zinc-500">
                            <p> Donno what to add ... </p>

                            <div className="flex items-center gap-2">
                                <span> Less </span>
                                <div className="flex gap-0.75">
                                    {["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"].map((color) => (
                                        <div key={color} className="h-3 w-3 rounded-xs" style={{ backgroundColor: color }} />
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
}