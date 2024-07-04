import { create } from "zustand";

interface InventoryItem {
  name: string;
  count: number;
  imgSrc: string;
  className?: string; 
}

interface InventoryStore {
  items: InventoryItem[];
  addItem: (item: InventoryItem) => void;
  removeItem: (name: string) => void;
  updateItemCount: (name: string, count: number) => void;
}

export const useInventoryStore = create<InventoryStore>((set) => ({
  items: [
    {
      name: "Ticket",
      count: 0,
      imgSrc: "/assets/images/inventory/ticket_icon.webp",
      className: "inventory-ticket-target",
    },
    {
      name: "Gift",
      count: 0,
      imgSrc: "/assets/images/inventory/gift_icon.webp",
      className: "inventory-gift-target",
    },
  ],
  addItem: (newItem) =>
    set((state) => ({
      items: [...state.items, newItem],
    })),
  removeItem: (name) =>
    set((state) => ({
      items: state.items.filter((item) => item.name !== name),
    })),
  updateItemCount: (name, count) =>
    set((state) => ({
      items: state.items.map((item) => (item.name === name ? { ...item, count } : item)),
    })),
}));
