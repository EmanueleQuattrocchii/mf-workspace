import { Injectable } from '@angular/core';
import { EventModel } from '../models/event.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  eventDetail: EventModel | undefined;

  isSessionModal: boolean = false;

  isSignModal: boolean = false;

  eventRoute: string = '';

  isConfirmModal: boolean = false;
  isLoading: boolean = false;
  isQueueModal: boolean = false;

  isOverlayOn$ = new BehaviorSubject<boolean>(false);

  isDeleteUserModal: boolean = false;
  isCreateUserModal: boolean = false;

  isLoadingScreen$ = new BehaviorSubject<boolean>(false);

  isInputFixed$ = new BehaviorSubject<boolean>(false);

  serverError: boolean = false;
  serverConfirm: boolean = false;
  confirmMessage: string = '';
  errorMessage: string = 'Server Error, Please Try Again';
  defErrMessage: string = 'Server Error, Please Try Again';

  setError() {
    if (this.serverConfirm = true) {
      this.serverConfirm = false;
    }
    this.serverError = true;
    setTimeout(() => {
      this.serverError = false;
    }, 4000);
  }

  setConfirm() {
    if (this.serverError = true) {
      this.serverError = false;
    }
    this.serverConfirm = true;
    setTimeout(() => {
      this.serverConfirm = false;
    }, 4000);
  }
}