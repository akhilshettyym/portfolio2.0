import React from "react";
import LazyLoad from "@/components/basic/LazyLoad";
import SelectedWorks from "@/components/SelectedWorks";
import EmergencyCTA from "@/components/basic/EmergencyCTA";
import MyExperienceTiered from "@/components/TieredComponents/MyExperienceTiered";
import GithubGraphQlTiered from "@/components/TieredComponents/GithubGraphQlTiered";

const WorkLayout = () => {
  return (
    <div>
      <SelectedWorks />

      <LazyLoad threshold={0.1} rootMargin="200px" once={true}>
        <MyExperienceTiered />
      </LazyLoad>

      <LazyLoad threshold={0.1} rootMargin="200px" once={true}>
        <GithubGraphQlTiered />
      </LazyLoad>

      <EmergencyCTA />
    </div>
  );
}

export default WorkLayout;