import { AccountService } from './account-service';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(() => {
    service = new AccountService();
  });

  it('creates an account and records the initial deposit', () => {
    const account = service.createAccount('Everyday', 'Chequing', 100);

    expect(service.accounts().length).toBe(1);
    expect(account.balance).toBe(100);

    const history = service.getTransactions(account.id);
    expect(history.length).toBe(1);
    expect(history[0].type).toBe('Initial Deposit');
  });

  it('transfers funds and records both sides', () => {
    const a = service.createAccount('Chequing A', 'Chequing', 100);
    const b = service.createAccount('Savings B', 'Savings', 50);

    service.transfer(a.id, b.id, 30);

    expect(service.getAccount(a.id)?.balance).toBe(70);
    expect(service.getAccount(b.id)?.balance).toBe(80);
    expect(service.getTransactions(a.id)[0].type).toBe('Transfer Out');
    expect(service.getTransactions(b.id)[0].type).toBe('Transfer In');
  });

  it('rejects a transfer larger than the balance', () => {
    const a = service.createAccount('A', 'Chequing', 100);
    const b = service.createAccount('B', 'Savings', 0);

    expect(() => service.transfer(a.id, b.id, 500)).toThrow('Insufficient funds.');
    expect(service.getAccount(a.id)?.balance).toBe(100); // unchanged
  });

  it('rejects a transfer to the same account', () => {
    const a = service.createAccount('A', 'Chequing', 100);

    expect(() => service.transfer(a.id, a.id, 10)).toThrow('Cannot transfer to the same account.');
  });

  it('rejects a zero or negative amount', () => {
    const a = service.createAccount('A', 'Chequing', 100);
    const b = service.createAccount('B', 'Savings', 0);

    expect(() => service.transfer(a.id, b.id, 0)).toThrow('Amount must be greater than 0.');
    expect(() => service.transfer(a.id, b.id, -5)).toThrow('Amount must be greater than 0.');
  });

  it('rounds balances to cents', () => {
    const a = service.createAccount('A', 'Chequing', 0.3);
    const b = service.createAccount('B', 'Savings', 0);

    service.transfer(a.id, b.id, 0.1);

    expect(service.getAccount(a.id)?.balance).toBe(0.2); // not 0.19999999999999998
  });
});