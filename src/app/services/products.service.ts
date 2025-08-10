import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  products = [
    {
      id: 1,
      name: 'Dynamic Tech Tee',
      price: 39.99,
      image: 'https://placehold.co/400x300/e2e6ea/6c757d?text=Dynamic Tech Tee',
    },
    {
      id: 2,
      name: 'Urban Explorer Hoodie',
      price: 75.0,
      image:
        'https://placehold.co/400x300/e2e6ea/6c757d?text=Urban Explorer Hoodie',
    },
    {
      id: 3,
      name: 'Elevated Bomber Jacket',
      price: 119.99,
      image:
        'https://placehold.co/400x300/e2e6ea/6c757d?text=Elevated Bomber Jacket',
    },
  ];
}
