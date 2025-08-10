import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;
  isLoginMode = false;
  user: User | null = null;
  authService: AuthService = inject(AuthService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  constructor(private fb: FormBuilder) {
    this.signinForm = this.fb.group({
      username: [''],
      password: [''],
    });
  }
  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((queryParams) => {
      const logout = Boolean(queryParams.get('logout'));
      if (logout) {
        this.authService.logout();
        alert('You have been logged out successfully.');
      }
    });
  }

  onSubmit() {
    const user = this.authService.login(
      this.signinForm.value.username,
      this.signinForm.value.password
    );
    console.log('user', user);

    if (!user) {
      alert('Invalid username or password');
    } else {
      alert(`Welcome ${user?.username}`);
      this.router.navigate(['/products']);
    }
  }
  onSwithchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.signinForm.reset();
  }
}
