import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { databaseURL } from './env';
@Injectable({
  providedIn: 'root'
})
export class CommentAPIService {

  constructor(
    private http : HttpClient
    ) { }

  getUComments(id:number){
    return this.http.get(`${databaseURL}/terrain/comment/getterraincomments`,{
      params:new HttpParams().set('terrainId',id)
    })
  }

  
}