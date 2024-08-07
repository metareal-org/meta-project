"use client";
import React, { useEffect } from "react";
import Sidebar from "@/components/admin/sidebar";
import Header from "@/components/admin/header";
import { LandPlot, AxeIcon, BoxIcon } from "lucide-react";
import { useUserStore } from "@/store/player-store/useUserStore";
import { redirect } from "next/navigation";

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  const { fetchUser } = useUserStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchUser();
      } catch (error) {
        console.error("Authentication failed:", error);
        redirect("/");
      }
    };
    checkAuth();
  }, [fetchUser]);

  const navItems = [
    { href: "/market/lands", icon: LandPlot, label: "Lands" },
    { href: "/market/scratches", icon: BoxIcon, label: "Scratches" },
    { href: "/market/assets", icon: AxeIcon, label: "Assets" },

  ];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar items={navItems} type="Market" />
      <div className="flex flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
