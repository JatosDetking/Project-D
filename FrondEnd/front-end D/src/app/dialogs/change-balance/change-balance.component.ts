import { Component, OnInit, AfterViewInit} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-change-balance',
  templateUrl: './change-balance.component.html',
  styleUrls: ['./change-balance.component.scss']
})
export class ChangeBalanceComponent implements OnInit, AfterViewInit {

  constructor
  (private authService:AuthService,
   public dialogRef: MatDialogRef<ChangeBalanceComponent>
   ) { }

  balance: FormControl = new FormControl(localStorage.getItem('balance'), [
    Validators.pattern(/^\d+$/), 
    Validators.required,
    Validators.maxLength(8)
  ]);

  setBalance(){
    this.authService.updateBalance(this.balance.value).subscribe(res=>{
      this.authService.updateMyInfo().subscribe();
      this.dialogRef.close();
    });    
  }
  
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.balance.valueChanges.subscribe(x=>console.log(this.balance))
  }

}
