import {Component, Input, OnDestroy} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Editor, NgxEditorModule, Toolbar} from 'ngx-editor';

@Component({
  selector: 'app-md-editor',
    imports: [
        ReactiveFormsModule,
        NgxEditorModule
    ],
  templateUrl: './md-editor.component.html',
  styleUrl: './md-editor.component.scss'
})
export class MdEditorComponent implements OnDestroy {
    @Input() form!: FormGroup;
    @Input() controlName!: string;

    editor: Editor = new Editor();
    toolbar: Toolbar = [
        ['bold', 'italic'],
        ['underline', 'strike'],
        ['code', 'blockquote'],
        ['ordered_list', 'bullet_list'],
        [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
        ['link'],
        ['text_color', 'background_color'],
        ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];

    ngOnDestroy(): void {
        this.editor.destroy();
    }
}
