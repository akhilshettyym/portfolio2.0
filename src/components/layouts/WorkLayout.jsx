import React from "react";
import GithubGraphQl from "@/components/GithubGraphQl";
import SelectedWorks from "@/components/SelectedWorks";

const WorkLayout = () => {
  return (
    <div>
      <SelectedWorks />
      <GithubGraphQl />
    </div>
  )
}

export default WorkLayout;