import { Component, inject } from '@angular/core';
import { ToastMessage, ToastService } from '../../../core/services/toast.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  messages: ToastMessage[] = [];
  private subscription: Subscription = new Subscription;

  private readonly toastService: ToastService = inject(ToastService);

  ngOnInit() {
    this.subscription = this.toastService.toastState$.subscribe((message: ToastMessage) => {
      this.messages.push(message);
      setTimeout(() => this.removeToast(message), 3000);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  removeToast(message: ToastMessage) {
    this.messages = this.messages.filter(msg => msg !== message);
  }
}
