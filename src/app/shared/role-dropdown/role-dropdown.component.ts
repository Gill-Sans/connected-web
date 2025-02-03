import { CommonModule } from '@angular/common';
import { Component,Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-role-dropdown',
  imports: [CommonModule],
  templateUrl: './role-dropdown.component.html',
  styleUrl: './role-dropdown.component.scss'
})
export class RoleDropdownComponent {
@Input() selectedRole!: string;
@Output() selectedRoleChange = new EventEmitter<string>();
isDropdownOpen = false;

roles: string[] = ['Product Owner', 'Developer', 'Scrum Master'];

toggleDropdown(event: Event){
  event.stopPropagation();
  this.isDropdownOpen = !this.isDropdownOpen;
}

changeRole (newRole: string){
  this.selectedRoleChange.emit(newRole);
  this.selectedRole = newRole;
  this.isDropdownOpen = false;
}

@HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    if (!(event.target as HTMLElement).closest('.dropdown')) {
      this.isDropdownOpen = false;
    }
  }

}
