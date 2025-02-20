export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  __v: number;
  quantity?: number; // Campo opcional para manejar la cantidad seleccionada
}

export type ProductList = Product[];
