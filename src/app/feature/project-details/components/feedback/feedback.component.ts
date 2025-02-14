import {Component, inject} from '@angular/core';
import {ConversationcardComponent} from "../../../../shared/components/conversationcard/conversationcard.component";
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ButtonComponent} from '../../../../shared/components/button/button.component';
import { Observable } from 'rxjs';
import { Project } from '../../../../shared/models/project.model';
import { ActiveAssignmentService } from '../../../../core/services/active-assignment.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../../../core/services/project.service';

@Component({
    selector: 'app-feedback',
    imports: [ConversationcardComponent, CommonModule, FormsModule, ButtonComponent],
    templateUrl: './feedback.component.html',
    styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {
    private readonly projectService: ProjectService = inject(ProjectService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    
    private readonly activeAssignmentService: ActiveAssignmentService = inject(ActiveAssignmentService);
    private projectId: string = 'undefined';
    public project$ : Observable<Project> | null = null;
    activeAssignment$ = this.activeAssignmentService.activeAssignment$;
    
    ngOnInit(){
        this.route.parent?.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.projectId = id;
                this.project$ = this.projectService.getProject(this.projectId);                
            }
        })
        
    }



    //voor nieuwe feedback
    newFeedback: string = '';

    feedbackList: { fullname: string; timestamp: string; message: string }[] = [
        {
            fullname: "Robin Bervoets",
            timestamp: "10:16 21/01/2025",
            message: "Het ingediende projectvoorstel en de wireframes bieden een goed uitgangspunt..."
        },
        {
            fullname: "Jeroen Van den Berg",
            timestamp: "09:45 21/01/2025",
            message: "Ik ben van mening dat de wireframes niet voldoende zijn uitgewerkt..."
        }
    ];


    submitFeedback() {
        if (this.newFeedback.trim() === '') return;

        const now = new Date();
        const timestamp = now.toLocaleTimeString() + " " + now.toLocaleDateString();
        //vanboven niuwe feedback toevoegen
        this.feedbackList.unshift({
            fullname: "Current User",
            timestamp: timestamp,
            message: this.newFeedback
        });
        this.newFeedback = ''; // Input veld leegmaken
    }

}
