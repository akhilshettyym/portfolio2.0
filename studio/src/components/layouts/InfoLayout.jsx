import TickerWrapper from "@/components/wrappers/TickerWrapper";
import SubjectProfile from "@/components/sections/SubjectProfile";
import SocialsWrapper from "@/components/wrappers/SocialsWrapper";
import BubbleSceneTiered from "@/components/Tiered/BubbleSceneTiered";
import CardStackRevealTiered from "@/components/Tiered/CardStackRevealTiered";

export default function InfoLayout({ content = {} }) {
  return (
    <article className="relative z-10">
      <section id="hero" className="min-h-screen pointer-events-none" />

      <div className="relative z-10 bg-white">
        <section id="about">
          <SubjectProfile />
        </section>

        <TickerWrapper />

        <section id="skills">
          <BubbleSceneTiered />
        </section>

        <section id="achievements">
          <CardStackRevealTiered initialAchievements={content.achievements} />
        </section>

        <section id="socials">
          <SocialsWrapper />
        </section>
      </div>
    </article>
  );
}
