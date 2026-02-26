import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Dispatcher, Events } from '@ngrx/signals/events';
import { CardModule } from 'primeng/card';
import { userApiEvents } from '../../store/events/user-api-events';
import { UsersStore } from '../../store/users.store';
import { PageHeader } from '@common/components';
import { UsersTable } from '@users/components';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-users-page',
  imports: [CommonModule, CardModule, UsersTable, PageHeader],
  template: `
    <app-page-header title="Users" description="Manage your users" />
    <div class="card relative">
      <app-users-table
        [users]="usersStore.users()"
        [loading]="usersStore.loading()"
        (toggleActive)="toggleActive($event)"
        (deleteUser)="deleteUser($event)"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPage implements OnInit {
  usersStore = inject(UsersStore);
  dispatcher = inject(Dispatcher);
  events = inject(Events);
  messageService = inject(MessageService);

  constructor() {
    this.listenToUserChanges();
  }

  ngOnInit(): void {
    this.dispatcher.dispatch(userApiEvents.load());
  }

  private listenToUserChanges(): void {
    this.events
      .on(userApiEvents.toggledSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload: user }) => {
        this.messageService.add({
          severity: 'success',
          summary: 'User Updated',
          detail: `User ${user.email} is now ${user.isActive ? 'active' : 'inactive'}.`,
        });
      });

    this.events
      .on(userApiEvents.toggledFailure)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload: errorMessage }) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Update Failed',
          detail: errorMessage,
        });
      });

    this.events
      .on(userApiEvents.deletedSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'User Deleted',
          detail: 'The user has been removed successfully.',
        });
      });

    this.events
      .on(userApiEvents.deletedFailure)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload: errorMessage }) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Delete Failed',
          detail: errorMessage,
        });
      });
  }

  toggleActive(userId: string): void {
    this.dispatcher.dispatch(userApiEvents.toggleActive(userId));
  }

  deleteUser(userId: string): void {
    this.dispatcher.dispatch(userApiEvents.delete(userId));
  }
}
