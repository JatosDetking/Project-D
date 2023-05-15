import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-change-balance',
  templateUrl: './change-balance.component.html',
  styleUrls: ['./change-balance.component.scss']
})
export class ChangeBalanceComponent implements OnInit {

  constructor
  (private authService:AuthService,
   public dialogRef: MatDialogRef<ChangeBalanceComponent>
   ) { }

  balance: FormControl = new FormControl(localStorage.getItem('balance'), [
    Validators.required, 
    Validators.pattern('^[0-9]+$')
  ]);

  setBalance(){
    this.authService.updateBalance(this.balance.value).subscribe(res=>{
      this.authService.updateMyInfo().subscribe();
      this.dialogRef.close();
    });
    
  }
  
  ngOnInit(): void {
  }

}
