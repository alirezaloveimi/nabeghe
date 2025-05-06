"use client";
import { createPortal } from "react-dom";

import { useTheme } from "@/hooks/useTheme";
import { useDisableScroll } from "@/hooks/useDisableScroll";

import { navItems } from "@/data";
import { IoMdClose } from "react-icons/io";

import Logo from "./Logo";
import Switch from "./Switch";
import Link from "next/link";

type SidebarProps = {
  show: boolean;
  hasTransitionedIn: boolean;
  onClose: () => void;
};

export default function Sidebar({
  hasTransitionedIn,
  onClose,
  show,
}: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  useDisableScroll(show);

  return createPortal(
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        show && hasTransitionedIn
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-secondary/80 -z-10 cursor-pointer"
      ></div>

      <div
        className={`relative w-80 sm:w-72 h-full bg-background rounded-l-2xl transition-transform duration-300 ${
          show && hasTransitionedIn ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex-between-center p-4">
          <Logo />

          <button
            className="outline-none text-foreground hover:text-red-500"
            onClick={onClose}
          >
            <IoMdClose className="text-2xl" />
          </button>
        </div>

        <div className="space-y-5 p-4">
          <div className="h-px bg-border"></div>
          <Switch
            isChecked={theme === "dark"}
            onChange={toggleTheme}
            label="تم تاریک"
          />
          <div className="h-px bg-border"></div>

          <ul className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  className="w-full flex-align-center gap-x-2 text-muted transition-all hover:text-foreground py-2"
                  href={item.href}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>,
    document.getElementById("portal-root")!
  );
}
