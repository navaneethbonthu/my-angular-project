import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Add this import
import { Observable, Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  selectedProduct: Product | undefined;
  paramId: string | null = null;
  private paramSubscription: Subscription | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.paramSubscription = this.activatedRoute.paramMap.subscribe(
      (params) => {
        this.paramId = params.get('id');
        this.selectedProduct = this.productsService.products.find(
          (product) => product.id === Number(this.paramId)
        );
      }
    );
  }
  ngOnDestroy(): void {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
  }
}
