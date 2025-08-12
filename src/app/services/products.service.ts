import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product, ProductPayload } from '../models/product';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private httpClient: HttpClient) {}

  createProduct(product: ProductPayload): void {
    this.httpClient
      .post<{ name: string }>(
        `https://angular-learning-5eefb-default-rtdb.firebaseio.com/products.json`,
        product
      )
      .subscribe({
        next: (response) => {
          console.log('Added product:', response);
        },
        error: (error) => {
          console.error('Error adding product:', error);
        },
      });
  }

  deleteProduct(id: string) {
    return this.httpClient.delete(
      `https://angular-learning-5eefb-default-rtdb.firebaseio.com/products/${id}.json`
    );
  }

  getAllProducts(): Observable<Product[]> {
    return this.httpClient
      .get<{ [key: string]: Product }>(
        `https://angular-learning-5eefb-default-rtdb.firebaseio.com/products.json`
      )
      .pipe(
        map((responseData: { [key: string]: Product }) => {
          const productsArray: Product[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              productsArray.push({ ...responseData[key], id: key });
            }
          }
          return productsArray;
        })
      );
  }

  updateProduct(id: string, product: ProductPayload) {
    return this.httpClient.put(
      `https://angular-learning-5eefb-default-rtdb.firebaseio.com/products/${id}.json`,
      product
    );
  }
}
