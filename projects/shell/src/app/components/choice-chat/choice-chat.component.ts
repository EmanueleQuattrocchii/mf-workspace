import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from '../../models/chat.model';
import { User } from '../../models/user.model';
import { TimeAgoPipe } from "../../pipes/time-ago.pipe";
import { AuthService } from '../../services/auth.service';
import { SignalRService } from '../../services/signalr.service';
import { SessionChatComponent } from '../session-chat/session-chat.component';

@Component({
  selector: 'app-choice-chat',
  standalone: true,
  imports: [CommonModule, TimeAgoPipe],
  templateUrl: './choice-chat.component.html',
  styleUrl: './choice-chat.component.scss'
})
export class ChoiceChatComponent {

  user: User | undefined;
  sessions: Array<SessionChatComponent> = [];
  constructor(public ss: SignalRService, private us: AuthService, public router: Router) {
    this.us.user.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
  }
  ngOnInit(): void {
    this.ss.startConnection();
    this.ss.onReceiveMessage((message: Message) => {
      this.ss.completeChat$.value.messages.push(message);
    });
  }
}
