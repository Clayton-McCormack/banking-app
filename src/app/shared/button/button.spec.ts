import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Button } from './button';

describe('Button', () => {
  let fixture: ComponentFixture<Button>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Button],
    }).compileComponents();

    fixture = TestBed.createComponent(Button);
    fixture.componentRef.setInput('label', 'Create Account');
  });

  function buttonEl(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button');
  }

  it('shows the label', () => {
    fixture.detectChanges();
    expect(buttonEl().textContent?.trim()).toBe('Create Account');
  });

  it('uses the Chequing style for Chequing accounts', () => {
    fixture.componentRef.setInput('accountType', 'Chequing');
    fixture.detectChanges();
    expect(buttonEl().classList).toContain('btn-primary');
    expect(buttonEl().classList).toContain('app-btn-chequing');
  });

  it('uses the Savings style for Savings accounts', () => {
    fixture.componentRef.setInput('accountType', 'Savings');
    fixture.detectChanges();
    expect(buttonEl().classList).toContain('btn-success');
    expect(buttonEl().classList).toContain('app-btn-savings');
  });

  it('uses the default style when no account type is given', () => {
    fixture.detectChanges();
    expect(buttonEl().classList).toContain('btn-dark');
  });

  it('emits clicked when pressed', () => {
    let clickCount = 0;
    fixture.componentInstance.clicked.subscribe(() => clickCount++);
    fixture.detectChanges();

    buttonEl().click();

    expect(clickCount).toBe(1);
  });
});