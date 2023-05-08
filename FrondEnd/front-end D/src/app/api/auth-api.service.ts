import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { databaseURL } from './env';
@Injectable({
  providedIn: 'root'
})
export class AuthAPIService {

  constructor(
    private http : HttpClient
    ) { }

  login(email:string,password:string){
    return this.http.get(`${databaseURL}/user/login`,{
      params:new HttpParams().set('email',email).set('password',password)
    })
  }

  updateBalance(balance:number){
    return this.http.put(`${databaseURL}/user/updatebalance`,
      {balance}
    )
  }

  register(username:string,password:string, email:string,name:string){
    return this.http.post(`${databaseURL}/user/register`,
      {username,password,email,name}
    )
  }
}
