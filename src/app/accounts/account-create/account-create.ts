import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../../core/account-service';
import { AccountType } from '../../core/models';

type FieldName = 'name' | 'accountType' | 'initialBalance';

@Component({
  selector: 'app-account-create',
  standalone: false,
  templateUrl: './account-create.html',
  styleUrl: './account-create.scss',
})
export class AccountCreate {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);

  readonly accounts = this.accountService.accounts;
  readonly successMessage = signal<string | null>(null);

  readonly form = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30),
      Validators.pattern(/\S/), // not just spaces
    ]],
    accountType: [null as AccountType | null, Validators.required],
    initialBalance: [null as number | null, [
      Validators.required,
      Validators.min(0.01),
      Validators.pattern(/^\d+(\.\d{1,2})?$/), // at most 2 decimal places
    ]],
  });

  // Turns the radio button's value into a signal so the template
  // can show and restyle the button the moment the type changes.
  readonly accountType = toSignal(this.form.controls.accountType.valueChanges, {
    initialValue: null,
  });

  showError(field: FieldName): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }

  onSubmit(): void {
    this.successMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched(); // show every error at once
      return;
    }

    const { name, accountType, initialBalance } = this.form.getRawValue();
    // Safe to use ! here: the form is valid, so these can't be null.
    const account = this.accountService.createAccount(name!, accountType!, initialBalance!);

    this.successMessage.set(
      `${account.type} account "${account.name}" created with a balance of $${account.balance.toFixed(2)}.`
    );
    this.form.reset();
  }
}