import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { Chat, Message } from '../models/chat.model';
import { gameSessionModel } from '../models/gameSession.model';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })

export class SignalRService {

    private connection: signalR.HubConnection;
    private hubUrl = 'https://localhost:7015/chatHub';
    public completeChat$: BehaviorSubject<Chat> = new BehaviorSubject<Chat>(null as any);
    public availableChats$: BehaviorSubject<Array<Chat>> = new BehaviorSubject<Array<Chat>>([]);

    constructor(private sessionService: SessionService) {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(this.hubUrl, {
                accessTokenFactory: () => localStorage.getItem('token') ?? ''
            })
            .withAutomaticReconnect([0, 2000, 10000, 30000])
            .build();
        this.startConnection();
        this.registerOnServerEvents();
    }

    async startConnection(): Promise<void> {
        try {
            if (this.connection.state === signalR.HubConnectionState.Disconnected) {
                await this.connection.start();
                console.log('SignalR connection started');
                await this.getChats();
            } else {
                console.log('La connessione è già attiva o in fase di connessione');
            }
        } catch (err) {
            console.error('Error while starting connection: ', err);
        }
    }


    sendGroupMessage(sesssionId: string, message: string): void {
        this.connection
            .invoke('SendGroupMessage', sesssionId, message)
            .then(() => {
                console.log('Messaggio inviato', message);
            })
            .catch((err) => console.error('Error while sending message: ', err));
    }



    async joinGroup(groupName: string): Promise<void> {
        try {
            if (this.connection.state !== signalR.HubConnectionState.Connected) {
                console.log('Connection not in connected state. Attempting to reconnect...');
                await this.startConnection();
            }
            await this.connection.invoke('JoinGroup', groupName);
            console.log(`Joined group: ${groupName}`);
            await this.GetChatHistory(groupName);
        } catch (err) {
            console.error('Error joining group:', err);
        }
    }


    async leaveGroup(groupName: string): Promise<void> {
        try {
            await this.connection.invoke('LeaveGroup', groupName);
            console.log('LeaveGroup: ', groupName);
            await this.getChats();
        } catch (err) {
            console.error('Error leaving group: ', err);
        }
    }
    sendNotification(userId: string, message: string): void {
        this.connection
            .invoke('SendNotificationAsync', userId, message)
            .catch((err) => console.error('Error while sending notification: ', err));
    }

    private registerOnServerEvents(): void {
        this.connection.on('ReceiveMessage', (message: Message) => {
            const currentChat = this.completeChat$.value;
            this.getChats();
            if (currentChat) {
                currentChat.messages.push(message);
                this.completeChat$.next(currentChat);
            }
            else {
                console.error('No chat to add message to');
            }
        });
    }

    private async GetChatHistory(groupName: string): Promise<void> {
        try {
            const response: Chat = await this.connection.invoke('GetChatHistory', groupName);
            console.log('Chat precedente: ', response);
            this.completeChat$.next(response);
        } catch (err) {
            console.error('Error while getting chat history: ', err);
        }
    }

    private async getChats(): Promise<void> {
        try {
            const response: Chat[] = await this.connection.invoke('GetChats');
            console.log('Chats: ', response);
            const chatsWithSessionInfo = await Promise.all(response.map(async (chat) => {
                const sessionInfo: gameSessionModel = await this.sessionService.getSessionById(Number(chat.sessionId));
                chat.sessionInfo = sessionInfo;
                return chat;
            }));
            this.availableChats$.next(chatsWithSessionInfo);
        } catch (err) {
            console.error('Error while getting chats: ', err);
        }
    }
}
