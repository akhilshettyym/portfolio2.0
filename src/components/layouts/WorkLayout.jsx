import React, { memo } from "react";
import Footer from "@/components/Footer";
import GithubGraphQl from "@/components/GithubGraphQl";
import SelectedWorks from "@/components/SelectedWorks";

const WorkLayout = memo(function WorkLayout() {

  return (
    <div>
      <SelectedWorks />
      <GithubGraphQl />
      <Footer />
    </div>
  )

}, () => true);

export default WorkLayout;