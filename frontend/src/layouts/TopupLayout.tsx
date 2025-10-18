import { Button} from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { Link, Outlet } from "react-router-dom";

const TopupLayout = () => {
  return (
    <section className="px-4  grid gap-2">
      <Link to={"/top-ups"}>
        <Button className="">
          <ChevronLeft size={30} strokeWidth={2} /> Back
        </Button>
      </Link>
      <Outlet />
    </section>
  );
};

export default TopupLayout;
