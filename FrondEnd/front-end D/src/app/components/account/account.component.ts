import { Component, OnInit, Inject, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeBalanceComponent } from 'src/app/dialogs/change-balance/change-balance.component';
import { ChangePasswordComponent } from 'src/app/dialogs/change-password/change-password.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements AfterViewInit {
  username: string = localStorage.getItem('username')!;
  email: string = localStorage.getItem('email')!;
  name: string = localStorage.getItem('name')!;
  balance:any;

  constructor(
    public dialog: MatDialog,
    public authService:AuthService,
    private ref:ChangeDetectorRef
    ) {}

    ngAfterViewInit(): void {
      this.authService.balanceSubject.subscribe(balance=>{
        this.balance=balance;
        this.ref.detectChanges();
      })
      this.authService.balanceSubject.next(localStorage.getItem("balance"));
    }

 openDialogChangeBalance(): void {
    const dialogRef = this.dialog.open(ChangeBalanceComponent);

    dialogRef.afterClosed().subscribe(result => {
          
    });
  }
  openDialogChangePassword(): void {
    const dialogRef = this.dialog.open(ChangePasswordComponent);

    dialogRef.afterClosed().subscribe(result => {
          
    });
  }
}