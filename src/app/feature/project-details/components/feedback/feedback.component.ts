import { Component } from '@angular/core';
import { ConversationcardComponent } from "../../../../shared/conversationcard/conversationcard.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/button/button.component';

@Component({
  selector: 'app-feedback',
  imports: [ConversationcardComponent, CommonModule, FormsModule, ButtonComponent],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {
  feedbackList: { fullname: string; timestamp: string; message: string }[] =[
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
  ]

  //voor nieuwe feedback
  newFeedback: string = '';

  submitFeedback() {
    if (this.newFeedback.trim() === '') return;

    const now = new Date();
    const timestamp = now.toLocaleTimeString() + " " + now.toLocaleDateString();

    this.feedbackList.push({
      fullname: "Current User",
      timestamp: timestamp,
      message: this.newFeedback
    });
    this.newFeedback = ''; // Input veld leegmaken
  }

}
