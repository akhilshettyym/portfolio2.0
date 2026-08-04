import DevTicker from "@/components/DevTicker";
import LazyLoad from "@/components/basic/LazyLoad";
import HeroSection from "@/components/HeroSection";
import SubjectProfile from "@/components/SubjectProfile";
import MySocialsTiered from "@/components/TieredComponents/MySocialsTiered";
import BubbleSceneTiered from "@/components/TieredComponents/BubbleSceneTiered";
import CardStackRevealTiered from "@/components/TieredComponents/CardStackRevealTiered";

export default function InfoLayout() {
  return (
    <article className="relative z-10 bg-white">
      <section id="hero">
        <HeroSection />
      </section>

      <section id="about">
        <SubjectProfile />
      </section>

      <DevTicker />

      <section id="skills">
        <LazyLoad threshold={0} rootMargin="200px 0px" once={true}>
          <BubbleSceneTiered />
        </LazyLoad>
      </section>

      <section id="achievements">
        <LazyLoad threshold={0} rootMargin="200px 0px" once={true}>
          <CardStackRevealTiered />
        </LazyLoad>
      </section>

      <MySocialsTiered />
    </article>
  );
}
