import {CommonModule} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-linkcard',
    imports: [CommonModule],
    templateUrl: './linkcard.component.html',
    styleUrls: ['./linkcard.component.scss']
})
export class LinkcardComponent implements OnInit {
    @Input() url: string = '';
    @Input() variant!: string;

    ngOnInit() {
        if (this.url && !this.url.startsWith('http://') && !this.url.startsWith('https://')) {
            this.url = 'http://' + this.url;
        }
    }
}
