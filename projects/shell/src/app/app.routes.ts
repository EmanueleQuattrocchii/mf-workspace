import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';
import { DashboardAdminComponent } from './components/admin/dashboard-admin/dashboard-admin.component';
import { CreateEventComponent } from './components/admin/events-admin/create-event/create-event.component';
import { EventDetailAdminComponent } from './components/admin/events-admin/eventdetail-admin/eventdetail-admin.component';
import { EventsAdminComponent } from './components/admin/events-admin/events-admin.component';
import { GamesAdminComponent } from './components/admin/games-admin/games-admin.component';
import { UsersAdminComponent } from './components/admin/users-admin/users-admin.component';
import { ChoiceChatComponent } from './components/choice-chat/choice-chat.component';
import { ConfirmRegistrationComponent } from './components/confirm-registration/confirm-registration.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { EventsComponent } from './components/events/events.component';
import { HomeComponent } from './components/home/home.component';
import { AuthLayoutComponent } from './components/layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { LoginComponent } from './components/login/login.component';
import { MobileComponent } from './components/mobile/mobile.component';
import { RegisterComponent } from './components/register/register.component';
import { RemoveRegistrationComponent } from './components/remove-registration/remove-registration.component';
import { SchedulerComponent } from './components/scheduler/scheduler.component';
import { SessionChatComponent } from './components/session-chat/session-chat.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AdminGuardService } from './services/guards/admin-guard.service';
import { AuthGuardService } from './services/guards/auth-guard.service';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'userSettings', component: UserProfileComponent, canActivate: [AuthGuardService] },
      { path: 'events', component: EventsComponent },
      { path: 'events/:id', component: EventDetailComponent },
      { path: 'mobile', component: MobileComponent },
      { path: 'scheduler', component: SchedulerComponent },
      { path: 'chat', component: SessionChatComponent, canActivate: [AuthGuardService] },
      { path: 'choice/chat', component: ChoiceChatComponent, canActivate: [AuthGuardService] }

    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      {
        path: 'dashboard-admin', component: DashboardAdminComponent, canActivate: [AdminGuardService],
        children: [
          { path: 'users', component: UsersAdminComponent },
          { path: 'events', component: EventsAdminComponent },
          { path: 'events/create', component: CreateEventComponent },
          { path: 'events/:id', component: EventDetailAdminComponent },
          { path: 'games', component: GamesAdminComponent }
        ]
      },
      { path: 'confirm', component: ConfirmRegistrationComponent },
      { path: 'delete', component: RemoveRegistrationComponent }
    ]
  },
  { path: '**', redirectTo: 'home' },

  {
    path: 'subscription',
    loadComponent: () =>
      loadRemoteModule('mfe1', './Component').then((m) => m.AppComponent)
  }

];
