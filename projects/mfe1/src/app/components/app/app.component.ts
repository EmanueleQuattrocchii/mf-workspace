import { loadRemoteModule } from '@angular-architects/native-federation';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent{

  // constructor(public sharedservice: SharedService){}

  // async ngOnInit() {
  //   try {
  //     const module = await loadRemoteModule({
  //       remoteEntry: 'http://localhost:4200/MfeService.js', // Path del remoteEntry.js della Shell
  //       exposedModule: './MfeService', // Nome del modulo esposto
  //     });
 
  //     const MfeService = module.MfeService; // Ottieni la classe GeneralService
  //     const serviceInstance = new MfeService(); // Crea un'istanza
 
  //     console.log(serviceInstance.isSessionDetail); // Usa il servizio
  //   } catch (error) {
  //     console.error('Errore durante il caricamento del modulo remoto:', error);
  //   }
  // }

  closeConfirmModal() {
    // this.gn.isConfirmModal = false;
    // this.gn.isOverlayOn$.next(false);
  }
}
