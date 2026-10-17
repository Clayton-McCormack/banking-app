import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionsRoutingModule } from './transactions-routing-module';
import { Transfer } from './transfer/transfer';
import { TransactionHistory } from './transaction-history/transaction-history';

@NgModule({
  declarations: [Transfer, TransactionHistory],
  imports: [CommonModule, TransactionsRoutingModule],
})
export class TransactionsModule {}
