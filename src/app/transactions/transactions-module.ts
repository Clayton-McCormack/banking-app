import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionsRoutingModule } from './transactions-routing-module';
import { SharedModule } from '../shared/shared-module';
import { Transfer } from './transfer/transfer';
import { TransactionHistory } from './transaction-history/transaction-history';

@NgModule({
  declarations: [Transfer, TransactionHistory],
  imports: [CommonModule, ReactiveFormsModule, TransactionsRoutingModule, SharedModule],
})
export class TransactionsModule {}