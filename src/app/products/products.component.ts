import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product } from '../models/product';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  constructor(
    private productsService: ProductsService,
    private activatedRoute: ActivatedRoute
  ) {}

  products: Product[] = [];
  queryParamsSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.queryParamsSubscription = this.activatedRoute.queryParamMap.subscribe(
      (params) => {
        const searchQuery = params.get('search');
        if (searchQuery) {
          this.products = this.productsService.products.filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        } else {
          this.products = this.productsService.products;
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }
}
