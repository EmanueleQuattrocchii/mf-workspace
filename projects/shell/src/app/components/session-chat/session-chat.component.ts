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

  private hubConnection!: signalR.HubConnection;
  user: User | undefined;
  session: SessionService | undefined;
  public message = '';
  public messages: Message[] = [];

  constructor(private ss: SignalRService, private us: AuthService, session: SessionService) {
    this.us.user.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
  }


  ngOnInit(): void {
    // Avvia la connessione SignalR
    this.ss.startConnection();

    // Aggiungi un listener per i messaggi ricevuti
    this.ss['connection'].on('SendGroupMessage', (message: Message) => {
      console.log(`Ricevo:
          nome: ${message.senderName},
          messaggio: ${message.body},
          tempo: ${message.timeStamp},
          id: ${message.id}`,);
      this.messages.push(message);
    });
  }
  sendMessage(): void {
    if (this.message.trim()) {
      console.log('Mando: ', this.message);
      this.ss.sendMessage("8", this.message);
    }
  }


}
