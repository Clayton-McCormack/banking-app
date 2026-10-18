import { Injectable, signal } from '@angular/core';
import { Account, AccountType, Transaction, TransactionType } from './models';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private nextAccountId = 1;
  private nextTransactionId = 1;

  // Private, writable state. Only this service can change it.
  private readonly accountsState = signal<Account[]>([]);
  private readonly transactionsState = signal<Transaction[]>([]);

  // Read-only versions that components can display.
  readonly accounts = this.accountsState.asReadonly();
  readonly transactions = this.transactionsState.asReadonly();

  createAccount(name: string, type: AccountType, initialBalance: number): Account {
    const account: Account = {
      id: this.nextAccountId++,
      name: name.trim(),
      type,
      balance: roundToCents(initialBalance),
    };

    this.accountsState.update(list => [...list, account]);
    this.addTransaction(account.id, 'Initial Deposit', account.balance, 'Account opened', account.balance);

    return account;
  }

  getAccount(id: number): Account | undefined {
    return this.accountsState().find(a => a.id === id);
  }

  getTransactions(accountId: number): Transaction[] {
    return this.transactionsState()
      .filter(t => t.accountId === accountId)
      .sort((a, b) => b.id - a.id); // newest first
  }

  transfer(fromId: number, toId: number, amount: number): void {
    const from = this.getAccount(fromId);
    const to = this.getAccount(toId);

    // The form validates these too, but the service checks again
    // so bad data can never get in.
    if (!from || !to) throw new Error('Account not found.');
    if (fromId === toId) throw new Error('Cannot transfer to the same account.');
    if (amount <= 0) throw new Error('Amount must be greater than 0.');
    if (amount > from.balance) throw new Error('Insufficient funds.');

    const newFromBalance = roundToCents(from.balance - amount);
    const newToBalance = roundToCents(to.balance + amount);

    this.accountsState.update(list =>
      list.map(a => {
        if (a.id === fromId) return { ...a, balance: newFromBalance };
        if (a.id === toId) return { ...a, balance: newToBalance };
        return a;
      })
    );

    this.addTransaction(fromId, 'Transfer Out', amount, `Transfer to ${to.name}`, newFromBalance);
    this.addTransaction(toId, 'Transfer In', amount, `Transfer from ${from.name}`, newToBalance);
  }

  private addTransaction(
    accountId: number,
    type: TransactionType,
    amount: number,
    description: string,
    balanceAfter: number
  ): void {
    const transaction: Transaction = {
      id: this.nextTransactionId++,
      accountId,
      type,
      amount: roundToCents(amount),
      description,
      date: new Date(),
      balanceAfter,
    };
    this.transactionsState.update(list => [...list, transaction]);
  }
}

// JavaScript decimals aren't exact (0.1 + 0.2 = 0.30000000000000004),
// so round money to 2 decimal places after every calculation.
function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
}