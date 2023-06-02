import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { onlyWordChars, whitespaceControl } from 'src/app/utils/controls';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements AfterViewInit {

 
  usernameControl = new FormControl(null,[
    Validators.minLength(4),
    Validators.maxLength(20),
    Validators.required,
    onlyWordChars
  ])

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
  emailControl = new FormControl(null,[
    Validators.minLength(4),
    Validators.maxLength(20),
    Validators.required,
  ])
  nameControl = new FormControl(null,[
    Validators.maxLength(20),
    Validators.required,
  ])
  passmatch = true
  registerServerError?:string= undefined
  registerServerRegistrationMessage?:string= undefined

  constructor(
    private authService:AuthService,
    private router:Router
    ) { }

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

  register(){
    this.authService.register(this.usernameControl.value,this.passwordControl.value,this.emailControl.value,this.nameControl.value).subscribe((res:any)=>{
      if(res instanceof Array&&res[0] == 'Successfully registered.'){
        this.registerServerError = undefined
        this.registerServerRegistrationMessage = 'Successfully registered.You can now login to your account.You will be redirected in 4 seconds.'
        setTimeout(()=>{
          if(this.router.url.endsWith('register')){
            this.router.navigate(['login'])
          }
        },4000)
      }else{
        this.registerServerError = 'Something went wrong.'
        this.registerServerRegistrationMessage = undefined
      }
    },(error)=>{
      this.registerServerError = error.error
      this.registerServerRegistrationMessage = undefined
    })
  }
}
