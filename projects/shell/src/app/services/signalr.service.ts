import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../models/chat.model';

@Injectable({ providedIn: 'root' })

export class SignalRService {

    private connection: signalR.HubConnection;
    private hubUrl = 'https://localhost:7015/chatHub';
    public messageReceived$: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);

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
                this.joinGroup("8").then(() => {
                    this.connection.invoke('GetChatHystory', "8").then((response) => {
                        console.log('GetChatHystory: ', response);
                        this.messageReceived$.next(response);
                    });
                });
            })
            .catch((err) => console.error('Error while starting connection: ', err));
    }

    sendMessage(sesssionId: string, message: string): void {
        this.connection
            .invoke('SendGroupMessage', sesssionId, message)
            .catch((err) => console.error('Error while sending message: ', err));
    }

    sendNotification(userId: string, message: string): void {
        this.connection
            .invoke('SendNotificationAsync', userId, message)
            .catch((err) => console.error('Error while sending notification: ', err));
    }

    onReceiveMessage(callback: (message: string) => void): void {
        this.connection.on('SendGroupMessage', (message: string) => {
            callback(message);
        });
    }

    // Metodo per unirsi a un gruppo
    joinGroup(groupName: string): Promise<void> {
        return this.connection.invoke('JoinGroup', groupName)
            .then((response) => {
                console.log(`Joined group: ${groupName}`);
            })
            .catch(err => {
                console.error('Error joining group:', err);
                throw err;
            });
    }

    // Metodo per uscire da un gruppo
    leaveGroup(groupName: string): void {
        this.connection
            .invoke('LeaveGroup', groupName).then(() => {
                console.log('LeaveGroup: ', groupName);
            })
            .catch((err) => console.error('Error leaving group: ', err));
    }

    private registerOnServerEvents(): void {
        this.connection.on('ReceiveMessage', (user: string, message: string) => {
            console.log(`Message received from ${user}: ${message}`);
        });
    }
}