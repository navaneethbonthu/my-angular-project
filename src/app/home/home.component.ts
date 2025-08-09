import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  searchTerm: string = '';
  products = [
    {
      id: 1,
      name: 'Dynamic Tech Tee',
      price: 39.99,
      image:
        'https://images.unsplash.com/photo-1521572178398-e0294e77d547?fit=crop&w=600&q=80',
    },
    {
      id: 2,
      name: 'Urban Explorer Hoodie',
      price: 75.0,
      image:
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?fit=crop&w=600&q=80',
    },
    {
      id: 3,
      name: 'Elevated Bomber Jacket',
      price: 119.99,
      image:
        'https://images.unsplash.com/photo-1543087900-4b6845c4858b?fit=crop&w=600&q=80',
    },
  ];

  constructor(private router: Router) {}

  get filteredProducts() {
    if (!this.searchTerm) return this.products;
    return this.products.filter((product) =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onSearch() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/products'], {
        queryParams: { search: this.searchTerm },
      });
    }
  }
}
