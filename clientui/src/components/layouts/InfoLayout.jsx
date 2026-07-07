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
        <div>
            {/* <HeroSection /> */}
            {/* <SubjectProfile /> */}
            {/* <DevTicker /> */}

            {/* <LazyLoad threshold={0.1} rootMargin="200px" once={true}>
                <BubbleSceneTiered />
            </LazyLoad> */}

            {/* <LazyLoad threshold={0.1} rootMargin="200px" once={true}>
                <CardStackRevealTiered />
            </LazyLoad> */}

            <LazyLoad threshold={0.1} rootMargin="200px" once={true}>
                <MySocialsTiered />
            </LazyLoad>

            {/* <EmergencyCTA /> */}
            {/* <Footer /> */}
        </div>
    );
});

export default InfoLayout;