import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as signalR from '@microsoft/signalr';
import { SignalRService } from '../../services/signalr.service';
interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
}
@Component({
  selector: 'app-session-chat',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './session-chat.component.html',
  styleUrl: './session-chat.component.scss'
})
export class SessionChatComponent implements OnInit {
  private hubConnection!: signalR.HubConnection;
  
  sessionName = signal('Conversazione di Gruppo');
  currentUser = signal('Mario');
  messages = signal<Message[]>([]);
  newMessage = signal('');

  constructor(public ss: SignalRService) {
   this.ss.SignalRConnection();
  }

  ngOnInit(): void {
  }

  private setupSignalRListeners(): void {
    this.hubConnection.on('ReceiveMessage', (message: Message) => {
      this.messages.update(msgs => [...msgs, message]);
    });

    this.hubConnection.on('MessageRead', (messageId: string, readBy: string) => {
      this.messages.update(msgs => 
        msgs.map(m => 
          m.id === messageId ? {...m, isRead: true} : m
        )
      );
    });

    this.hubConnection.start()
      .catch(err => console.error('SignalR connection error:', err));
  }

  sendMessage(): void {
    const messageText = this.newMessage();
    if (messageText.trim()) {
      const message: Message = {
        id: this.generateUniqueId(),
        sender: this.currentUser(),
        text: messageText,
        timestamp: new Date(),
        isRead: false
      };

      // Invia tramite SignalR
      this.hubConnection.invoke('SendMessage', message)
        .catch(err => console.error('Errore invio messaggio:', err));

      this.messages.update(msgs => [...msgs, message]);
      this.newMessage.set('');
    }
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}
