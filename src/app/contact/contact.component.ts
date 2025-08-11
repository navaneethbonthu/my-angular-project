import { Component } from '@angular/core';
import { CanDeactivateComponent } from '../guards/auth.guard';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements CanDeactivateComponent {
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };
  isSubmitted = false;
  constructor() {}

  onSubmit() {
    this.isSubmitted = true;
  }
  canExitFormThisRoute() {
    if (this.isSubmitted) {
      return confirm('You have unsaved changes. Do you really want to leave?');
    } else {
      return true;
    }
  }
}
