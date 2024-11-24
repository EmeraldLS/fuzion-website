import type { ProductItem } from "@/model/model";
export interface Catergory {
  name: string;
  id: string;
  products?: ProductItem[];
}

export const categories: Catergory[] = [
  {
    name: "Air Coolers",
    id: "air-coolers",
  },
  {
    name: "Almirahs",
    id: "almirahs",
  },
  {
    name: "Iron rod",
    id: "iron-rod",
  },
  { name: "Other electronics", id: "others" },
];
