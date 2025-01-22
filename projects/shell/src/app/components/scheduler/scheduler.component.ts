import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { gameSessionModel } from '../../models/gameSession.model';
import { SessionService } from '../../services/session.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-scheduler',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scheduler.component.html',
  styleUrl: './scheduler.component.scss'
})
export class SchedulerComponent implements OnInit {

  constructor(private router: Router, public sessionService: SessionService, public as: AuthService) { }

  @Input() isScrolled = false;

  days: Array<Date> = [];
  count: number = 0;
  today = new Date();

  userInput: string = '';
  destroy$ = new Subject<void>();
  searchTerms = new Subject<string>();
  filteredEventSessions: gameSessionModel[] = [];
  foundedDays: Array<Date> = [];

  userId: string = "";

  ngOnInit() {
    this.userId = this.as.getUserId() ?? '';
    this.sessionService.getSessionsOfUser(this.userId);
    this.getDates();

    this.searchTerms.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(term => {
        if (term === '') {
          setTimeout(() => {
            this.userId = this.as.getUserId() ?? '';
            this.sessionService.getSessionsOfUser(this.userId);
          }, 10);
        }
        return this.sessionService.getFilteredSessionsOfUser(term, this.userId);
      }),
      takeUntil(this.destroy$)
    ).subscribe(res => {
      this.filteredEventSessions = res.value;
      this.updateDates();
    });
  }

  getMonthString(date: Date) {
    return date.toLocaleString('default', { month: 'long' });
  }

  getDayOfWeekString(date: Date) {
    return date.toLocaleString('default', { weekday: 'long' });
  }

  // getDates(count: number = 0) {
  //   this.days = [];
  //   for (let i = 0; i < 28; i++) {
  //     let tempDate = new Date(this.today);
  //     tempDate.setDate(this.today.getDate() + (count * 28 + i));
  //     this.days.push(tempDate);
  //   }
  // }

  getDates(count: number = 0) {
    this.days = [];

    // Calcolare il primo lunedì prima di oggi
    let tempDate = new Date(this.today);
    let dayOfWeek = tempDate.getDay(); // 0 per Domenica, 1 per Lunedì, ..., 6 per Sabato

    // Se oggi non è lunedì, sottrai i giorni necessari per arrivare al lunedì precedente
    let daysToSubtract = (dayOfWeek === 0) ? 6 : dayOfWeek - 1; // Se è domenica, torna al lunedì della settimana precedente
    tempDate.setDate(tempDate.getDate() - daysToSubtract);

    // Aggiungere i giorni a partire dal lunedì trovato
    for (let i = 0; i < 28; i++) {
      let dateToAdd = new Date(tempDate);
      dateToAdd.setDate(tempDate.getDate() + (count * 28 + i));
      this.days.push(dateToAdd);
    }

  }

  updateDays(changeCount: number) {
    this.count = this.count + changeCount;
    this.getDates(this.count);
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerms.next(target.value);
  }

  updateDates() {
    this.foundedDays = [];
    // Aggiungere i giorni trovati delle sessioni dell'utente
    for (let i = 0; i < this.filteredEventSessions.length; i++) {
      let dateToAdd = new Date(this.filteredEventSessions[i].startDate);
      this.foundedDays.push(dateToAdd);
    }
  }

  // filterEvents() {
  //   const skip = (this.currentPage - 1) * this.itemsPerPage;
  //   this.eventService.filterEventsByName(this.userInput, skip, this.itemsPerPage).pipe(takeUntil(this.destroy$)).subscribe(res => {
  //     this.filteredEvents = res.value;
  //     this.isEmpty = this.filteredEvents.length === 0;
  //     this.totalPages = Math.ceil(this.filteredEvents.length / this.itemsPerPage);
  //     this.currentPage = 1;
  //     this.updatePaginatedEvents();
  //   });
  // }

  goToEventDetail(eventId: number) {
    this.router.navigate(['/events/', eventId]);
  }

  formatDate(input: string | Date): string {
    let date: Date;

    // Se l'input è una stringa, prova a convertirla in una data
    if (typeof input === 'string') {
      date = new Date(input);
    } else if (input instanceof Date) {
      date = input;
    } else {
      throw new Error('Input non valido. Deve essere una stringa o una data.');
    }

    // Verifica se la data è valida
    if (isNaN(date.getTime())) {
      throw new Error('Data non valida.');
    }

    // Estrai giorno, mese e anno
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    // Restituisce la data formattata
    return `${day}/${month}/${year}`;
  }

}
