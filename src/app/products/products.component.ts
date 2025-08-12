// src/app/products/products.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { Product, ProductPayload } from '../models/product';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

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
  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
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
      this.productsService
        .updateProduct(this.selectedProduct.id, newProduct)
        .subscribe();
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
    this.productsService.getAllProducts().subscribe((products) => {
      this.products = products;
      this.isLoading = false;
    });
  }

  onDeleteProduct(id: string): void {
    this.productsService.deleteProduct(id).subscribe();
  }
}
