"use client";
import { usePathname } from "next/navigation";
import { MoveLeft, Package2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface SidebarProps {
  items: NavItem[];
  type?: "Admin" | "Market";
}

export default function Sidebar({ items, type = "Admin" }: SidebarProps) {
  const pathname = usePathname();

  const adminSettings = {
    title: "Admin Panel",
    title_link: "/admin",
    footerlink: <div></div>,
  };
  const marketSettings = {
    title: "Market Panel",
    title_link: "/market",
    footerlink: (
      <a href="/" className="flex items-center gap-2 font-semibold">
        <MoveLeft className="h-4 w-4" />
        <span className="text-sm">Back to game</span>
      </a>
    ),
  };
  let settings = type === "Market" ? marketSettings : adminSettings;

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <a href={settings.title_link} className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">{settings.title}</span>
          </a>
        </div>
        <div className="flex-1 flex flex-col">
          <nav className="grid items-start px-2 pt-2 text-sm font-medium lg:px-4">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-auto p-6">{settings.footerlink}</div>
        </div>
      </div>
    </div>
  );
}
