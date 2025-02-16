import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';

@Component({
    selector: 'app-linkcard',
    imports: [CommonModule],
    templateUrl: './linkcard.component.html',
    styleUrls: ['./linkcard.component.scss']
})
export class LinkcardComponent {
    // Mapping tussen linkType en de juiste icon URL
    private iconMapping: { [key: string]: string } = {
        'Github': 'icons/links/Github.svg',
        'Trello': 'icons/links/Trello.svg',
        'Jira': 'icons/links/Jira.svg',
        'Slack': 'icons/links/Slack.svg'
    };

    // De backend stuurt nu alleen een `linkType` en `url`
    //NOTE: Lucas past dit aan zodra dynmic data beschikbaar is
    links = [
        {url: 'https://github.com', linkType: 'Github'},
        {url: 'https://trello.com', linkType: 'Trello'},
        {url: 'https://jira.com', linkType: 'Jira'},
        {url: 'https://slack.com', linkType: 'Slack'}
    ];

    // Methode om de juiste icon URL te krijgen
    getIconUrl(linkType: string): string {
        return this.iconMapping[linkType] || 'icons/default.svg';
    }
}
