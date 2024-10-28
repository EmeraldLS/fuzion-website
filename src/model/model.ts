export interface ProductItem {
  id: string;
  price: number;
  isNew: boolean;
  name: string;
  image: ImageMetadata;
  rating: number;
  discountPercent: number;
  description: string;
  specifications?: {
    size: string;
    motor: string;
    blade: string;
    pump: string;
    coating: string;
  };
}
