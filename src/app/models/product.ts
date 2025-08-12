export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export type ProductPayload = Omit<Product, 'id'>;
