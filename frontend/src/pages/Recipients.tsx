import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

const Recipients = () => {
  return (
    <section className="px-4">
      <Link to={"/recipients"}>
        <Button>
          <ChevronLeft  size={30} strokeWidth={3}/> Back
        </Button>
      </Link>

      <Outlet/>
    </section>
  );
};

export default Recipients;
