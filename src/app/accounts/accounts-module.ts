import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountsRoutingModule } from './accounts-routing-module';
import { SharedModule } from '../shared/shared-module';
import { AccountCreate } from './account-create/account-create';

@NgModule({
  declarations: [AccountCreate],
  imports: [CommonModule, ReactiveFormsModule, AccountsRoutingModule, SharedModule],
})
export class AccountsModule {}