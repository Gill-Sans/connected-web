import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MarkdownModule} from 'ngx-markdown';
import {LMarkdownEditorModule} from 'ngx-markdown-editor';

@Component({
    selector: 'app-project-create',
    imports: [CommonModule, MarkdownModule, ReactiveFormsModule, LMarkdownEditorModule],
    templateUrl: './project-create.component.html',
    styleUrl: "./project-create.component.scss"
})
export class ProjectCreateComponent implements OnInit {

    ngOnInit() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
        document.head.appendChild(link);
    }

    projectForm = new FormGroup({
        title: new FormControl(''),
        description: new FormControl('')
    });

    markdownPreview = '';

    updatePreview() {
        this.markdownPreview = this.projectForm.value.description || '';
    }

    onSubmit() {
        console.log('Project submitted:', this.projectForm.value);
    }


    toggleFullScreen() {
        const editorElement = document.querySelector('md-editor');
        if (!document.fullscreenElement) {
            editorElement?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
}
