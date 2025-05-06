"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AsideLinkProps = {
  id: number;
  title: string;
  href: string;
  icon: React.ReactNode;
};

export default function AsideLink({ href, title, icon }: AsideLinkProps) {
  const pathname = usePathname();
  const segments = href.split("/").filter(Boolean);
  const hasSubRoute = segments.length > 1;

  const isActivePath = hasSubRoute
    ? pathname.startsWith(href)
    : pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={`w-full h-11 px-4 flex-align-center transition-colors gap-x-3 ${
          isActivePath
            ? "bg-primary text-primary-foreground"
            : "bg-background text-muted hover:bg-primary hover:text-primary-foreground"
        } rounded-full`}
      >
        <span className="text-xl">{icon}</span>
        <span className="text-sm">{title}</span>
      </Link>
    </li>
  );
}
