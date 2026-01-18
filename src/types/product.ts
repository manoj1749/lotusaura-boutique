export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string;
  imagePath: string;
  category: string | null;
  createdAt: string | null;
}

export interface ProductWithTag extends Product {
  tag?: string;
  tagColor?: string;
}

export type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest';

export interface FilterOptions {
  categories: string[];
  priceRange: [number, number];
  sortBy: SortOption;
}
