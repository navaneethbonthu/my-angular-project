// src/app/products/products.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { Product, ProductPayload } from '../models/product';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  showAddProductModal: boolean = false;
  isEdit: boolean = false;
  selectedProduct: Product | null = null;
  isLoading: boolean = false;
  errorSub: Subscription | null = null;
  errorMessage: string | null = null;
  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.errorSub = this.productsService.errorSubject.subscribe({
      next: (httpError) => {
        this.setErrorMessage(httpError);
      },
    });
    this.onGetAllProducts();
  }

  onModalCancel(): void {
    this.showAddProductModal = false;
  }

  openAddProductModal(): void {
    this.showAddProductModal = true;
    this.isEdit = false;
  }

  onProductAddOrUpdatSubmit(newProduct: ProductPayload): void {
    this.showAddProductModal = false;
    if (this.isEdit && this.selectedProduct) {
      this.productsService.updateProduct(this.selectedProduct.id, newProduct);
    } else {
      this.productsService.createProduct(newProduct);
    }
  }

  onEditProduct(id: string) {
    this.isEdit = true;
    this.showAddProductModal = true;
    this.selectedProduct =
      this.products.find((product) => product.id === id) || null;
    if (this.selectedProduct) {
      this.selectedProduct = this.selectedProduct as Product;
    }
  }

  onGetAllProducts(): void {
    this.isLoading = true;
    this.productsService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.productsService.errorSubject.next(error);
        this.isLoading = false;
      },
    });
  }

  onDeleteProduct(id: string): void {
    this.productsService.deleteProduct(id);
  }

  private setErrorMessage(err: HttpErrorResponse) {
    if (err.error.error === 'Permission denied') {
      this.errorMessage = 'You do not have permisssion to perform this action';
    } else {
      this.errorMessage = err.message;
    }

    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }
}
