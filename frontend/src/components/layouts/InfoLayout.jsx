import React, { memo } from "react";
import Footer from "@/components/Footer";
import LazyLoad from "@/components/LazyLoad";
import DevTicker from "@/components/DevTicker";
import HeroSection from "@/components/HeroSection";
import EmergencyCTA from "@/components/EmergencyCTA";
import SubjectProfile from "@/components/SubjectProfile";
import BubbleSceneLazy from "@/components/LazyComponents/BubbleSceneLazy";
import CardStackRevealLazy from "@/components/LazyComponents/CardStackRevealLazy";

const InfoLayout = memo(function InfoLayout() {

    return (
        <div>
            {/* <HeroSection /> */}
            {/* <SubjectProfile /> */}
            {/* <DevTicker /> */}

            {/* <LazyLoad threshold={0.1} rootMargin="200px" once={true}>
                <BubbleSceneLazy />
            </LazyLoad> */}

            {/* <LazyLoad threshold={0.1} rootMargin="200px" once={true}>
                <CardStackRevealLazy />
            </LazyLoad> */}

            {/* <EmergencyCTA /> */}
            {/* <Footer /> */}
        </div>
    );

});

export default InfoLayout;