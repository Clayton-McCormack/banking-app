import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TransactionsModule } from '../transactions-module';
import { Transfer } from './transfer';
import { AccountService } from '../../core/account-service';

describe('Transfer', () => {
  let fixture: ComponentFixture<Transfer>;
  let component: Transfer;
  let service: AccountService;
  let chequingId: number;
  let savingsId: number;

  async function setUp(createAccounts: boolean) {
    await TestBed.configureTestingModule({
      imports: [TransactionsModule, RouterModule.forRoot([])],
    }).compileComponents();

    service = TestBed.inject(AccountService);
    if (createAccounts) {
      chequingId = service.createAccount('Everyday', 'Chequing', 100).id;
      savingsId = service.createAccount('Rainy Day', 'Savings', 50).id;
    }

    fixture = TestBed.createComponent(Transfer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('asks for two accounts when there are fewer than two', async () => {
    await setUp(false);
    expect(fixture.nativeElement.textContent).toContain('You need at least two accounts');
  });

  it('rejects an amount larger than the balance', async () => {
    await setUp(true);
    component.form.setValue({ fromAccountId: chequingId, toAccountId: savingsId, amount: 500 });
    expect(component.form.hasError('insufficientFunds')).toBe(true);
  });

  it('rejects a transfer to the same account', async () => {
    await setUp(true);
    component.form.setValue({ fromAccountId: chequingId, toAccountId: chequingId, amount: 10 });
    expect(component.form.hasError('sameAccount')).toBe(true);
  });

  it('moves money between accounts when the form is valid', async () => {
    await setUp(true);
    component.form.setValue({ fromAccountId: chequingId, toAccountId: savingsId, amount: 30 });

    component.onSubmit();

    expect(service.getAccount(chequingId)?.balance).toBe(70);
    expect(service.getAccount(savingsId)?.balance).toBe(80);
    expect(component.successMessage()).toContain('Transferred $30.00');
  });
});