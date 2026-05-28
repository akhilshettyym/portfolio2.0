import React from "react";
import SubjectProfile from "./SubjectProfile";
import DevTicker from "@/components/DevTicker";
import HeroSection from "@/components/HeroSection";
import BubbleScene from "@/components/BubbleScene";
import CardStackReveal from "@/components/CardStackReveal";

const InfoLayout = () => {

    return (
        <div>
            <HeroSection />
            <SubjectProfile />
            <DevTicker />
            <BubbleScene />
            <CardStackReveal />
        </div>
    );
};

export default InfoLayout;