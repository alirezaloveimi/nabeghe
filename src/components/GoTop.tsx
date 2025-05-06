"use client";
import { MdArrowUpward } from "react-icons/md";

export default function GoTop() {
  const toToTopHandler = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={toToTopHandler}
      type="button"
      className="h-11 inline-flex items-center gap-3 bg-secondary rounded-full text-foreground font-bold transition-colors hover:text-primary px-4"
    >
      <span className="text-sm">بازگشت به بالا</span>
      <MdArrowUpward />
    </button>
  );
}
