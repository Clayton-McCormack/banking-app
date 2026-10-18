import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Transfer } from './transfer/transfer';
import { TransactionHistory } from './transaction-history/transaction-history';

const routes: Routes = [
  { path: 'transfer', component: Transfer },
  { path: 'history', component: TransactionHistory },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsRoutingModule {}