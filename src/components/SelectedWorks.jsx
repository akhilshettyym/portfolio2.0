"use client";

import React from 'react'
import { useRouter } from 'next/navigation';
import CustomButton from '@/components/basic/CustomButton';

const SelectedWorks = () => {

    const router = useRouter();

    const handleNavigate = () => {
        router.push("/");
    };

    return (
        <div>
            <div className="min-h-full w-full flex items-center justify-center">
                <div className="w-full max-w-8xl flex flex-row">

                    <div className="w-[10%] pt-40">
                        <div className="relative h-125 overflow-hidden">
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/3 -translate-y-1/2 -rotate-90 w-50 flex flex-col">
                                <p className="w-full text-left whitespace-nowrap tracking-[0.40em] text-sm font-medium text-zinc-300 uppercase"> {"//"} Beyond{" "} <span className="lowercase tracking-[0.20em]"> localhost:3000 </span> </p>

                                <p className="w-full text-right whitespace-nowrap tracking-[0.20em] text-[10px] font-medium text-zinc-500 uppercase mt-2"> Where 127.0.0.1 Ends </p>
                            </div>
                        </div>
                    </div>

                    <div className='w-[90%] mr-5'>
                        <div className="mb-2">
                            <div className="relative px-10 py-2 text-xs tracking-widest">
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-auto">
                                    ©001
                                </div>

                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto -ml-15">
                                    .(WORK)
                                </div>
                            </div>

                            <div className="overflow-hidden">
                                <h1 className="text-[clamp(4.5rem,9vw,5.5rem)] leading-[0.82] font-black tracking-[-0.09em] text-black will-change-transform" style={{ fontFeatureSettings: '"ss01" on, "ss02" on' }}> SELECTED / </h1>
                            </div>

                            <div className="overflow-hidden -mt-3">
                                <h1 className="w-full flex items-baseline justify-between text-[clamp(4.5rem,5vw,3rem)] leading-[0.82] font-black tracking-[-0.09em] text-black/90 will-change-transform whitespace-nowrap" style={{ fontFeatureSettings: '"ss01" on, "ss02" on' }}>
                                    <span> . WORKS </span>
                                    <span className="text-sm tracking-normal ml-auto mr-5"> 24-26 </span>
                                </h1>
                            </div>
                        </div>

                        <div className="flex-1 min-h-125 rounded-sm border border-black/10 bg-white shadow-[0_20px_80px_rgba(0,0,0,0.08)] overflow-hidden">

                            <div className="p-1">
                                <div className="grid grid-cols-2 divide-x divide-black/10 border-b border-black/10">

                                    <div className="h-100 p-6 flex flex-col justify-between">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.4em] text-black/35">
                                                top left
                                            </p>
                                            <h3 className="mt-3 text-2xl font-black tracking-[-0.08em] text-black">
                                                Error-style panel
                                            </h3>
                                        </div>

                                        <p className="text-sm leading-7 text-black/60 max-w-md">
                                            Compact, focused, and structured like a production-grade interface.
                                        </p>
                                    </div>


                                    <div className="h-100 p-6 flex flex-col justify-between">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.4em] text-black/35">
                                                top right
                                            </p>
                                            <h3 className="mt-3 text-2xl font-black tracking-[-0.08em] text-black">
                                                Stable layout
                                            </h3>
                                        </div>

                                        <p className="text-sm leading-7 text-black/60 max-w-md">
                                            Divider-based compartments replace heavy bordered cards for a cleaner
                                            visual hierarchy.
                                        </p>
                                    </div>

                                </div>

                                <div className="grid grid-cols-4 divide-x divide-black/10">

                                    <div className="h-50 p-5">
                                        <p className="text-[10px] uppercase tracking-[0.35em] text-black/35">
                                            bottom 1
                                        </p>
                                        <p className="mt-3 text-sm text-black/70">
                                            Project overview
                                        </p>
                                    </div>

                                    <div className="h-50 p-5">
                                        <p className="text-[10px] uppercase tracking-[0.35em] text-black/35">
                                            bottom 2
                                        </p>
                                        <p className="mt-3 text-sm text-black/70">
                                            Tech stack
                                        </p>
                                    </div>

                                    <div className="h-50 p-5">
                                        <p className="text-[10px] uppercase tracking-[0.35em] text-black/35">
                                            bottom 3
                                        </p>
                                        <p className="mt-3 text-sm text-black/70">
                                            Role / outcome
                                        </p>
                                    </div>


                                    <div className="flex h-50 p-2">
                                        <div className="w-full rounded-2xl border-black/10 bg-white shadow-[0_20px_80px_rgba(0,0,0,0.08)] overflow-hidden flex items-center justify-center">
                                            <CustomButton title="View Project" onClick={handleNavigate} width="180" height="50" />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default SelectedWorks;