import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../models/product';
import { ProductsService } from '../services/products.service'; // <-- Import the service

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  searchTerm: string = '';
  products: Product[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    // this.products = this.productsService.products;
  }

  navigateToAppProducts() {
    this.router.navigate(['products']);
  }

  onSearch(query: string): void {
    if (query && query.trim() !== '') {
      this.router.navigate(['/products'], {
        queryParams: { search: query.trim() },
      });
    } else {
      this.router.navigate(['/products']);
    }
  }
}
