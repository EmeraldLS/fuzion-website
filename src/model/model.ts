export interface ProductItem {
  id: string;
  price: number;
  isNew: boolean;
  name: string;
  image: ImageMetadata;
  rating: number;
  discountPercent: number;
  description: string;
  category: string;
  specifications?: {
    size: string;
    motor: string;
    blade: string;
    pump: string;
    coating: string;
  };
}

export interface ProductItemResponse {
  id: number;
  product_id: string;
  price: number;
  is_new: boolean;
  name: string;
  image_url: string;
  rating: number;
  discount_percent: number;
  category: string;
  description: string;
  size: string;
  motor: string;
  blade: string;
  pump: string;
  coating: string;
}

export interface ImageUploadResponse {
  message: string;
  filePath: string;
}
