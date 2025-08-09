import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Add this import

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent {
  // queryParams: any = {};

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.paramMap.subscribe((params) => {
      // this.params = params;
      // You can now use this.queryParams in your component
      // console.log(params.get('id'));
    });
  }
}
