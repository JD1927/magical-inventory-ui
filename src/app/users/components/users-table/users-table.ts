import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IUser } from '@users/models/user.model';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ButtonModule],
  template: `
    <p-table [value]="users()" [loading]="loading()" rowHover="true" styleClass="p-datatable-sm">
      <ng-template pTemplate="header">
        <tr>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Created At</th>
          <th style="width: 10rem">Actions</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-user>
        <tr>
          <td>{{ user.email }}</td>
          <td>
            <p-tag [value]="user.role" [severity]="user.role === 'admin' ? 'success' : 'info'" />
          </td>
          <td>
            <p-tag
              [value]="user.isActive ? 'Active' : 'Inactive'"
              [severity]="user.isActive ? 'success' : 'danger'"
            />
          </td>
          <td>{{ user.createdAt | date: 'short' }}</td>
          <td>
            <p-button
              [label]="user.isActive ? 'Deactivate' : 'Activate'"
              [severity]="user.isActive ? 'danger' : 'success'"
              [outlined]="true"
              size="small"
              (click)="onToggleActive(user.id)"
              [loading]="loading()"
            />
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersTable {
  users = input.required<IUser[]>();
  loading = input<boolean>(false);
  toggleActive = output<string>();

  onToggleActive(userId: string): void {
    this.toggleActive.emit(userId);
  }
}
