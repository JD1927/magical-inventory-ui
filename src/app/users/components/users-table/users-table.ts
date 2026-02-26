import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { IUser } from '@users/models/user.model';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-users-table',
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ButtonModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    FormsModule,
    ToggleSwitchModule,
  ],
  templateUrl: './users-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersTable {
  private confirmationService = inject(ConfirmationService);

  users = input.required<IUser[]>();
  loading = input<boolean>(false);
  toggleActive = output<string>();
  deleteUser = output<string>();

  searchTerm = signal<string>('');

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.users();

    return this.users().filter((user) => user.email.toLowerCase().includes(term));
  });

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm.set(term);
  }

  onClearSearch(): void {
    this.searchTerm.set('');
  }

  onToggleActive(user: IUser): void {
    const action = user.isActive ? 'deactivate' : 'activate';
    this.confirmationService.confirm({
      message: `Are you sure you want to ${action} user <b>${user.email}</b>?`,
      header: 'Please Confirm',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.toggleActive.emit(user.id);
      },
    });
  }

  onDelete(user: IUser): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete user <b>${user.email}</b>? <br> This action cannot be undone.`,
      header: 'Delete Confirmation',
      icon: 'pi pi-trash',
      rejectButtonStyleClass: 'p-button-text',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteUser.emit(user.id);
      },
    });
  }
}
