import { Injectable } from '@angular/core';
import { gameSessionModel } from '../models/gameSession.model';
import { GeneralService } from './general.service';
import { HeaderService } from './header.service';
import { Router } from '@angular/router';
import { EventModel } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class MfeService {

  constructor(public gn: GeneralService, public headerService: HeaderService, private router: Router) { }

  event : EventModel | undefined;
  sessionDetail: gameSessionModel | undefined;
  isSessionDetail: boolean = false;

  sessionModal(status: boolean) {
    if(status){
      if(this.headerService.windowWidth < 768){
        this.headerService.updateScrollToHalf(true);
      }
      this.gn.isSessionModal = true;
      this.gn.isOverlayOn$.next(true);
    }
    else{
      this.gn.isSessionModal = false;
      this.gn.isOverlayOn$.next(false);
    }
  }

  openSessionDetail(session: gameSessionModel) {
    if(this.gn.isSessionModal){
      this.gn.isSessionModal=false;
    }
    this.sessionDetail = session;
    this.isSessionDetail = true;
    this.gn.isOverlayOn$.next(true);
    if(this.headerService.windowWidth < 768){
      this.headerService.updateScrollToHalf(true);
    }
  }

  closeConfirmModal() {
    this.gn.isConfirmModal = false;
    this.gn.isOverlayOn$.next(false);
  }

  closeSignModal() {
    this.gn.isSignModal = false;
    this.gn.isOverlayOn$.next(false);
  }

  redirect(login: boolean) {
    this.gn.isSignModal = false;
    this.gn.isOverlayOn$.next(false);
    this.gn.eventRoute = this.router.url;
    if(login){
      this.router.navigate(['login']);
    }
    else{
      this.router.navigate(['register']);
    }
  }
}
