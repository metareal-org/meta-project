"use client";
import React from "react";
import Sidebar from "@/components/admin/sidebar";
import Header from "@/components/admin/header";
import { Home, Hammer, PackageOpen, LandPlot, Building, Coins } from "lucide-react";

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { href: "/market/lands", icon: LandPlot, label: "Lands" },
    { href: "/market/scratches", icon: Building, label: "Scratches" },
    { href: "/market/auctions", icon: Hammer, label: "Auctions" },
    { href: "/market/offers", icon: PackageOpen, label: "Offers" },
    { href: "/market/transactions", icon: Coins, label: "Transactions" },
  ];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar items={navItems} />
      <div className="flex flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">{children}</main>
      </div>
    </div>
  );
}