import React, { memo } from "react";
import Footer from "@/components/Footer";
import GithubGraphQl from "@/components/GithubGraphQl";
import SelectedWorks from "@/components/SelectedWorks";
import MyExperience from "../MyExperience";

const WorkLayout = memo(function WorkLayout() {

  return (
    <div>
      {/* <SelectedWorks />
      <MyExperience />
      <GithubGraphQl />
      <Footer /> */}
    </div>
  )

}, () => true);

export default WorkLayout;