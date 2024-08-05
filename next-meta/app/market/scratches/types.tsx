export interface ScratchBox {
    id: number;
    name: string;
    size: number;
    price: number;
    status: string;
    created_at: string;
    type: "single" | "bulk";
  }
  
  export interface Land {
    id: number;
    name: string;
  }