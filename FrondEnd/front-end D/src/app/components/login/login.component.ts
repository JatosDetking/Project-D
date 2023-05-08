import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { onlyWordChars, whitespaceControl } from 'src/app/utils/controls';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  emailControl = new FormControl(null,[
    Validators.minLength(4),
    Validators.maxLength(20),
    Validators.required,
   
  ])

  passwordControl = new FormControl(null,[
    Validators.minLength(4),
    Validators.maxLength(20),
    Validators.required,
    
  ])

  loginServerError?:string= undefined
  loginServerRegistrationMessage?:string= undefined
  
  constructor(
    private authService:AuthService,
    private router:Router
  ) { }

  ngOnInit(): void {
  }

  login(){
    this.authService.login(this.emailControl.value,this.passwordControl.value).subscribe((res:any)=>{
      if(res.successful){
        this.loginServerError = undefined
       /*  this.registerServerRegistrationMessage = 'Successfully logged in.You will be redirected in 2 seconds.'
        setTimeout(()=>{ */
          if(this.router.url.endsWith('login')){
            this.router.navigate([''])
          }
        //},2000)
      }else{
        this.loginServerError = 'Something went wrong.'
        this.loginServerRegistrationMessage = undefined
      }
    },(err)=>{
      this.loginServerError = err.error
      this.loginServerRegistrationMessage = undefined
    })
  }

}
