import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Add this import
import { Observable, Subscription } from 'rxjs';
import { Product, ProductPayload } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  selectedProduct: ProductPayload | undefined;
  // paramId: string | null = null;
  private paramSubscription: Subscription | undefined;
  isLoading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.paramSubscription = this.activatedRoute.paramMap.subscribe(
      (params) => {
        const productId = params.get('id');
        if (productId) {
          this.isLoading = true;
          this.productsService.getProduct(productId).subscribe({
            next: (product: ProductPayload) => {
              console.log('selectedProduct', product);
              this.selectedProduct = product;
              this.isLoading = false;
            },
          });
        } else {
          this.selectedProduct = undefined;
        }
      }
    );
  }
  ngOnDestroy(): void {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
  }
}
