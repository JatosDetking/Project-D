import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { InformationPageComponent } from './components/information-page/information-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { StatsComponent } from './components/stats/stats.component';
import { LoggedInGuard } from './guards/logged-in.guard';
import { LoggedOutGuard } from './guards/logged-out.guard';
import { MyListOfTerrainsComponent } from './components/my-list-of-terrains/my-list-of-terrains.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { TerrainComponent } from './components/terrain/terrain.component';

const routes: Routes = [
  { path: '', component: InformationPageComponent },
  { path: 'login', component: LoginComponent ,canActivate:[LoggedOutGuard]},
  { path: 'register', component: RegisterComponent ,canActivate:[LoggedOutGuard]},
  { path: 'home', component: HomeComponent ,canActivate:[LoggedInGuard]},
  { path: 'stats', component: StatsComponent ,canActivate:[LoggedInGuard]},
  { path: 'myaccount', component: MyAccountComponent ,canActivate:[LoggedInGuard]},
  { path: 'myterrains', component: MyListOfTerrainsComponent,canActivate:[LoggedInGuard]},
  { path: 'terrain', component: TerrainComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
