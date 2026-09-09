import LazyLoad from "@/components/core/LazyLoad";
import TrackTrail from "@/components/sections/TrackTrail";
import TickerWrapper from "@/components/wrappers/TickerWrapper";
import SelectedWorks from "@/components/sections/SelectedWorks";
import MyExperienceTiered from "@/components/Tiered/MyExperienceTiered";
import GithubGraphQlTiered from "@/components/Tiered/GithubGraphQlTiered";

export default function WorkLayout({ content = {} }) {
  return (
    <article className="relative z-10 bg-white">
      <section id="projects">
        <SelectedWorks initialProjects={content.works} />
      </section>

      <TickerWrapper />

      <section id="salesforce">
        <LazyLoad threshold={0.1} rootMargin="200px" once={true}>
          <TrackTrail initialTrailhead={content.trailhead} />
        </LazyLoad>
      </section>

      <section id="github">
        <LazyLoad threshold={0.1} rootMargin="200px" once={true}>
          <GithubGraphQlTiered />
        </LazyLoad>
      </section>

      <section id="experience">
        <LazyLoad threshold={0.1} rootMargin="200px" once={true}>
          <MyExperienceTiered initialExperiences={content.experiences} initialEducations={content.educations} />
        </LazyLoad>
      </section>
    </article>
  );
}
