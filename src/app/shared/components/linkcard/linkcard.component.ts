import {CommonModule} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {ButtonComponent} from '../button/button.component';

@Component({
    selector: 'app-linkcard',
    imports: [CommonModule, ButtonComponent],
    templateUrl: './linkcard.component.html',
    styleUrls: ['./linkcard.component.scss']
})
export class LinkcardComponent implements OnInit {
    @Input() url: string = '';
    @Input() variant!: string;

    ngOnInit() {
        if (this.url && !this.url.startsWith('https://')) {
            this.url = 'https://' + this.url;
        }
    }

    openLink(url: string) {
        window.open(url, '_blank');
    }
}
