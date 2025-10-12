import React from "react";
import { Outlet } from "react-router-dom";

const TopupLayout = () => {
  return (
    <section className="px-4 py-4">
      <Outlet />
    </section>
  );
};

export default TopupLayout;
