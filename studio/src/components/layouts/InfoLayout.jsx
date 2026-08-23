import DevTicker from "@/components/DevTicker";
import SubjectProfile from "@/components/SubjectProfile";
import SocialsHorizontalReveal from "@/components/SocialsHorizontalReveal";
import BubbleSceneTiered from "@/components/TieredComponents/BubbleSceneTiered";
import CardStackRevealTiered from "@/components/TieredComponents/CardStackRevealTiered";

export default function InfoLayout() {
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
          <CardStackRevealTiered />
        </section>

        <section id="socials">
          <SocialsHorizontalReveal />
        </section>
      </div>
    </article>
  );
}
