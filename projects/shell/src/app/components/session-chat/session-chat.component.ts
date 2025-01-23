import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as signalR from '@microsoft/signalr';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { SignalRService } from '../../services/signalr.service';
interface Message {
  id: string;
  sender: string;
  text: string;
  timeStamp: Date;
  isRead: boolean;
}
@Component({
  selector: 'app-session-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './session-chat.component.html',
  styleUrl: './session-chat.component.scss'
})
export class SessionChatComponent implements OnInit {

  private hubConnection!: signalR.HubConnection;
  user: User | undefined
  public message = '';
  public messages: Message[] = [];

  constructor(private ss: SignalRService, private us: AuthService) {
    this.us.user.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
  }

  ngOnInit(): void {

    this.ss.startConnection();

    // Aggiungi un listener per i messaggi ricevuti
    this.ss['connection'].on('ReceiveMessage', (id: string, sender: string, text: string, timeStamp: Date, isRead: boolean) => {
      console.log("Qui ricevo: ", id, sender, text, timeStamp, isRead);
      this.messages.push({ id, sender, text, timeStamp, isRead });
    });
  }
  sendMessage(): void {
    if (this.message.trim()) {
      console.log('Qui mando: ', this.message);
      this.ss.sendMessage(this.user!.name, this.message);
      this.message = '';
    }
  }


}
