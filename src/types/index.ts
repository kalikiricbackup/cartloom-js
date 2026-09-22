export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  brand: string;
  price: number;
  discountPercentage: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  badge?: string;
  image: string;
}
