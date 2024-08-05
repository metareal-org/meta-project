"use client"
import { useUserStore } from "@/store/player-store/useUserStore";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Admin() {
  const { user } = useUserStore();

  useEffect(() => {
    if (user) {
      redirect("/market/lands");
    }
  }, [user]);
}
