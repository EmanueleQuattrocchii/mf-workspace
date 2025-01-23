import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })

export class SignalRService implements OnInit {
    connection: any;
    constructor(private http: HttpClient) {
        this.SignalRConnection();
    }

    public SignalRConnection() {
        console.log(localStorage.getItem('token') ?? '');

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:7015/chatHub', {
                accessTokenFactory: () => localStorage.getItem('token') ?? ''
            })
            .withAutomaticReconnect()
            .build();
        this.connection.on("ReceiveMessage", (message: string) => {
            console.log(message);
        });
        this.connection.start()
            .then(() => console.log('Connection started'))
            .catch((err: string) => console.log('Error while starting connection: ' + err));

    }
    ngOnInit(): void {

    }

}