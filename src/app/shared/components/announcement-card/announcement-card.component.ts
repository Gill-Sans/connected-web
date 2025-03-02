import {Component, Input} from '@angular/core';
import {Announcement} from '../../models/announcement.model';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-announcement-card',
  imports: [
      CommonModule
  ],
  templateUrl: './announcement-card.component.html',
  styleUrl: './announcement-card.component.scss'
})
export class AnnouncementCardComponent {
    @Input() announcement!: Announcement;
}
