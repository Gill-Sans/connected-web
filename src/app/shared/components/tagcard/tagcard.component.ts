import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tagcard',
  imports: [],
  templateUrl: './tagcard.component.html',
  styleUrl: './tagcard.component.scss'
})
export class TagcardComponent {
  private _tag: string = 'placeholder';

  @Input()
  set tag(value: string){
    this._tag = value || 'placeholder';
  }
  get tag(): string {
    return this._tag;
  }

}
