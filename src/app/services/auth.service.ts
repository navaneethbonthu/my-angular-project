import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // <-- Added HttpClient
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthResponse, JwtPayload } from '../models/authResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly NESTJS_BASE_URL = 'http://localhost:3000/auth';

  private currentUserSubject: BehaviorSubject<JwtPayload | null>;
  public currentUser$: Observable<JwtPayload | null>;

  // Inject HttpClient
  constructor(private router: Router, private http: HttpClient) {
    const initialUser = this.getToken()
      ? this.decodeToken(this.getToken()!)
      : null;
    this.currentUserSubject = new BehaviorSubject<JwtPayload | null>(
      initialUser
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  /**
   * Sends credentials to the NestJS login endpoint, processes the token, and handles errors.
   */
  login(username: string, password: string): Observable<AuthResponse | string> {
    const payload = { username, password };

    return this.http
      .post<AuthResponse>(`${this.NESTJS_BASE_URL}/login`, payload)
      .pipe(
        tap((response) => {
          this.handleLogin(response.access_token);
        }),
        catchError(this.handleAuthError)
      );
  }

  signup(username: string, password: string): Observable<any> {
    // Assuming 'signupIntoFirebase' is actually a call to your NestJS signup endpoint
    const payload = { username, password, email: username }; // Assuming username is used as email for signup

    return this.http.post<any>(`${this.NESTJS_BASE_URL}/signup`, payload).pipe(
      // The signup response typically doesn't contain the token immediately;
      // the user often needs to be redirected to login.
      // We'll return the response as is and let the component handle success.
      catchError(this.handleAuthError)
    );
  }

  // --- Token and State Management ---

  private handleAuthError(
    errorResponse: HttpErrorResponse
  ): Observable<string> {
    let errorMessage = 'An unknown error occurred!';

    if (!errorResponse.error || !errorResponse.error.message) {
      return throwError(() => errorMessage);
    }

    if (typeof errorResponse.error.message === 'string') {
      errorMessage = errorResponse.error.message;
    } else if (Array.isArray(errorResponse.error.message)) {
      errorMessage = errorResponse.error.message.join(', ');
    } else {
      errorMessage = errorResponse.error.error || errorResponse.statusText;
    }

    return throwError(() => errorMessage);
  }

  /**
   * Saves the token, extracts the user data, and notifies subscribers.
   * @param token The JWT received from the backend.
   */
  public handleLogin(token: string): void {
    if (token) {
      localStorage.setItem(this.TOKEN_KEY, token);

      const user = this.decodeToken(token);
      console.log('after decoding token  user is', user);

      if (user) {
        this.currentUserSubject.next(user);
        console.log('User logged in. Extracted username:', user.email);
      }
      this.router.navigate(['/products']);
    }
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private decodeToken(token: string): JwtPayload | null {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadBase64Padded = payloadBase64
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const payloadJson = atob(payloadBase64Padded);
      return JSON.parse(payloadJson) as JwtPayload;
    } catch (e) {
      console.error('Error decoding JWT:', e);
      return null;
    }
  }

  public logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/signin']);
  }
}
