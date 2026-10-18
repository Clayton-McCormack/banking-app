import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AccountService } from '../../core/account-service';

type FieldName = 'fromAccountId' | 'toAccountId' | 'amount';

@Component({
  selector: 'app-transfer',
  standalone: false,
  templateUrl: './transfer.html',
  styleUrl: './transfer.scss',
})
export class Transfer {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);

  readonly accounts = this.accountService.accounts;
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  // Rules that need more than one field, so they live on the whole form:
  // can't send to the same account, and can't send more than the balance.
  private transferRules: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const fromId = group.get('fromAccountId')?.value as number | null;
    const toId = group.get('toAccountId')?.value as number | null;
    const amount = group.get('amount')?.value as number | null;
    const errors: ValidationErrors = {};

    if (fromId !== null && toId !== null && fromId === toId) {
      errors['sameAccount'] = true;
    }

    const from = fromId !== null ? this.accountService.getAccount(fromId) : undefined;
    if (from && amount !== null && amount > from.balance) {
      errors['insufficientFunds'] = { balance: from.balance };
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };

  readonly form = this.fb.group(
    {
      fromAccountId: [null as number | null, Validators.required],
      toAccountId: [null as number | null, Validators.required],
      amount: [null as number | null, [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(/^\d+(\.\d{1,2})?$/), // at most 2 decimal places
      ]],
    },
    { validators: this.transferRules }
  );

  private fromAccountId = toSignal(this.form.controls.fromAccountId.valueChanges, { initialValue: null });
  private toAccountId = toSignal(this.form.controls.toAccountId.valueChanges, { initialValue: null });

  // These recalculate whenever the selection OR the balances change,
  // so the displayed balance is always current.
  readonly fromAccount = computed(() => this.accounts().find(a => a.id === this.fromAccountId()) ?? null);
  readonly toAccount = computed(() => this.accounts().find(a => a.id === this.toAccountId()) ?? null);

  showError(field: FieldName): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }

  sameAccountError(): boolean {
    const control = this.form.controls.toAccountId;
    return (control.touched || control.dirty) && this.form.hasError('sameAccount');
  }

  amountInvalid(): boolean {
    const control = this.form.controls.amount;
    return (control.touched || control.dirty) &&
      (control.invalid || this.form.hasError('insufficientFunds'));
  }

  onSubmit(): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { fromAccountId, toAccountId, amount } = this.form.getRawValue();

    try {
      // Safe to use ! here: the form is valid, so these can't be null.
      this.accountService.transfer(fromAccountId!, toAccountId!, amount!);

      const from = this.accountService.getAccount(fromAccountId!)!;
      const to = this.accountService.getAccount(toAccountId!)!;
      this.successMessage.set(`Transferred $${amount!.toFixed(2)} from ${from.name} to ${to.name}.`);
      this.form.reset();
    } catch (error) {
      // The service double-checks the rules; show its message if something slips through.
      this.errorMessage.set(error instanceof Error ? error.message : 'Transfer failed.');
    }
  }
}