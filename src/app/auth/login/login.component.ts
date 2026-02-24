import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Dispatcher, Events } from '@ngrx/signals/events';
import {
  RegisterPasskeyStore,
  LoginPasskeyStore,
  registerPasskeyApiEvents,
  loginPasskeyApiEvents,
} from '../store';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    ToastModule,
  ],
  templateUrl: './login.component.html',
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Stores
  registerStore = inject(RegisterPasskeyStore);
  loginStore = inject(LoginPasskeyStore);

  // Events & Dispatcher
  dispatcher = inject(Dispatcher);
  events = inject(Events);
  private messageService = inject(MessageService);

  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  get email(): string {
    return this.emailForm.get('email')?.value || '';
  }

  constructor() {
    // Navigate to dashboard on successful login
    this.events
      .on(loginPasskeyApiEvents.loggedInSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.router.navigate(['/dashboard']));

    this.events
      .on(loginPasskeyApiEvents.loggedInFailure)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload: errorMessage }) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: errorMessage,
        });
      });

    this.events
      .on(registerPasskeyApiEvents.registeredSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registration Successful',
          detail: 'Passkey registered! You can now log in.',
        });
      });

    this.events
      .on(registerPasskeyApiEvents.registeredFailure)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload: errorMessage }) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Registration Failed',
          detail: errorMessage,
        });
      });
  }

  registerPasskey(): void {
    if (this.emailForm.invalid) return;
    this.dispatcher.dispatch(registerPasskeyApiEvents.register(this.email));
  }

  loginWithPasskey(): void {
    if (this.emailForm.invalid) return;
    this.dispatcher.dispatch(loginPasskeyApiEvents.login(this.email));
  }
}
