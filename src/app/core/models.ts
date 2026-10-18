export type AccountType = 'Chequing' | 'Savings';

export interface Account {
  id: number;
  name: string;
  type: AccountType;
  balance: number;
}

export type TransactionType = 'Initial Deposit' | 'Transfer In' | 'Transfer Out';

export interface Transaction {
  id: number;
  accountId: number;
  type: TransactionType;
  amount: number;        // always positive; the type says which direction
  description: string;
  date: Date;
  balanceAfter: number;  // account balance right after this transaction
}