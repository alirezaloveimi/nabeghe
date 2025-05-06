"use client";

import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  icon?: React.ReactNode;
  width?: number;
  isLink?: boolean;
  pending?: boolean;
  href?: string;
  onClick?: () => void;
};

export default function Button({
  isLink = false,
  pending = false,
  type = "button",
  children,
  href,
  icon,
  onClick,
  width,
}: ButtonProps) {
  const baseStyles =
    "flex-center gap-x-2 h-11 bg-primary rounded-full text-primary-foreground transition-all hover:opacity-80 px-4 disabled:opacity-50 disabled:cursor-not-allowed";

  const widthSize = width ? width + "px" : "100%";

  if (isLink && href) {
    return (
      <Link style={{ width: widthSize }} href={href} className={baseStyles}>
        <span className="font-bold text-sm">{children}</span>
        {icon}
      </Link>
    );
  }

  return (
    <button
      style={{ width: widthSize }}
      className={baseStyles}
      onClick={onClick}
      disabled={pending}
      type={type}
    >
      <span className="font-bold text-sm">
        {pending ? "صبر کنید..." : children}
      </span>
      {icon}
    </button>
  );
}
