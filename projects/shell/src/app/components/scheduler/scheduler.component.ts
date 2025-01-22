import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-scheduler',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scheduler.component.html',
  styleUrl: './scheduler.component.scss'
})
export class SchedulerComponent implements OnInit {

  @Input() isScrolled = false;
  
  days: Array<Date> = [];
  count: number = 0;
  today = new Date();

  userInput: string = '';
  destroy$ = new Subject<void>();
  searchTerms = new Subject<string>();

  ngOnInit() {
    this.getDates();

    // this.searchTerms.pipe(
    //   debounceTime(500),
    //   distinctUntilChanged(),
    //   switchMap(term => {
    //     const skip = (this.currentPage - 1) * this.itemsPerPage;
    //     return this.eventService.filterEventsByName(term, skip, this.itemsPerPage);
    //   }),
    //   takeUntil(this.destroy$)
    // ).subscribe(res => {
    //   this.filteredEvents = res.value;
    //   this.isEmpty = this.filteredEvents.length === 0;
    //   this.totalPages = Math.ceil(this.filteredEvents.length / this.itemsPerPage);
    //   this.currentPage = 1;
    //   this.updatePaginatedEvents();
    // });
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

}
