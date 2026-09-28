export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface ProductOption {
  type: string;
  label: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  options: ProductOption[];

  price: number;
  originalPrice: number;

  stock: number;
  images: string[];
}
export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  brand: string;
  // price: number;
  // discountPercentage: number;
  // originalPrice: number;
  rating: number;
  reviews: number;
  badge?: string;
  offers: string[];
  variants: ProductVariant[];
}
