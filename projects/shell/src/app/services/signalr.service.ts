import { Injectable, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })

export class SignalRService implements OnInit {
    
    private connection: signalR.HubConnection;
    private hubUrl = 'https://localhost:7015/chatHub';

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(this.hubUrl, {
                accessTokenFactory: () => localStorage.getItem('token') ?? ''
            })
            .withAutomaticReconnect()
            .build();

        this.registerOnServerEvents();
    }
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }

    startConnection(): void {
        this.connection
            .start()
            .then(() => console.log('SignalR connection started'))
            .catch((err) => console.error('Error while starting connection: ', err));
    }

    sendMessage(user: string, message: string): void {
        this.connection
            .invoke('SendMessage', user, message)
            .catch((err) => console.error('Error while sending message: ', err));
    }

    sendNotification(userId: string, message: string): void {
        this.connection
            .invoke('SendNotificationAsync', userId, message)
            .catch((err) => console.error('Error while sending notification: ', err));
    }

    private registerOnServerEvents(): void {
        this.connection.on('ReceiveMessage', (user: string, message: string) => {
            console.log(`Message received from ${user}: ${message}`);
        });
    }

}