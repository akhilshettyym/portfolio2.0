import React, { memo } from "react";
import Footer from "@/components/Footer";
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
            {/* <HeroSection /> */}
            {/* <SubjectProfile /> */}
            {/* <DevTicker /> */}

            <LazyLoad threshold={0} rootMargin="200px 0px" once={true}>
                {/* <BubbleSceneTiered /> */}
            </LazyLoad>

            <LazyLoad threshold={0} rootMargin="200px 0px" once={true}>
                {/* <CardStackRevealTiered /> */}
            </LazyLoad>

            <div className="relative z-0 bg-white">
                <LazyLoad threshold={0.1} rootMargin="200px 0px" once={true}>
                    {/* <MySocialsTiered /> */}
                </LazyLoad>
            </div>

            {/* <EmergencyCTA /> */}
            {/* <Footer /> */}
        </div>
    );
});

export default InfoLayout;