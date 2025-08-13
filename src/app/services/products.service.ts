import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product, ProductPayload } from '../models/product';
import { catchError, map, Observable, Subject, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private httpClient: HttpClient) {}

  errorSubject = new Subject<HttpErrorResponse>();

  createProduct(product: ProductPayload): void {
    this.httpClient
      .post<{ name: string }>(
        `https://angular-learning-5eefb-default-rtdb.firebaseio.com/products.json`,
        product
      )
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      )
      .subscribe({
        error: (error) => {
          this.errorSubject.next(error);
        },
      });
  }

  deleteProduct(id: string) {
    this.httpClient
      .delete(
        `https://angular-learning-5eefb-default-rtdb.firebaseio.com/products/${id}.json`
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      )
      .subscribe({
        error: (error) => {
          this.errorSubject.next(error);
        },
      });
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
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  updateProduct(id: string, product: ProductPayload) {
    this.httpClient
      .put(
        `https://angular-learning-5eefb-default-rtdb.firebaseio.com/products/${id}.json`,
        product
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      )
      .subscribe({
        error: (error) => {
          this.errorSubject.next(error);
        },
      });
  }

  getProduct(id: string): Observable<ProductPayload> {
    return this.httpClient
      .get<ProductPayload>(
        `https://angular-learning-5eefb-default-rtdb.firebaseio.com/products/${id}.json`
      )
      .pipe(
        map((response) => {
          return { ...response };
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
}
