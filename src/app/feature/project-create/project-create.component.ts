import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormControl, FormGroup } from '@angular/forms';
import {MarkdownModule} from 'ngx-markdown';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';

@Component({
  selector: 'app-project-create',
  imports: [CommonModule, MarkdownModule, ReactiveFormsModule,LMarkdownEditorModule],
  templateUrl: './project-create.component.html',
  styleUrl: './project-create.component.scss'
})
export class ProjectCreateComponent {
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


  toggleFullScreen(){
    const editorElement = document.querySelector('md-editor');
    if(!document.fullscreenElement){
      editorElement?.requestFullscreen();
    }else{
      document.exitFullscreen();
    }
  }
}
