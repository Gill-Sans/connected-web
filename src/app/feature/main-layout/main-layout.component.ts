import {Component} from '@angular/core';
import {SidenavComponent} from '../../core/sidenav/sidenav.component';
import {TopnavComponent} from '../../core/topnav/topnav.component';
import {RouterOutlet} from '@angular/router';
import {DeviceService} from '../../shared/services/device/device.service';

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
    constructor(private readonly deviceService: DeviceService) {}

    readonly isMobile = this.deviceService.isMobile;
}
