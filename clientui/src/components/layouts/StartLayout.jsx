import React, { memo } from "react";
import Footer from "@/components/Footer";
import EmergencyCTA from "@/components/basic/EmergencyCTA";
import CreateSomething from "@/components/CreateSomething";

const StartLayout = memo(function StartLayout() {
  return (
    <div>
      <CreateSomething />
      <EmergencyCTA />
      {/* <Footer /> */}
    </div>
  );
});

export default StartLayout;