import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

// Define an enum or union type for snackbar types for better type safety
export type SnackbarType = 'success' | 'error' | 'warning' | 'info';
@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarComponent implements OnInit {
  // Inputs to receive data from the parent component
  @Input() message: string = 'Default message.';
  @Input() snackbarType: SnackbarType = 'error'; // Default type is 'info'
  @Input() autoHideDuration: number = 5000; // Default to 3 seconds

  // Output to notify the parent when the snackbar should be closed
  @Output() close = new EventEmitter<void>();

  private autoHideTimeout: any;

  ngOnInit(): void {
    // Start auto-hide timer when the snackbar initializes (becomes visible)
    if (this.autoHideDuration > 0) {
      this.startAutoHideTimer();
    }
  }

  // Method called when the close button is clicked
  onClose(): void {
    this.emitCloseEvent();
  }

  private startAutoHideTimer(): void {
    // Clear any existing timer to prevent multiple timers running
    this.clearAutoHideTimer();

    this.autoHideTimeout = setTimeout(() => {
      this.emitCloseEvent();
    }, this.autoHideDuration);
  }

  private clearAutoHideTimer(): void {
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
    }
  }

  private emitCloseEvent(): void {
    this.clearAutoHideTimer(); // Clear timer immediately when manually closed or event is emitted
    this.close.emit();
  }

  // Lifecycle hook to clean up the timer when the component is destroyed
  ngOnDestroy(): void {
    this.clearAutoHideTimer();
  }
}
