import type { ProductItem } from "@/model/model";
import ProductImg1 from "@/assets/products/FZ-101.jpeg";
import ProductImg2 from "@/assets/products/FZ-102.jpeg";
import ProductImg3 from "@/assets/products/FZ-103.jpeg";
import ProductImg4 from "@/assets/products/FZ-404.jpeg";

export const productList: ProductItem[] = [
  {
    id: "FA-101",
    price: 3500,
    isNew: true,
    name: "Product 1",
    image: ProductImg1,
    rating: 2.3,
    discountPercent: 0,
    description: "Something about this product",
  },
  {
    id: "FA-102",
    price: 3800,
    isNew: false,
    name: "Product 1",
    image: ProductImg2,
    rating: 2.3,
    discountPercent: 46,
    description: "Something about this product",
  },
  {
    id: "FA-103",
    price: 3200,
    isNew: false,
    name: "Product 1",
    image: ProductImg3,
    rating: 2.3,
    discountPercent: 0,
    description: "Something about this product",
  },
  {
    id: "FA-404",
    price: 4200,
    isNew: true,
    name: "Product 1",
    image: ProductImg4,
    rating: 2.3,
    discountPercent: 4.6,
    description: "Something about this product",
  },
];

export const featuredProducts: ProductItem[] = [
  {
    id: "FA-101",
    price: 3900,
    isNew: true,
    name: "Product 1",
    image: ProductImg4,
    rating: 4.3,
    discountPercent: 10,
    description: "Something about this product",
  },
  {
    id: "FA-102",
    price: 3500,
    isNew: false,
    name: "Product 2",
    image: ProductImg1,
    rating: 2.3,
    discountPercent: 24.0,
    description: "Something about this product",
  },
  {
    id: "FA-103",
    price: 3000,
    isNew: false,
    name: "Product 3",
    image: ProductImg3,
    rating: 5.0,
    discountPercent: 4.6,
    description: "Something about this product",
  },
];

export interface Catergory {
  name: string;
  id: string;
  products?: ProductItem[];
}

export const categories: Catergory[] = [
  {
    name: "Air Coolers",
    id: "air-coolers",
    products: productList,
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
