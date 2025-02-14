import { Component, EventEmitter, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, Subject, switchMap } from 'rxjs';
import { tag, tagCreate } from '../models/tag.model';
import { TagService } from '../../core/services/tag.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';


@Component({
    selector: 'app-tag-search-component',
    imports: [FormsModule, AsyncPipe, CommonModule,],
    templateUrl: './tag-search-component.component.html',
    styleUrl: './tag-search-component.component.scss'
})
export class TagSearchComponentComponent {
    searchTerm = new Subject<string>();
    tags$: Observable<tag[]> | undefined;
    @Output() tagSelected = new EventEmitter<tag>();
    isDropdownVisible = false;
    searchQuery = '';

    inputElement: HTMLInputElement | null = null;


    constructor(private tagService: TagService) {
        this.tags$ = this.searchTerm.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((term: string) => this.tagService.searchTags(term))
        );

        this.tags$.subscribe(tags => console.log("Tags ontvangen:", tags));
    }

    onSearchInput(event: Event): void {
        this.inputElement = event.target as HTMLInputElement;
        this.isDropdownVisible = this.inputElement.value.trim().length > 0;
        this.searchQuery = this.inputElement.value.toLowerCase();
        this.search(this.inputElement.value);
    }

    search(term: string): void {
        this.searchTerm.next(term);
    }

    createTag(): void {
        let newTag: tagCreate = {
            name: this.searchQuery,
        };
        this.tagService.createTag(newTag).subscribe(tag => {
            console.log("Tag aangemaakt:", tag);
            this.isDropdownVisible = false;
            this.inputElement!.value = '';
            this.tagSelected.emit(tag);
        });
    }

    selectTag(tag: tag): void {

        console.log("Tag geselecteerd:", tag);
        this.tagSelected.emit(tag);
        this.isDropdownVisible = false;
        this.inputElement!.value = '';

        setTimeout(() => {
            this.searchTerm.next('');
        }, 0);
    }


}
