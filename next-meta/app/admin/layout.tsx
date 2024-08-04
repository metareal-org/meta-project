"use client";
import React from "react";
import Sidebar from "@/components/admin/sidebar";
import Header from "@/components/admin/header";
import { Home, Hammer, PackageOpen, LandPlot } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { href: "/admin/dataset", icon: Home, label: "Dataset" },
    { href: "/admin/lands", icon: LandPlot, label: "Lands" },
    { href: "/admin/auctions", icon: Hammer, label: "Auctions" },
    { href: "/admin/scratches", icon: PackageOpen, label: "Scratches" },
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