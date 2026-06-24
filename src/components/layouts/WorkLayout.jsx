import React, { memo } from "react";
import Footer from "@/components/Footer";
import GithubGraphQl from "@/components/GithubGraphQl";
import SelectedWorks from "@/components/SelectedWorks";
import SelectedWorksV2 from "../SelectedWorksV2";

const WorkLayout = memo(function WorkLayout() {

  return (
    <div>
      <SelectedWorksV2 />
      {/* <SelectedWorks /> */}
      {/* <GithubGraphQl /> */}
      {/* <Footer /> */}
    </div>
  )

}, () => true);

export default WorkLayout;