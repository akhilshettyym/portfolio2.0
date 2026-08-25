import React from "react";
import LazyLoad from "@/components/core/LazyLoad";
import DevTicker from "@/components/sections/DevTicker";
import TrackTrail from "@/components/sections/TrackTrail";
import SelectedWorks from "@/components/sections/SelectedWorks";
import MyExperienceTiered from "@/components/Tiered/MyExperienceTiered";
import GithubGraphQlTiered from "@/components/Tiered/GithubGraphQlTiered";

export default function WorkLayout({ content = {} }) {
  return (
    <article className="relative z-10 bg-white">
      <section id="projects">
        <SelectedWorks initialProjects={content.works} />
      </section>

      <DevTicker />

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
