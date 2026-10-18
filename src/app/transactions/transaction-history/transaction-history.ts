import { Component, computed, inject, signal } from '@angular/core';
import { AccountService } from '../../core/account-service';
import { TransactionType } from '../../core/models';

type TypeFilter = 'All' | TransactionType;

@Component({
  selector: 'app-transaction-history',
  standalone: false,
  templateUrl: './transaction-history.html',
  styleUrl: './transaction-history.scss',
})
export class TransactionHistory {
  private accountService = inject(AccountService);

  readonly accounts = this.accountService.accounts;
  readonly typeOptions: TypeFilter[] = ['All', 'Initial Deposit', 'Transfer In', 'Transfer Out'];

  // These three are bound two-way to the inputs with [(ngModel)].
  readonly selectedAccountId = signal<number | null>(null);
  readonly searchTerm = signal('');
  readonly typeFilter = signal<TypeFilter>('All');

  readonly selectedAccount = computed(
    () => this.accounts().find(a => a.id === this.selectedAccountId()) ?? null
  );

  // Recalculates when the selected account changes or new transactions are added.
  readonly transactions = computed(() => {
    const id = this.selectedAccountId();
    return id === null ? [] : this.accountService.getTransactions(id);
  });

  readonly filteredTransactions = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const type = this.typeFilter();

    return this.transactions().filter(t => {
      const matchesType = type === 'All' || t.type === type;
      const matchesSearch =
        term === '' ||
        t.description.toLowerCase().includes(term) ||
        t.type.toLowerCase().includes(term) ||
        t.amount.toFixed(2).includes(term);
      return matchesType && matchesSearch;
    });
  });

  constructor() {
    // Show the first account's history by default, if there is one.
    const first = this.accounts()[0];
    if (first) {
      this.selectedAccountId.set(first.id);
    }
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.typeFilter.set('All');
  }
}