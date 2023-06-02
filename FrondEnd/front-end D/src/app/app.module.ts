import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenubarComponent } from './components/menubar/menubar.component';
import { MaterialModule } from './modules/material/material.module';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LoggedInGuard } from './guards/logged-in.guard';
import { LoggedOutGuard } from './guards/logged-out.guard';
import { InformationPageComponent } from './components/information-page/information-page.component';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenIInterceptor } from './token-i.interceptor';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { ChangeBalanceComponent } from './dialogs/change-balance/change-balance.component';
import { ChangePasswordComponent } from './dialogs/change-password/change-password.component';
import { ListOfTerrainsComponent } from './components/list-of-terrains/list-of-terrains.component';
import { TerrainComponent } from './components/terrain/terrain.component';
import { CommentComponent } from './components/comment/comment.component';
import { ListOfTerrainDataComponent } from './components/list-of-terrain-data/list-of-terrain-data.component';
import { TerrainDataEditComponent } from './dialogs/terrain-data-edit/terrain-data-edit.component';
import { AccountComponent } from './components/account/account.component';
import { ListOfUsersComponent } from './components/list-of-users/list-of-users.component';
import { ListOfInstallationsComponent } from './components/list-of-installations/list-of-installations.component';
import { InstallationComponent } from './components/installation/installation.component';
import { AddInstalationComponent } from './components/add-instalation/add-instalation.component';
import { ConfirmationsComponent } from './dialogs/confirmations/confirmations.component';
import { AddTerrainComponent } from './components/add-terrain/add-terrain.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddTerrainDataComponent } from './dialogs/add-terrain-data/add-terrain-data.component';
import { CalculationComponent } from './components/calculation/calculation.component';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: TokenIInterceptor, multi: true },
];

@NgModule({
  declarations: [
    AppComponent,
    MenubarComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    InformationPageComponent,
    MyAccountComponent,
    ChangeBalanceComponent,
    ChangePasswordComponent,
    ListOfTerrainsComponent,
    TerrainComponent,
    CommentComponent,
    ListOfTerrainDataComponent,
    TerrainDataEditComponent,
    AccountComponent,
    ListOfUsersComponent,
    ListOfInstallationsComponent,
    InstallationComponent,
    AddInstalationComponent,
    ConfirmationsComponent,
    AddTerrainComponent,
    AddTerrainDataComponent,
    CalculationComponent
  ],

  imports: [
    MatStepperModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [
    httpInterceptorProviders,
    {provide : LocationStrategy , useClass: HashLocationStrategy},
    LoggedInGuard,
    LoggedOutGuard,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
