# Banking App

A simple banking web application built with Angular for the BrainRidge Consulting take-home assignment. Users can create Chequing and Savings accounts, transfer funds between them, and view each account's transaction history.

## Features

- **Create an account** with a name, an account type (Chequing or Savings, chosen with radio buttons) and an initial balance. The submit button only appears once a type is selected, and it is styled differently for each type.
- **Transfer funds** between accounts, with validation that the amount is positive, does not exceed the source balance, and is not sent to the same account.
- **View transaction history** for any account, with a search box and a transaction type filter. The selected account's balance updates live.
- **Reusable button component** in a separate `SharedModule`, used across the app and styled by account type.

## Tech Stack

- Angular 22 (NgModule-based, as the assignment requires)
- TypeScript
- Bootstrap 5
- Angular Reactive Forms (`FormBuilder`) and `ngModel` two-way binding
- Vitest for unit tests

## Prerequisites

- [Node.js](https://nodejs.org/) 22 or later (developed with Node 24)
- npm (included with Node.js)

The Angular CLI does not need to be installed globally. The commands below use the project's local copy through `npm` and `npx`.

## Getting Started

```bash
git clone https://github.com/Clayton-McCormack/banking-app.git
cd banking-app
npm install
npm start
```

Then open http://localhost:4200 in your browser.

## Running Tests

```bash
npx ng test --watch=false
```

There are 27 unit tests covering the account service, the shared button, all three pages and the app shell.

## Building for Production

```bash
npx ng build
```

The build output goes to the `dist/` folder.

## Project Structure

```
src/app/
├── core/                      # Data models and the AccountService
│   ├── models.ts
│   └── account-service.ts
├── shared/                    # SharedModule with the reusable button
│   ├── shared-module.ts
│   └── button/
├── accounts/                  # AccountsModule (lazy loaded)
│   ├── accounts-module.ts
│   ├── accounts-routing-module.ts
│   └── account-create/
├── transactions/              # TransactionsModule (lazy loaded)
│   ├── transactions-module.ts
│   ├── transactions-routing-module.ts
│   ├── transfer/
│   └── transaction-history/
├── app-module.ts
└── app-routing-module.ts
```

## Routes

| Path | Page |
|---|---|
| `/accounts/new` | Create an account (default page) |
| `/transactions/transfer` | Transfer funds |
| `/transactions/history` | Transaction history |

## Design Decisions

- **NgModules:** Newer Angular versions default to standalone components, but the assignment asks for a `SharedModule` and a modular structure, so the app was generated with NgModules. Components still use current Angular features such as built-in control flow (`@if`, `@for`), signals and `inject()`.
- **Lazy-loaded feature modules:** `AccountsModule` and `TransactionsModule` only load when the user first visits them, keeping the initial bundle small.
- **Single source of truth:** `AccountService` holds all accounts and transactions in signals. Components get read-only access, and all changes go through `createAccount()` and `transfer()`, so the business rules are always applied.
- **Two layers of validation:** Forms validate input for the user, and the service checks the same rules again so invalid data can never be saved.
- **Cross-field validators:** "Insufficient funds" and "same account" compare more than one field, so they are form-level validators on the transfer form.
- **Money rounding:** Balances are rounded to cents after every calculation to avoid floating-point errors (for example, 0.3 - 0.1).
- **Two-way data binding:** The guidelines mention two-way binding for updating balances, while the forms are required to use `FormBuilder`. Angular advises against mixing `ngModel` into Reactive Forms, so the forms use `FormBuilder`, balances update across every page automatically through the shared service, and `[(ngModel)]` is used on the history page's account selector, search box and type filter.

## Assumptions

- Data is stored in memory, so refreshing the page resets it. No backend was required.
- Amounts are in Canadian dollars with at most two decimal places.
- The initial balance must be greater than $0. The assignment says balances cannot be negative and gives "balance > 0" as an example, so a positive minimum satisfies both.
- Account names are 2 to 30 characters.
- Authentication is out of scope.

## What I Would Add With More Time

- Persist data with `localStorage` or a backend REST API
- Sorting and pagination for long transaction histories
- End-to-end tests (for example, with Playwright)
- A confirmation step before submitting a transfer
- A full accessibility audit