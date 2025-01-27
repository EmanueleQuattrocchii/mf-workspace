import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { gameSessionModel } from '../../models/gameSession.model';
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


  user: User | undefined;
  message = '';
  groupName: string = "";
  session: gameSessionModel | undefined;
  @ViewChild('last') last: ElementRef | undefined;

  constructor(public ss: SignalRService, private us: AuthService, private sessionService: SessionService, public router: Router, private activatedRoute: ActivatedRoute) {
    this.us.user.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });

    this.sessionService.getSessionById(Number(this.groupName));
    this.session = this.sessionService.sessionDetail;
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.groupName = params['sessionId'];
    });
    this.ss.startConnection();
    this.ss.joinGroup(this.groupName);

  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.last?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 1000);
  }
  ExitChat() {
    this.ss.leaveGroup(this.groupName);
    this.router.navigate(['/choice/chat']);
  }

  sendMessage(): void {
    if (this.message.trim()) {
      this.ss.sendGroupMessage(this.groupName, this.message);
    }
    this.message = '';
  }
}
