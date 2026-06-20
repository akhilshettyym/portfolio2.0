import React from "react";
import EducationLog from "../EducationLog";
import DevTicker from "@/components/DevTicker";
import SubjectProfile from "../SubjectProfile";
import HeroSection from "@/components/HeroSection";
import BubbleScene from "@/components/BubbleScene";
import CardStackReveal from "@/components/CardStackReveal";
import CinematicIntro from "../CinematicIntro";

const InfoLayout = () => {

    return (
        <div>
            {/* <CinematicIntro /> */}
            <HeroSection />
            <SubjectProfile />
            <DevTicker />
            <BubbleScene />
            <CardStackReveal />
            <EducationLog />
        </div>
    );
};

export default InfoLayout;