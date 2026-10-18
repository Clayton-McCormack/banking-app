import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { AccountsModule } from '../accounts-module';
import { AccountCreate } from './account-create';
import { AccountService } from '../../core/account-service';

describe('AccountCreate', () => {
  let fixture: ComponentFixture<AccountCreate>;
  let component: AccountCreate;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsModule, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('is invalid with a negative balance', () => {
    component.form.controls.initialBalance.setValue(-50);
    expect(component.form.controls.initialBalance.hasError('min')).toBe(true);
  });

  it('is invalid with a name shorter than 2 characters', () => {
    component.form.controls.name.setValue('A');
    expect(component.form.controls.name.hasError('minlength')).toBe(true);
  });

  it('shows no create button until an account type is chosen', () => {
    expect(fixture.nativeElement.querySelector('app-button')).toBeNull();
  });

  it('shows a green Savings button when Savings is selected', () => {
    component.form.controls.accountType.setValue('Savings');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('app-button button');
    expect(button.textContent).toContain('Create Savings Account');
    expect(button.classList).toContain('btn-success');
  });

  it('creates an account when the form is valid', () => {
    component.form.setValue({ name: 'Everyday', accountType: 'Chequing', initialBalance: 250 });
    component.onSubmit();

    const service = TestBed.inject(AccountService);
    expect(service.accounts().length).toBe(1);
    expect(service.accounts()[0].balance).toBe(250);
  });
});