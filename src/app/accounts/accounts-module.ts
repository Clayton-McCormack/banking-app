import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing-module';
import { AccountCreate } from './account-create/account-create';

@NgModule({
  declarations: [AccountCreate],
  imports: [CommonModule, AccountsRoutingModule],
})
export class AccountsModule {}
