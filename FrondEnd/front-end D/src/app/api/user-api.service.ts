import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { databaseURL } from './env';
@Injectable({
  providedIn: 'root'
})
export class UserAPIService {

  constructor(
    private http : HttpClient
    ) { }

  getUserInfo(id:number){
    return this.http.get(`${databaseURL}/user/getuser`,{
      params:new HttpParams().set('id',id)
    })
  }

  
}