import { Component } from '@angular/core';
import { RoleDropdownComponent } from '../../../../shared/role-dropdown/role-dropdown.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-members',
  imports: [RoleDropdownComponent, CommonModule],
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

  updateRole(index: number, newRole: string){
    this.members[index].role = newRole;
  }
  removeMember(index: number){
    this.members.splice(index, 1);
  }

}
