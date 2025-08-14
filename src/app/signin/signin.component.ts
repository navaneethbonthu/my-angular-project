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
  authObs: Observable<AuthResponse> | null = null;

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
      this.authMessage = 'Entered Details is incorrect.';
      this.authStatus = 'error';
      return;
    }
    if (this.isLoginMode) {
      this.isLoading = true;
      this.authObs = this.authService.login(
        this.signinForm.value.username,
        this.signinForm.value.password
      );
    } else {
      this.isLoading = true;
      this.authObs = this.authService.signup(
        this.signinForm.value.username,
        this.signinForm.value.password
      );
    }
    this.authObs.subscribe({
      next: (response) => {
        this.authMessage = 'User signed up successfully.';
        this.authStatus = 'success';
        this.isLoading = false;
        // console.log(response);
        this.router.navigate(['/products']);
      },
      error: (errorMsg) => {
        this.authMessage = errorMsg;
        this.authStatus = 'error';
        this.isLoading = false;
      },
    });
    // this.signinForm.reset();
  }

  onSwithchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.signinForm.reset();
  }
}
