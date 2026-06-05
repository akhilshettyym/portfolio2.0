import React from "react";
import GithubGraphQl from "../GithubGraphQl";
import SelectedWorks from "../SelectedWorks";

const WorkLayout = () => {
  return (
    <div>
      <SelectedWorks />
      <GithubGraphQl />
    </div>
  )
}

export default WorkLayout;