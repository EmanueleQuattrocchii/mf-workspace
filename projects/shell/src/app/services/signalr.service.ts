import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { Chat, Message } from '../models/chat.model';

@Injectable({ providedIn: 'root' })

export class SignalRService {

    private connection: signalR.HubConnection;
    private hubUrl = 'https://localhost:7015/chatHub';
    public completeChat$: BehaviorSubject<Chat> = new BehaviorSubject<Chat>(null as any);
    public availableChats$: BehaviorSubject<Array<Chat>> = new BehaviorSubject<Array<Chat>>([]);

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(this.hubUrl, {
                accessTokenFactory: () => localStorage.getItem('token') ?? ''
            })
            .withAutomaticReconnect()
            .build();

        this.registerOnServerEvents();
    }

    startConnection(): void {
        this.connection
            .start()
            .then(() => {
                console.log('SignalR connection started');
                this.getChats();
            })
            .catch((err) => console.error('Error while starting connection: ', err));
    }

    sendGroupMessage(sesssionId: string, message: string): void {
        this.connection
            .invoke('SendGroupMessage', sesssionId, message)
            .then(() => {
                console.log('Messaggio inviato', message);
            })
            .catch((err) => console.error('Error while sending message: ', err));
    }

    getChats(): void {
        this.connection
            .invoke('GetChats')
            .then((response: Chat[]) => {
                console.log('Chats: ', response);
                this.availableChats$.next(response);
            })
            .catch((err) => console.error('Error while getting chats: ', err));
    }

    joinGroup(groupName: string): Promise<void> {
        return this.connection
            .invoke('JoinGroup', groupName)
            .then(() => {
                this.connection
                    .invoke('GetChatHistory', groupName)
                    .then((response: Chat) => {
                        console.log('Chat precedente: ', response);
                        this.completeChat$.next(response)
                    });
            })
            .catch(err => {
                console.error('Error joining group:', err);
                throw err;
            });
    }

    leaveGroup(groupName: string): void {
        this.connection
            .invoke('LeaveGroup', groupName)
            .then(() => { console.log('LeaveGroup: ', groupName) })
            .catch((err) => console.error('Error leaving group: ', err));
    }
    sendNotification(userId: string, message: string): void {
        this.connection
            .invoke('SendNotificationAsync', userId, message)
            .catch((err) => console.error('Error while sending notification: ', err));
    }

    onReceiveMessage(callback: (message: Message) => void): void {
        this.connection.on('SendGroupMessage', (message: Message) => {
            callback(message);
            console.log('Messaggio ricevuto:', message);
        });
    }

    private registerOnServerEvents(): void {
        this.connection.on('ReceiveMessage', (user: string, message: string) => {
            console.log(`Message received from ${user}: ${message}`);
        });
    }
}