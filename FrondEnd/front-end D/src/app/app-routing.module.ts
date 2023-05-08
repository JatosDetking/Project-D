import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './components/account/account.component';
import { HomeComponent } from './components/home/home.component';
import { InformationPageComponent } from './components/information-page/information-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { StatsComponent } from './components/stats/stats.component';
import { LoggedInGuard } from './guards/logged-in.guard';
import { LoggedOutGuard } from './guards/logged-out.guard';

const routes: Routes = [
  { path: '', component: InformationPageComponent },
  { path: 'login', component: LoginComponent ,canActivate:[LoggedOutGuard]},
  { path: 'register', component: RegisterComponent ,canActivate:[LoggedOutGuard]},
  { path: 'home', component: HomeComponent ,canActivate:[LoggedInGuard]},
  { path: 'stats', component: StatsComponent ,canActivate:[LoggedInGuard]},
  { path: 'account', component: AccountComponent ,canActivate:[LoggedInGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
