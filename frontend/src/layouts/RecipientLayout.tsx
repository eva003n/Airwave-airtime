import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { Link, Outlet } from "react-router-dom";

const RecipientLayout = () => {
  return (
    <section className="px-4 py-4">
      <Outlet />
    </section>
  );
};

export default RecipientLayout;
