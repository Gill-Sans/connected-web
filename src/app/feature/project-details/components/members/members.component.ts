import { Component } from '@angular/core';
import { RoleDropdownComponent } from '../../../../shared/components/role-dropdown/role-dropdown.component';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-members',
  imports: [RoleDropdownComponent, CommonModule, ConfirmDialogComponent],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss'
})
export class MembersComponent {
  members = [
    {first_name: 'John', last_name: 'Doe', role: 'Product Owner', joinedOn: '22/01/2025', image: 'icons/placeholderpic.svg'},
    {first_name: 'Jane', last_name: 'Doe', role: 'Developer', joinedOn: '22/01/2025', image: 'icons/placeholderpic.svg'},
    {first_name: 'thomas', last_name:' the tank engine', role: 'Scrum Master', joinedOn: '22/01/2025', image: 'icons/placeholderpic.svg'},
    {first_name: 'john', last_name: 'Cena', role: 'Developer', joinedOn: '22/01/2025', image: 'icons/placeholderpic.svg'}

  ]

  memberToDelete: number | null = null; // Houdt bij wie verwijderd wordt

  updateRole(index: number, newRole: string) {
    this.members[index].role = newRole;
  }

  confirmRemoveMember(index: number) {
    this.memberToDelete = index; // Zet de member die verwijderd moet worden
  }

  removeMember() {
    if (this.memberToDelete !== null) {
      this.members.splice(this.memberToDelete, 1);
      this.memberToDelete = null; // Reset waarde na verwijderen
    }
  }

  cancelRemove() {
    this.memberToDelete = null;
  }

}
