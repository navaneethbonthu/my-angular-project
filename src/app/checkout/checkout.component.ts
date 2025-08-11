import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../models/product';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  shippingForm!: FormGroup;
  paymentForm!: FormGroup;
  product: Product | undefined;
  cartItems = [
    {
      name: 'Ergonomic Office Chair',
      price: 299.99,
      quantity: 1,
      imageUrl: 'https://placehold.co/60x60/FF5733/FFFFFF?text=Chair',
    },
    {
      name: 'Wireless Mechanical Keyboard',
      price: 120.0,
      quantity: 1,
      imageUrl: 'https://placehold.co/60x60/33FF57/FFFFFF?text=Keyboard',
    },
    {
      name: '4K Ultra HD Monitor',
      price: 450.0,
      quantity: 1,
      imageUrl: 'https://placehold.co/60x60/3357FF/FFFFFF?text=Monitor',
    },
  ];

  subtotal: number = 0;
  shippingCost: number = 15.0;
  total: number = 0;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.product = history.state;
    console.log('Product from history state:', this.product);

    this.shippingForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
      country: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cardName: ['', Validators.required],
      expiry: [
        '',
        [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)],
      ],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      saveCard: [false],
    });

    this.calculateOrderSummary();
  }

  private calculateOrderSummary(): void {
    this.subtotal = this.cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    this.total = this.subtotal + this.shippingCost;
  }

  placeOrder(): void {
    if (this.shippingForm.valid && this.paymentForm.valid) {
      console.log('Shipping Information:', this.shippingForm.value);
      console.log('Payment Information:', this.paymentForm.value);
      console.log('Order Summary:', {
        items: this.cartItems,
        subtotal: this.subtotal,
        shipping: this.shippingCost,
        total: this.total,
      });

      alert('Order placed successfully! (This is a placeholder alert)');
    } else {
      this.shippingForm.markAllAsTouched();
      this.paymentForm.markAllAsTouched();
      alert('Please correct the errors in the form before placing your order.');
    }
  }
}
