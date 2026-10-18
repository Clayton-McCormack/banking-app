import { Component, computed, input, output } from '@angular/core';
import { AccountType } from '../../core/models';

@Component({
  selector: 'app-button',
  standalone: false,
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  label = input.required<string>();
  accountType = input<AccountType | null>(null);
  type = input<'button' | 'submit'>('button');
  disabled = input(false);

  clicked = output<void>();

  buttonClass = computed(() => {
    switch (this.accountType()) {
      case 'Chequing':
        return 'btn btn-primary app-btn app-btn-chequing';
      case 'Savings':
        return 'btn btn-success app-btn app-btn-savings';
      default:
        return 'btn btn-dark app-btn';
    }
  });
}