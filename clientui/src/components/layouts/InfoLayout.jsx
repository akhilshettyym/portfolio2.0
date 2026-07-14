import React, { memo } from "react";
import DevTicker from "@/components/DevTicker";
import LazyLoad from "@/components/basic/LazyLoad";
import HeroSection from "@/components/HeroSection";
import SubjectProfile from "@/components/SubjectProfile";
import EmergencyCTA from "@/components/basic/EmergencyCTA";
import MySocialsTiered from "@/components/TieredComponents/MySocialsTiered";
import BubbleSceneTiered from "@/components/TieredComponents/BubbleSceneTiered";
import CardStackRevealTiered from "@/components/TieredComponents/CardStackRevealTiered";

const InfoLayout = memo(function InfoLayout() {
    return (
        <div className="relative z-10 bg-white">
            <section id="about">
                <HeroSection />
                <SubjectProfile />
            </section>

            <DevTicker />

            <section id="achievements">
                <LazyLoad threshold={0} rootMargin="200px 0px" once={true}>
                    {/* <BubbleSceneTiered /> */}
                </LazyLoad>
            </section>

            <section id="skills">
                <LazyLoad threshold={0} rootMargin="200px 0px" once={true}>
                    <CardStackRevealTiered />
                </LazyLoad>
            </section>

            <div className="relative z-0 bg-white">
                <section>
                    <LazyLoad threshold={0.1} rootMargin="200px 0px" once={true}>
                        <MySocialsTiered />
                    </LazyLoad>
                </section>
            </div>

            <EmergencyCTA />
        </div>
    );
});

export default InfoLayout;
