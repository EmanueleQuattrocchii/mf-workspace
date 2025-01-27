import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Message } from '../../models/chat.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
import { SignalRService } from '../../services/signalr.service';

@Component({
  selector: 'app-choice-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './choice-chat.component.html',
  styleUrl: './choice-chat.component.scss'
})
export class ChoiceChatComponent {

  user: User | undefined;
  session: SessionService | undefined;
  message = '';

  constructor(public ss: SignalRService, private us: AuthService, session: SessionService) {
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
