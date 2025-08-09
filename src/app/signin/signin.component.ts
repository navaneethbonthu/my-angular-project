import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent {
  signinForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  get f() {
    return this.signinForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.signinForm.invalid) {
      return;
    }
    // Handle successful login here
    console.log(this.signinForm.value);
  }
}
