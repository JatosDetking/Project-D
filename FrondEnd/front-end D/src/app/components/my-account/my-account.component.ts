import { Component, OnInit, Inject, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { ChangeBalanceComponent } from 'src/app/dialogs/change-balance/change-balance.component';
import { ChangePasswordComponent } from 'src/app/dialogs/change-password/change-password.component';
import { Router } from '@angular/router';
import { MatAccordion } from '@angular/material/expansion';
import { ConfirmationsComponent } from 'src/app/dialogs/confirmations/confirmations.component';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements AfterViewInit {
  @ViewChild(MatAccordion)
  accordion!: MatAccordion;
  
  id:number=+localStorage.getItem('id')!;
  username: string = localStorage.getItem('username')!;
  email: string = localStorage.getItem('email')!;
  name: string = localStorage.getItem('name')!;
  balance: any;

  constructor(
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private router:Router,
    private sharedService:SharedService
  ) { }

  ngAfterViewInit(): void {
    this.sharedService.AuthService?.balanceSubject.subscribe(balance => {
      this.balance = balance;
      this.ref.detectChanges();
    })
    this.sharedService.AuthService?.balanceSubject.next(localStorage.getItem("balance"));
  }
  openDialogChangeBalance(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '350px'; 
    dialogConfig.height = '250px';
    const dialogRef = this.dialog.open(ChangeBalanceComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  openDialogChangePassword(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px'; 
    dialogConfig.height = '340px';
    const dialogRef = this.dialog.open(ChangePasswordComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  deleteAccount(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '350px';
    dialogConfig.height = '200px';
    dialogConfig.data = 'Are you sure you want to delete your account?';

    const dialogRef = this.dialog.open(ConfirmationsComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: any) => {
      if(result==true)
      this.sharedService.AuthService?.deleteMyAccount().subscribe((res: any) => {
        this.sharedService.AuthService?.logout();
        this.router.navigate(['login']);
      });
    });
  }
}