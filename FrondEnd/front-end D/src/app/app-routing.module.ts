import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { InformationPageComponent } from './components/information-page/information-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { StatsComponent } from './components/stats/stats.component';
import { LoggedInGuard } from './guards/logged-in.guard';
import { LoggedOutGuard } from './guards/logged-out.guard';
import { ListOfTerrainsComponent } from './components/list-of-terrains/list-of-terrains.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { TerrainComponent } from './components/terrain/terrain.component';
import { AccountComponent } from './components/account/account.component';
import { ListOfUsersComponent } from './components/list-of-users/list-of-users.component';
import { ListOfInstallationsComponent } from './components/list-of-installations/list-of-installations.component';
import { InstallationComponent } from './components/installation/installation.component';

const routes: Routes = [
  { path: '', component: InformationPageComponent },
  { path: 'login', component: LoginComponent ,canActivate:[LoggedOutGuard]},
  { path: 'register', component: RegisterComponent ,canActivate:[LoggedOutGuard]},
  { path: 'home', component: HomeComponent ,canActivate:[LoggedInGuard]},
  { path: 'stats', component: StatsComponent ,canActivate:[LoggedInGuard]},
  { path: 'myaccount', component: MyAccountComponent ,canActivate:[LoggedInGuard]},
  { path: 'terrain', component: TerrainComponent ,canActivate:[LoggedInGuard]},
  { path: 'account', component: AccountComponent ,canActivate:[LoggedInGuard]},
  { path: 'listofterrais', component: ListOfTerrainsComponent ,canActivate:[LoggedInGuard]},
  { path: 'listofusers', component: ListOfUsersComponent ,canActivate:[LoggedInGuard]},
  { path: 'listofinstallations', component: ListOfInstallationsComponent ,canActivate:[LoggedInGuard]},
  { path: 'installation', component: InstallationComponent ,canActivate:[LoggedInGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
