import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from '../../models/chat.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
import { SignalRService } from '../../services/signalr.service';

@Component({
  selector: 'app-session-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './session-chat.component.html',
  styleUrl: './session-chat.component.scss'
})
export class SessionChatComponent implements OnInit {

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
    this.ss.startConnection("27");
    this.ss.onReceiveMessage((message: Message) => {
      this.ss.completeChat$.value.messages.push(message);
    });
  }
  sendMessage(): void {
    if (this.message.trim()) {
      this.ss.sendGroupMessage("27", this.message);
    }
    this.message = '';
  }


}
