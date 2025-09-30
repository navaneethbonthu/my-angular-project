import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../models/authResponse';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userSubObs$: Subscription | null = null;
  isLoggedIn: boolean = false;
  user: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userSubObs$ = this.authService.currentUser$.subscribe({
      next: (user) => {
        console.log(typeof user);

        this.isLoggedIn = !!user;
      },
      error: () => {
        console.error(
          'Error occurred while subscribing to current user state.'
        );
      },
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }

  ngOnDestroy(): void {
    this.userSubObs$?.unsubscribe();
  }
}
