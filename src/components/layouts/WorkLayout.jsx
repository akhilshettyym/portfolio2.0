import React, { memo } from "react";
import Footer from "@/components/Footer";
import MyExperience from "../MyExperience";
import GithubGraphQl from "@/components/GithubGraphQl";
import SelectedWorks from "@/components/SelectedWorks";
import EmergencyCTA from "../EmergencyCTA";

const WorkLayout = memo(function WorkLayout() {

  return (
    <div>
      {/* <SelectedWorks /> */}
      <MyExperience />
      {/* <GithubGraphQl /> */}
      {/* <EmergencyCTA /> */}
      {/* <Footer /> */}
    </div>
  )

}, () => true);

export default WorkLayout;