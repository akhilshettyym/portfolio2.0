import React, { memo } from "react";
import LazyLoad from "@/components/basic/LazyLoad";
import MyExperienceLazy from "@/components/LazyComponents/MyExperienceLazy";
import GithubGraphQlLazy from "@/components/LazyComponents/GithubGraphQlLazy";
import SelectedWorks from "@/components/SelectedWorks";
import EmergencyCTA from "@/components/basic/EmergencyCTA";
import Footer from "@/components/Footer";

const WorkLayout = memo(function WorkLayout() {

  return (
    <div>
      {/* <SelectedWorks /> */}

      {/* <LazyLoad threshold={0.1} rootMargin="200px" once={true}>
        <MyExperienceLazy />
      </LazyLoad> */}

      {/* <LazyLoad threshold={0.1} rootMargin="200px" once={true}>
        <GithubGraphQlLazy />
      </LazyLoad> */}

      {/* <EmergencyCTA /> */}
      {/* <Footer /> */}
    </div>
  );

}, () => true);

export default WorkLayout;