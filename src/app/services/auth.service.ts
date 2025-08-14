import { Injectable, inject } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthResponse } from '../models/authResponse';
import { BehaviorSubject, catchError, Subject, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  private isAuthenticated = false;

  userService: UserService = inject(UserService);
  user = new BehaviorSubject<User | null>(null);

  login(email: string, password: string) {
    const user = { email, password, returnSecureToken: true };
    return this.httpClient
      .post<AuthResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAcMIliHh2XmAR5mGU07CbE6Z30Q3KSIY8',
        user
      )
      .pipe(
        tap((res: AuthResponse) => {
          this.handleUser(res);
        }),
        catchError((errorRes: HttpErrorResponse) => this.handleError(errorRes))
      );
  }

  signup(email: string, password: string) {
    const user = { email, password, returnSecureToken: true };
    return this.httpClient
      .post<AuthResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAcMIliHh2XmAR5mGU07CbE6Z30Q3KSIY8',
        user
      )
      .pipe(
        tap((res: AuthResponse) => {
          this.handleUser(res);
        }),
        catchError((errorRes: HttpErrorResponse) => this.handleError(errorRes))
      );
  }

  logout() {
    this.isAuthenticated = false;
    console.log('User logged out');
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => new Error(errorMessage));
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email address already exists.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email address was not found.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
      case 'USER_DISABLED':
        errorMessage = 'This user account has been disabled.';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'The email and password is not correct.';
        break;
    }
    return throwError(() => errorMessage);
  }

  private handleUser(res: AuthResponse) {
    const expiresInTs = new Date().getTime() + +res.expiresIn * 1000;
    const expiresIn = new Date(expiresInTs);
    const user = new User(res.localId, res.email, res.idToken, expiresIn);
    this.user.next(user);
  }
}
