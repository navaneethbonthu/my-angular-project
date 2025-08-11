import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent {
  @Output() productAdded = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  productForm!: FormGroup;
  ngOnInit(): void {
    this.productForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      price: new FormControl(0, [Validators.required, Validators.min(0.01)]),
      image: new FormControl('', [Validators.required]),
    });
  }
  onSubmit(): void {
    this.cancel.emit();
    if (this.productForm.valid) {
      console.log('Product to be added:', this.productForm.value);
      this.productAdded.emit(this.productForm.value);
      this.productForm.reset();
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.productForm.reset();
    this.cancel.emit();
  }
}
