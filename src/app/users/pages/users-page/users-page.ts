import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { UsersStore } from '../../store/users.store';
import { userApiEvents } from '../../store/events/user-api-events';
import { Dispatcher } from '@ngrx/signals/events';
import { CardModule } from 'primeng/card';

import { UsersTable } from '@users/components';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, CardModule, UsersTable],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">User Management</h1>
      </div>

      <p-card>
        <app-users-table
          [users]="usersStore.users()"
          [loading]="usersStore.loading()"
          (toggleActive)="toggleActive($event)"
        />
      </p-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPage implements OnInit {
  usersStore = inject(UsersStore);
  dispatcher = inject(Dispatcher);

  ngOnInit(): void {
    this.dispatcher.dispatch(userApiEvents.load());
  }

  toggleActive(userId: string): void {
    this.dispatcher.dispatch(userApiEvents.toggleActive(userId));
  }
}
