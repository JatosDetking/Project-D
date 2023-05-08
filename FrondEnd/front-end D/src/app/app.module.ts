import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenubarComponent } from './components/menubar/menubar.component';
import { MaterialModule } from './modules/material/material.module';
import { HomeComponent } from './components/home/home.component';
import { SubMenuBarComponent } from './components/sub-menu-bar/sub-menu-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CreateGroupComponent } from './dialogs/create-group/create-group.component';
import { DeleteGroupComponent } from './dialogs/delete-group/delete-group.component';
import { LoggedInGuard } from './guards/logged-in.guard';
import { AuthService } from './services/auth.service';
import { LoggedOutGuard } from './guards/logged-out.guard';
import { InformationPageComponent } from './components/information-page/information-page.component';
import { StatsComponent } from './components/stats/stats.component';
import { GroupComponent } from './components/group/group.component';
import { GroupUsersComponent } from './dialogs/group-users/group-users.component';
import { MakeUserRootComponent } from './dialogs/make-user-root/make-user-root.component';
import { AddUserComponent } from './dialogs/add-user/add-user.component';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { AddExpenseComponent } from './components/add-expense/add-expense.component';
import { ExpensesCalendarComponent } from './components/expenses-calendar/expenses-calendar.component';
import { ExpensesListComponent } from './components/expenses-list/expenses-list.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { EditExpenseComponent } from './dialogs/edit-expense/edit-expense.component';
import { DeleteExpenseComponent } from './dialogs/delete-expense/delete-expense.component';
import { SubMenubarStatsComponent } from './components/sub-menubar-stats/sub-menubar-stats.component';
import { SingleChartComponent } from './components/single-chart/single-chart.component';
import { CompareChartsComponent } from './components/compare-charts/compare-charts.component';
import { DoughnutComponent } from './components/doughnut/doughnut.component';
import { CalculationsComponent } from './components/calculations/calculations.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenIInterceptor } from './token-i.interceptor';
import { AccountComponent } from './components/account/account.component';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: TokenIInterceptor, multi: true },
];

@NgModule({
  declarations: [
    AppComponent,
    MenubarComponent,
    HomeComponent,
    SubMenuBarComponent,
    LoginComponent,
    RegisterComponent,
    CreateGroupComponent,
    DeleteGroupComponent,
    InformationPageComponent,
    StatsComponent,
    GroupComponent,
    GroupUsersComponent,
    MakeUserRootComponent,
    AddUserComponent,
    AddExpenseComponent,
    ExpensesCalendarComponent,
    ExpensesListComponent,
    EditExpenseComponent,
    DeleteExpenseComponent,
    SubMenubarStatsComponent,
    SingleChartComponent,
    CompareChartsComponent,
    DoughnutComponent,
    CalculationsComponent,
    AccountComponent
  ],
  imports: [
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
