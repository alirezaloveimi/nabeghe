import Link from "next/link";

import { navItems } from "@/data";
import { getUser } from "@/util/user";

import { LuUser } from "react-icons/lu";
import { FiLogIn } from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";

import ToggleTheme from "./ToggleTheme";
import ToggleSidebarBtn from "./ToggleSidebarBtn";
import Logo from "./Logo";

export default async function Header() {
  const user = await getUser();
  const role = user?.role;

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container">
        <div className="flex-align-center gap-8 h-20">
          <div className="flex-align-center gap-x-3">
            <ToggleSidebarBtn />
            <Logo />
          </div>

          <ul className="hidden lg:flex-align-center gap-x-5">
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

          <div className="flex-align-center gap-x-1.5 mr-auto">
            <ToggleTheme />

            {user && (
              <Link
                href="/cart"
                className="grid-center size-10 bg-secondary rounded-full text-foreground text-xl relative"
              >
                <IoCartOutline className="text-xl" />
                <span className="absolute -top-1 left-0 flex size-5">
                  <span className="animate-ping absolute inline-flex size-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative flex-center rounded-full size-5 bg-primary text-primary-foreground font-bold text-xs">
                    {user?.cart?.length}
                  </span>
                </span>
              </Link>
            )}

            <Link
              href={!user ? "/register-login" : `/p-${role?.toLowerCase()}`}
              className="grid-center size-10 bg-secondary rounded-full text-foreground text-xl"
            >
              {user ? <LuUser /> : <FiLogIn />}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
