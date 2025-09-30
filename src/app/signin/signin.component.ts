import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthResponse } from '../models/authResponse';
// interface AuthResponse {
//   access_token: string;
// }
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;
  isLoginMode = true;
  user: User | null = null;
  activatedRoute = inject(ActivatedRoute);
  isLoading: boolean = false;
  authMessage: string = '';
  authStatus: 'error' | 'success' | 'info' | 'warning' = 'error';
  authObs: Observable<string | AuthResponse> | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signinForm = this.fb.group({
      username: [''],
      password: [''],
    });
  }
  ngOnInit(): void {
    this.signinForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
    this.activatedRoute.queryParamMap.subscribe((queryParams) => {
      const logout = Boolean(queryParams.get('logout'));
      if (logout) {
        this.authService.logout();
        this.authMessage = 'You have been logged out successfully.';
        this.authStatus = 'success';
      }
    });
  }

  onSubmit() {
    if (this.signinForm.invalid) {
      this.authMessage = 'Entered details are incorrect or incomplete.';
      this.authStatus = 'error';
      return;
    }

    this.isLoading = true;

    if (this.isLoginMode) {
      // Calls loginIntoNestJsServer from the AuthService
      this.authObs = this.authService.login(
        this.signinForm.value.username,
        this.signinForm.value.password
      );
    } else {
      // Calls the correct method name: signupIntoFirebase from the AuthService
      this.authObs = this.authService.signup(
        this.signinForm.value.username,
        this.signinForm.value.password
      );
    }

    if (this.authObs) {
      this.authObs.subscribe({
        next: (response) => {
          // Determine success message based on mode
          this.authMessage = this.isLoginMode
            ? 'Login successful! Redirecting...'
            : 'Registration successful. You can now log in.';

          this.authStatus = 'success';
          this.isLoading = false;

          // Note: The AuthService handles navigation to '/products' after successful login (tap operator)
          if (!this.isLoginMode) {
            // If signed up, redirect to login mode or stay on the current form state
            this.isLoginMode = true; // Switch to login mode
          }
          this.router.navigate(['/products']); // If successful, navigate to products
        },
        error: (errorMsg) => {
          // errorMsg is the string thrown by this.authService.handleAuthError
          this.authMessage = errorMsg;
          this.authStatus = 'error';
          this.isLoading = false;
        },
      });
    } else {
      console.log('Authentication observable is null.');
    }
    // Note: It's generally better to reset the form only on success or after the request completes,
    // but keeping it here as per your original structure.
    this.signinForm.reset();
  }

  onSwithchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.signinForm.reset();
  }
}
