import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product, ProductPayload } from '../models/product';
import { catchError, map, Observable, Subject, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private httpClient: HttpClient) {}

  errorSubject = new Subject<HttpErrorResponse>();
  NESTJS_BASE_URL = 'http://localhost:3000/products';
  createProduct(product: ProductPayload): void {
    this.httpClient
      .post<{ name: string }>(this.NESTJS_BASE_URL, product)
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
      .delete(this.NESTJS_BASE_URL + '/' + id)
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
    return this.httpClient.get<Product[]>(this.NESTJS_BASE_URL).pipe(
      map((response) => {
        return [...response];
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  updateProduct(id: string, product: ProductPayload) {
    this.httpClient
      .put(this.NESTJS_BASE_URL + '/' + id, product)
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
      .get<ProductPayload>(this.NESTJS_BASE_URL + '/' + id)
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
