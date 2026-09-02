import DevTicker from "@/components/sections/DevTicker";
import SubjectProfile from "@/components/sections/SubjectProfile";
import BubbleSceneTiered from "@/components/Tiered/BubbleSceneTiered";
import MySocialsReveal from "@/components/animations/MySocialsReveal";
import CardStackRevealTiered from "@/components/Tiered/CardStackRevealTiered";
import MySocialsReveal from "@/components/animations/MySocialsReveal";

export default function InfoLayout({ content = {} }) {
  return (
    <article className="relative z-10">
      <section id="hero" className="min-h-screen pointer-events-none" />

      <div className="relative z-10 bg-white">
        <section id="about">
          <SubjectProfile />
        </section>

        <DevTicker />

        <section id="skills">
          <BubbleSceneTiered />
        </section>

        <section id="achievements">
          <CardStackRevealTiered initialAchievements={content.achievements} />
        </section>

        <section id="socials">
          <MySocialsReveal />
        </section>
      </div>
    </article>
  );
}
