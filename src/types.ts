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
}

export interface Article {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  // Tournament specific fields
  location?: string;
  time?: string;
  rules?: string;
  fee?: string;
  participants?: string;
  prizes?: string;
}
