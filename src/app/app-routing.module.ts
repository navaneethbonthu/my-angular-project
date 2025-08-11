import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { ContactComponent } from './contact/contact.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SigninComponent } from './signin/signin.component';
import { CheckoutComponent } from './checkout/checkout.component';
import {
  canActivateChildFn,
  canActivateFn,
  canDeactivateFn,
} from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'products',
    // canActivate: [canActivateFn],
    // canActivateChild: [canActivateChildFn],
    children: [
      { path: '', component: ProductsComponent },
      {
        path: 'checkout',
        component: CheckoutComponent,
        canActivate: [canActivateFn],
      },
      {
        path: ':id',
        component: ProductDetailsComponent,
        canActivate: [canActivateFn],
      },
    ],
  },

  {
    path: 'contact',
    component: ContactComponent,
    canDeactivate: [canDeactivateFn],
  },
  { path: 'signin', component: SigninComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
