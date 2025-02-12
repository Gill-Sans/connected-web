import {Component} from '@angular/core';
import {SidenavComponent} from '../../core/sidenav/sidenav.component';
import {TopnavComponent} from '../../core/topnav/topnav.component';
import {RouterOutlet} from '@angular/router';

@Component({
    selector: 'app-main-layout',
    imports: [
        RouterOutlet,
        SidenavComponent,
        TopnavComponent
    ],
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

}
