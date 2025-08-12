import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent {
  @Input() isEditMode = false;
  @Input() selectedProduct: Product | null = null;
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

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.isEditMode && this.selectedProduct) {
        this.productForm.patchValue({
          ...this.selectedProduct,
        });
      }
    }, 0);
  }
  onSubmit(): void {
    if (this.productForm.valid) {
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
