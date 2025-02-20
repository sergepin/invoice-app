export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  __v: number;
  quantity?: number;
}

export type ProductList = Product[];
