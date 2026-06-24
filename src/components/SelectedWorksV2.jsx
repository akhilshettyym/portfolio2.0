"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import Link from "next/link";

const PROJECTS = [
    {
        id: 1,
        title: "Nova Commerce",
        tagline: "Headless eCommerce Experience",
        when: "2025",
        type: "Web Platform",
        image: "/bumpImage.svg",
        url: "https://example.com",
        stack: ["Next.js", "Node", "Stripe", "Postgres"],
        description: "A modern commerce experience with high performance architecture.",
    },

    {
        id: 2,
        title: "Staffle",
        tagline: "Employee Management System",
        when: "2026",
        type: "Management",
        image: "/globeImage.svg",
        url: "https://example.com",
        stack: ["MongoDb", "Express", "React", "Node"],
        description: "Staffle is a full-stack Employee & Organization Management System built using the MERN stack. It supports multi-organization workflows with Super Admin, Admin, and Employee role-based control, task lifecycle management, and centralized organization governance.",
    },

    {
        id: 3,
        title: "Vision AI",
        tagline: "Computer Vision Dashboard",
        when: "2024",
        type: "AI Platform",
        image: "/globeImage.svg",
        url: "https://example.com",
        stack: ["React", "Python", "OpenCV"],
        description: "Real-time AI insights and visual analytics for enterprise teams.",
    },

    {
        id: 4,
        title: "Selected Work",
        tagline: "New project in progress",
        when: "2026",
        type: "Experimental",
        image: "",
        url: "",
        stack: [],
        description: "",
    },
];

const SelectedWorksV2 = () => {
    const [activeProject, setActiveProject] = useState(null);

    const handleEnter = (index) => {
        setActiveProject(index);
    };

    const handleLeave = () => {
        setActiveProject(null);
    };

    return (
        <section className="relative w-full bg-white text-black overflow-hidden">
            <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-24">

                <div className="mb-5">
                    <div className="relative px-10 py-2 text-xs tracking-widest">
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-auto">
                            ©001
                        </div>
                    </div>

                    <div className="overflow-hidden">
                        <h1 className="inline-block text-[clamp(4.0rem,9vw,4.0rem)] leading-[0.7] font-black tracking-[-0.09em] text-black will-change-transform origin-left" style={{ fontFeatureSettings: '"ss01" on, "ss02" on', transform: "scaleX(1.5)" }}>
                            SELECTED /
                        </h1>
                    </div>


                    <div className="overflow-hidden -mt-3">
                        <h1 className="w-full flex items-baseline justify-between text-[clamp(4rem,5vw,2rem)] leading-[0.82] font-black tracking-[-0.09em] text-black/90 will-change-transform whitespace-nowrap" style={{ fontFeatureSettings: '"ss01" on, "ss02" on' }}>
                            <span> . WORKS </span>
                            <span className="text-sm tracking-normal ml-auto mr-5"> 24-26 </span>
                        </h1>
                    </div>
                </div>

                <div className="relative">
                    {PROJECTS.map((project, index) => {
                        const isActive = activeProject === index;

                        return (
                            <motion.div key={project.id} role="button" tabIndex={0}
                                onMouseEnter={() => handleEnter(index)}
                                onMouseLeave={handleLeave}
                                onFocus={() => handleEnter(index)}
                                onBlur={handleLeave}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        handleEnter(index);
                                    }
                                }}
                                animate={{ backgroundColor: isActive ? "#000000" : "#ffffff", color: isActive ? "#ffffff" : "#000000" }}
                                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                                className="group relative cursor-pointer border-t border-black">
                                <div className="grid grid-cols-12 gap-6 px-10 py-6">

                                    <div className="col-span-12 md:col-span-5">
                                        <h3 className="text-2xl md:text-4xl font-medium"> {project.title} </h3>
                                        <p className="mt-2 text-sm opacity-70"> {project.tagline} </p>
                                    </div>

                                    <div className="hidden md:block md:col-span-3" />

                                    <div className="col-span-6 md:col-span-2">
                                        <p className="text-xs uppercase opacity-60 mb-2"> When </p>
                                        <p className="text-lg"> {project.when} </p>
                                    </div>

                                    <div className="col-span-6 md:col-span-2">
                                        <p className="text-xs uppercase opacity-60 mb-2"> Type </p>
                                        <p className="text-lg"> {project.type} </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                    <div className="border-t border-black" />
                </div>
            </div>


            <AnimatePresence mode="wait">
                {activeProject !== null && (
                    <motion.div key={activeProject}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="pointer-events-none fixed right-10 top-1/2 z-50 hidden lg:block -translate-y-1/2">
                        <PreviewCard project={PROJECTS[activeProject]} />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

function PreviewCard({ project }) {
    const hasContent = project.image && project.description;

    return (
        <motion.div layout className="relative h-[520px] w-[850px] overflow-hidden border border-white/10 bg-black shadow-[0_40px_100px_rgba(0,0,0,0.35)]">
            {hasContent ? (
                <>
                    <Image src={project.image} alt={project.title} fill priority className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/90" />

                    <div className="absolute inset-0 flex flex-col justify-between p-7 text-white">
                        <div className="flex items-center justify-between">
                            <span className="text-xs uppercase tracking-[0.25em] opacity-70"> Selected Work </span>
                            <span className="text-sm opacity-60"> 0{project.id} </span>
                        </div>

                        <div>
                            <h3 className="text-3xl font-medium"> {project.title} </h3>
                            <p className="mt-4 text-sm leading-relaxed text-white/80"> {project.description} </p>

                            <div className="mt-6 flex flex-wrap gap-2">
                                {project.stack.map((item) => (
                                    <span key={item} className="rounded-full border border-white/20 px-3 py-1.5 text-xs backdrop-blur-md">
                                        {item}
                                    </span>
                                ))}
                            </div>

                            {project.url && (
                                <Link href={project.url} target="_blank" rel="noopener noreferrer" className=" pointer-events-auto  mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-all duration-300 hover:scale-[1.03]">
                                    Visit Live Site
                                    <FaArrowUpRightFromSquare size={16} />
                                </Link>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex h-full items-center justify-center bg-black text-white">
                    <div className="text-center">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/40"> Selected Work </p>
                        <h3 className="mt-5 text-4xl font-medium"> COMING SOON </h3>

                        <p className="mt-4 text-white/60">
                            Project details will be revealed soon.
                        </p>
                    </div>
                </div>
            )}
        </motion.div>
    );
}

export default SelectedWorksV2;