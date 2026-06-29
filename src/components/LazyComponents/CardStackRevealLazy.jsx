"use client"; // This flag lets Next.js know it's safe to use client features

import dynamic from 'next/dynamic';
import React from 'react';

const CardStackRevealLazy = dynamic(
    () => import('../CardStackReveal'),
    {
        ssr: false,
        loading: () => <div style={{ height: '480px' }} className="animate-pulse bg-zinc-900" />
    }
);

export default CardStackRevealLazy;