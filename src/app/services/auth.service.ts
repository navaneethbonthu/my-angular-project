import { Injectable, inject } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  private isAuthenticated = false;

  userService: UserService = inject(UserService);

  login(username: string, password: string) {
    const user = this.userService.user.find(
      (u) => u.username === username && u.pssword === password
    );
    if (!user) {
      this.isAuthenticated = false;
    } else {
      this.isAuthenticated = true;
    }
    return user;
  }
  logout() {
    this.isAuthenticated = false;
    console.log('User logged out');
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}
