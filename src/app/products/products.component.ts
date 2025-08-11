// src/app/products/products.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { Product } from '../models/product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  showAddProductModal: boolean = false;
  constructor(
    private router: Router,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.products = this.productsService.products;
  }

  onSubmit(): void {
    console.log('Product to be added:');
    const newId = this.products.length + 1;
  }

  // Method to open the modal
  openAddProductModal(): void {
    this.showAddProductModal = true;
  }
  onProductAdded(newProduct: any): void {
    const newId = this.products.length + 1; // Generate a simple mock ID
    this.products.push({ id: newId, ...newProduct });
    this.closeModal();
  }
  onModalCancel(): void {
    this.closeModal();
  }

  private closeModal(): void {
    this.showAddProductModal = false;
  }
}
