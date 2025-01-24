import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { SignalRService } from '../../services/signalr.service';
interface Message {
  id: string;
  sender: string;
  text: string;
  timeStamp: Date;
}
@Component({
  selector: 'app-session-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './session-chat.component.html',
  styleUrl: './session-chat.component.scss'
})
export class SessionChatComponent implements OnInit {

  user: User | undefined
  groupName = '8';
  message = '';
  messages: string[] = [];


  constructor(private ss: SignalRService, private us: AuthService) {
    this.us.user.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
  }


  ngOnInit(): void {
    // Avvia la connessione SignalR
    this.ss.startConnection();

    // Ricevi i messaggi dal server
    this.ss.onReceiveMessage((message: string) => {
      this.messages.push(message);
    });
  }

  joinGroup(): void {
    this.ss.joinGroup(this.groupName);
  }

  leaveGroup(): void {
    this.ss.leaveGroup(this.groupName);
  }

  sendMessage(): void {
    this.ss.sendGroupMessage(this.groupName, this.message);
    this.message = ''; // Resetta il campo messaggio
  }

}
