import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userSubObs$: Subscription | null = null;
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userSubObs$ = this.authService.user.subscribe({
      next: (user) => {
        this.isLoggedIn = user ? true : false;
      },
      error: () => {
        console.log('Error occured while getting User Subject');
      },
    });
  }

  logout() {
    // this.authService.logout();
    // this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.userSubObs$?.unsubscribe();
  }
}
