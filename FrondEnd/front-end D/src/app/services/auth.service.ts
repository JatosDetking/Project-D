import { Injectable } from '@angular/core';
import { of, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthAPIService } from '../api/auth-api.service';
import { GroupService } from './group.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private authAPI:AuthAPIService,
    private share:SharedService,
    ) { }

  balanceSubject = new Subject();

  loggedId(){
    let token = this.getToken();
    if(token){
      return true  
    }else{
      return false
    }
  }
  
  getToken(){
    return localStorage.getItem('token');
  }

  getUser(){
    return {
      email: localStorage.getItem("email"),
      username: localStorage.getItem("username"),
      name: localStorage.getItem("name"),
      balance: localStorage.getItem("balance")
    }
   
  }

  saveUserInfo(res: any){
    this.balanceSubject.next(res.balance)
    if( res.token){
      localStorage.setItem("token", res.token)
    }
    localStorage.setItem("email", res.email)
    localStorage.setItem("username", res.username)
    localStorage.setItem("name", res.name)
    localStorage.setItem("balance",res.balance)
  }

  login(email:string,password:string){
    email = email.trim()
    password = password.trim()
    return this.authAPI.login(email,password).pipe(map((res:any)=>{
      if(res.successful){    
        this.saveUserInfo(res);
      }
      return res
    }),catchError((err)=>{
      return throwError(err)
    }))   
  }

  register(username:string,password:string,email:string,name:string){
    email = email.trim()
    password = password.trim()
    return this.authAPI.register(username,password,email,name).pipe(map((res)=>{
      console.log(res);
      return res
    }))
  }

  updateBalance(balance:number){
    return this.authAPI.updateBalance(balance).pipe(map((res)=>{
      return res
    }))
  }
  updatePassword(password:string){
    return this.authAPI.updatePassword(password).pipe(map((res)=>{
      return res
    }))
  }
  updateMyInfo(){
    return this.authAPI.getMyInfo().pipe(map((res)=>{
      this.saveUserInfo(res);
      return res
    }))
  }

  logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("email")
    localStorage.removeItem("username")
    localStorage.removeItem("name")
    localStorage.removeItem("balance")
  }
}
