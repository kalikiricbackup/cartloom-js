export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface HomeCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  productCount: number;
}
 
export interface HomePageData {
  topCategories: HomeCategory[];
  bestDeals: Product[];
  products?: Product[];
}

export interface ProductOption {
  type: string;
  label: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  productId?: number;
  slug?: string;
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
  rating: number;
  reviews: number;
  badge?: string | null;
  offers: string[];
  variants: ProductVariant[];
}
