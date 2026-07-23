import React from "react";
import LazyLoad from "@/components/basic/LazyLoad";
import SelectedWorks from "@/components/SelectedWorks";
import MyExperienceTiered from "@/components/TieredComponents/MyExperienceTiered";
import GithubGraphQlTiered from "@/components/TieredComponents/GithubGraphQlTiered";
import MyHorizontailReveal from "../MyHorizontailReveal";
import Salesforce from "../Salesforce";

export default function WorkLayout() {

  return (
    <article className="relative z-10 bg-white">

      <section id="projects">
        {/* <SelectedWorks /> */}
      </section>

      <section id="experience">
        <LazyLoad threshold={0.1} rootMargin="200px" once={true}>
          {/* <MyExperienceTiered /> */}
          {/* <MyHorizontailReveal /> */}
        </LazyLoad>
      </section>

      <Salesforce />

      <section id="github">
        <LazyLoad threshold={0.1} rootMargin="200px" once={true}>
          {/* <GithubGraphQlTiered /> */}
        </LazyLoad>
      </section>

    </article>
  );

}