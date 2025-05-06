"use client";

import { useEffect, useState } from "react";

import { useMountTransition } from "@/hooks/useMountTransition";
import { usePathname } from "next/navigation";

import { FiMenu } from "react-icons/fi";

import Sidebar from "./Sidebar";

export default function ToggleSidebarBtn() {
  const [show, setShow] = useState(false);
  const hasTransitionedIn = useMountTransition(show);

  const pathname = usePathname();

  useEffect(() => {
    setShow(false);
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        className="size-10 grid-center lg:hidden bg-secondary rounded-full text-foreground"
        onClick={() => setShow(!show)}
      >
        <FiMenu className="text-xl" />
      </button>

      {(show || hasTransitionedIn) && (
        <Sidebar
          hasTransitionedIn={hasTransitionedIn}
          onClose={() => setShow(false)}
          show={show}
        />
      )}
    </>
  );
}
