export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  description: string;
  image: string;
  specs?: {
    label: string;
    value: string;
  }[];
  weight?: string[];
}

export interface Article {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  date: string;
}
