import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthAPIService } from 'src/app/api/auth-api.service';
import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss']
})
export class MenubarComponent implements AfterViewInit {

 balance: any;

  constructor(
    private menuService:MenuService,
    public authService:AuthService,
    private authApiService:AuthAPIService,
    private router:Router,
    private ref:ChangeDetectorRef
  ) {

  }

  ngAfterViewInit(): void {
    this.toggle = this.menuService.toggle;
    this.authService.balanceSubject.subscribe(balance=>{
      this.balance=balance;
      this.ref.detectChanges();
    })
    this.authService.balanceSubject.next(localStorage.getItem("balance"));
  }

  toggle!:()=>void

  goToMyAccountPage(){
    this.router.navigate(['account'])
  }
  gotoHomePage(){
    this.router.navigate(['home'])
  } 

  gotoInformationPage(){
    this.router.navigate([''])
  }

  gotoStatisticsPage(){
    this.router.navigate(['stats'])
  }

  goToLoginPage(){
    this.router.navigate(['login'])
  }

  goToRegisterPage(){
    this.router.navigate(['register'])
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['login'])
  }
}
