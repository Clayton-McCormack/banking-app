import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TransactionsModule } from '../transactions-module';
import { TransactionHistory } from './transaction-history';
import { AccountService } from '../../core/account-service';

describe('TransactionHistory', () => {
  let fixture: ComponentFixture<TransactionHistory>;
  let component: TransactionHistory;
  let service: AccountService;

  async function setUp(createAccounts: boolean) {
    await TestBed.configureTestingModule({
      imports: [TransactionsModule, RouterModule.forRoot([])],
    }).compileComponents();

    service = TestBed.inject(AccountService);
    if (createAccounts) {
      const chequing = service.createAccount('Everyday', 'Chequing', 100);
      const savings = service.createAccount('Rainy Day', 'Savings', 50);
      service.transfer(chequing.id, savings.id, 30);
    }

    fixture = TestBed.createComponent(TransactionHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('asks the user to create an account when there are none', async () => {
    await setUp(false);
    expect(fixture.nativeElement.textContent).toContain('No accounts yet');
  });

  it("shows the first account's transactions by default", async () => {
    await setUp(true);
    expect(component.selectedAccount()?.name).toBe('Everyday');

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2); // initial deposit + transfer out
  });

  it('shows the other account when it is selected', async () => {
    await setUp(true);
    component.selectedAccountId.set(service.accounts()[1].id);

    const types = component.filteredTransactions().map(t => t.type);
    expect(types).toEqual(['Transfer In', 'Initial Deposit']);
  });

  it('filters by search term', async () => {
    await setUp(true);
    component.searchTerm.set('rainy');

    expect(component.filteredTransactions().length).toBe(1);
    expect(component.filteredTransactions()[0].type).toBe('Transfer Out');
  });

  it('filters by transaction type', async () => {
    await setUp(true);
    component.typeFilter.set('Initial Deposit');

    expect(component.filteredTransactions().length).toBe(1);
  });
});