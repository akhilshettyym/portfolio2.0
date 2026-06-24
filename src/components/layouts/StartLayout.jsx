import React, { memo } from "react";
import Footer from "@/components/Footer";
import CreateSomething from "@/components/CreateSomething";

const StartLayout = memo(function StartLayout() {

    return (
    <div>
      {/* <CreateSomething /> */}
      {/* <Footer /> */}
    </div>
  )

}, () => true);

export default StartLayout;