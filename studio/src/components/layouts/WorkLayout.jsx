import React from "react";
import TrackTrail from "@/components/TrackTrail";
import LazyLoad from "@/components/basic/LazyLoad";
import SelectedWorks from "@/components/SelectedWorks";
import MyExperienceTiered from "@/components/TieredComponents/MyExperienceTiered";
import GithubGraphQlTiered from "@/components/TieredComponents/GithubGraphQlTiered";

export default function WorkLayout({ content = {} }) {
  return (
    <article className="relative z-10 bg-white">
      <section id="projects">
        <SelectedWorks initialProjects={content.works} />
      </section>

      <section id="experience">
        <LazyLoad threshold={0.1} rootMargin="200px" once={true}>
          <MyExperienceTiered initialExperiences={content.experiences} initialEducations={content.educations} />
        </LazyLoad>
      </section>

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
    </article>
  );
}
