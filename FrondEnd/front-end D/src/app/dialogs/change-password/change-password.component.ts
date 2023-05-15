import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { onlyWordChars} from 'src/app/utils/controls';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  passwordControl = new FormControl(null,[
    Validators.minLength(4),
    Validators.maxLength(20),
    Validators.required,
    onlyWordChars
  ])

  passwordRepeatControl = new FormControl(null,[
    Validators.minLength(4),
    Validators.maxLength(20),
    Validators.required,
    onlyWordChars
  ])

  //password: string= "";
  passmatch = true

  checkPasswordsMatch  = ()=>{
    if(this.passwordControl.value&&this.passwordRepeatControl.value&&this.passwordRepeatControl.value == this.passwordControl.value){
      this.passmatch = true
      let p1errors:any = this.passwordControl.errors||{}
      let newp1Errors :any = {}
      Object.keys(p1errors).forEach((key)=>{
        if(key != 'passmatch'){
          newp1Errors[key] = p1errors[key]
        }
      })
      let p2errors:any = this.passwordRepeatControl.errors||{}
      let newp2Errors :any = {}
      Object.keys(p2errors).forEach((key)=>{
        if(key != 'passmatch'){
          newp2Errors[key] = p2errors[key]
        }
      })
      this.passwordControl.setErrors(Object.keys(newp1Errors).length>0?newp1Errors:null)
      this.passwordRepeatControl.setErrors(Object.keys(newp2Errors).length>0?newp2Errors:null)
    }else{
      this.passmatch = false
      this.passwordControl.setErrors({...this.passwordControl.errors,"passmatch":true})
      this.passwordRepeatControl.setErrors({...this.passwordRepeatControl.errors,"passmatch":true})
    }
  }

  ngAfterViewInit(): void {
    this.passwordControl.valueChanges.subscribe((change)=>{
      this.checkPasswordsMatch()
    })
    this.passwordRepeatControl.valueChanges.subscribe((change)=>{
      this.checkPasswordsMatch()
    })
  }


    
  constructor(
    private authService:AuthService,
    public dialogRef: MatDialogRef<ChangePasswordComponent>
  ) { }

  setBalance(){
    this.authService.updatePassword(this.passwordControl.value).subscribe(res=>{
      this.authService.updateMyInfo().subscribe();
      this.dialogRef.close();
    });
  }

    ngOnInit(): void {
    }

}
