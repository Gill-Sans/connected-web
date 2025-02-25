import {CommonModule} from '@angular/common';
import {Component, inject, Input} from '@angular/core';
import { ProjectService } from '../../../core/services/project.service';

@Component({
    selector: 'app-linkcard',
    imports: [CommonModule],
    templateUrl: './linkcard.component.html',
    styleUrls: ['./linkcard.component.scss']
})
export class LinkcardComponent {
    private readonly projectService : ProjectService = inject(ProjectService);
    @Input() repositoryUrl: string = '' ; 
    @Input() boardUrl : string = '';
    // Mapping tussen linkType en de juiste icon URL
    private iconMapping: { [key: string]: string } = {
        'Github': 'icons/links/Github.svg',
        'Trello': 'icons/links/Trello.svg',
       
    };

    

    // Methode om de juiste icon URL te krijgen
    getIconUrl(linkType: string): string {
        return this.iconMapping[linkType] || 'icons/default.svg';
    }
}
