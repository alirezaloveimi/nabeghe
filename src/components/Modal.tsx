"use client";

import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

import { useDisableScroll } from "@/hooks/useDisableScroll";
import { IoMdClose } from "react-icons/io";

type ModalProps = {
  show: boolean;
  title?: string;
  onHide: () => void;
};

export default function Modal({
  show,
  onHide,
  title,
  children,
}: PropsWithChildren<ModalProps>) {
  useDisableScroll(show);

  return createPortal(
    <div
      className={`flex-align-center justify-center fixed inset-0 z-50 transition-all duration-300 ${
        show
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        onClick={onHide}
        className="fixed inset-0 bg-secondary/80 -z-10 cursor-pointer"
      ></div>

      <div
        className={`w-[90%] max-w-[500px] p-6 bg-background rounded-2xl space-y-4 transition-all duration-300 ${
          show ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <div className="flex-between-center">
          {title && <h2 className="text-lg font-bold">{title}</h2>}
          <button
            type="button"
            className="outline-none text-foreground hover:text-red-500 mr-auto"
            onClick={onHide}
          >
            <IoMdClose className="text-2xl" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>,
    document.getElementById("portal-root")!
  );
}
