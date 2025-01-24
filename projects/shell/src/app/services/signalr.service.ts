import { Injectable, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })

export class SignalRService implements OnInit {
    private hubUrl = 'https://localhost:7015/chatHub';

    private hubConnection!: signalR.HubConnection;

    constructor() { }
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }

    // Metodo per avviare la connessione
    startConnection(): void {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(this.hubUrl) //dobbiamo vedere che fare su azure
            .withAutomaticReconnect()
            .build();

        this.hubConnection
            .start()
            .then(() => {
                console.log('Connection started')
                this.joinGroup('8');
            })
            .catch((err) => console.error('Error starting connection: ', err));
    }

    // Metodo per inviare un messaggio a un gruppo
    sendGroupMessage(groupName: string, message: string): void {
        this.hubConnection
            .invoke('SendGroupMessage', groupName, message)
            .catch((err) => console.error('Error sending message: ', err));
    }

    // Metodo per ricevere i messaggi
    onReceiveMessage(callback: (message: string) => void): void {
        this.hubConnection.on('SendGroupMessage', (message: string) => {
            callback(message);
        });
    }

    // Metodo per unirsi a un gruppo
    joinGroup(groupName: string): void {
        this.hubConnection
            .invoke('JoinGroup', groupName).then(() => {
                console.log('Joined group: ', groupName);
            })
            .catch((err) => console.error('Error joining group: ', err));
    }

    // Metodo per uscire da un gruppo
    leaveGroup(groupName: string): void {
        this.hubConnection
            .invoke('LeaveGroup', groupName).then(() => {
                console.log('LeaveGroup: ', groupName);
            })
            .catch((err) => console.error('Error leaving group: ', err));
    }

}