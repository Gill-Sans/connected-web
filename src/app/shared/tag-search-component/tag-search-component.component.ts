import { Component, EventEmitter, Output } from '@angular/core';
import { async, debounceTime, distinctUntilChanged, Observable, Subject, switchMap } from 'rxjs';
import { tag } from '../models/tag.model';
import { TagService } from '../../core/services/tag.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';


@Component({
  selector: 'app-tag-search-component',
  imports: [FormsModule, AsyncPipe,CommonModule, ],
  templateUrl: './tag-search-component.component.html',
  styleUrl: './tag-search-component.component.scss'
})
export class TagSearchComponentComponent {
  searchTerm = new Subject<string>();
  tags$: Observable<tag[]> | undefined;
  @Output() tagSelected = new EventEmitter<tag>();
  isDropdownVisible = false;
  

 constructor(private tagService: TagService) {
  this.tags$ = this.searchTerm.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((term: string) => this.tagService.searchTags(term))
  );

  // Debugging: kijk wat er wordt opgehaald
  this.tags$.subscribe(tags => console.log("Tags ontvangen:", tags));
}

  onSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.isDropdownVisible = inputElement.value.trim().length > 0;
    this.search(inputElement.value);
  }

  search(term: string): void {
    if (term.trim().length > 0) {
      this.searchTerm.next(term);
    }
  }

  selectTag(tag: tag): void {
  
    console.log("Tag geselecteerd:", tag);
    this.tagSelected.emit(tag);
    this.isDropdownVisible = false; 
    // Clear the input
    /* const inputElement = document.querySelector('.tag-input') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';

    } */

      setTimeout(() => {
        this.searchTerm.next('');
    }, 0);
  }


}