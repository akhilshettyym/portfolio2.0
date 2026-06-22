import React, { memo } from "react";
import LazyLoad from "@/components/LazyLoad";
import DevTicker from "@/components/DevTicker";
import HeroSection from "@/components/HeroSection";
import BubbleScene from "@/components/BubbleScene";
import EducationLog from "@/components/EducationLog";
import SubjectProfile from "@/components/SubjectProfile";
import CardStackReveal from "@/components/CardStackReveal";
import Footer from "@/components/Footer";

const InfoLayout = memo(function InfoLayout() {
    return (
        <div>
            {/* <HeroSection />
            <SubjectProfile />
            <DevTicker />
            <LazyLoad threshold={0.1} rootMargin="200px" once={true}>
                <BubbleScene />
            </LazyLoad>
            <CardStackReveal />
            <LazyLoad threshold={0.05} rootMargin="300px" once={true}>
                <EducationLog />
            </LazyLoad> */}
            <Footer />
        </div>
    );

}, () => true);

export default InfoLayout;