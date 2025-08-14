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

  tokenExpiresInTimer: any = null;

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
    this.user.next(null);
    // this.isAuthenticated = false;
    localStorage.removeItem('user');
    if (this.tokenExpiresInTimer) {
      clearTimeout(this.tokenExpiresInTimer);
    }

    this.tokenExpiresInTimer = null;
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

    this.autoLogout(+res.expiresIn * 1000);

    localStorage.setItem('user', JSON.stringify(user));
  }

  autoLogin() {
    const userItem = localStorage.getItem('user');
    const user = userItem ? JSON.parse(userItem) : null;
    if (!user) {
      return;
    }
    const loggedUser = new User(
      user.id,
      user.email,
      user._token,
      user._expiresIn
    );
    if (loggedUser.token) {
      this.user.next(loggedUser);
      const timerValue = +user._expiresIn.getTime() - new Date().getTime();
      this.autoLogout(2000);
    }
  }

  autoLogout(expirationTime: number) {
    this.tokenExpiresInTimer = setTimeout(() => {
      this.logout();
    }, expirationTime);
  }
}
