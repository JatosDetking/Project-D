import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { databaseURL } from './env';
@Injectable({
    providedIn: 'root'
})
export class CalcilationAPIService {

    constructor(
        private http: HttpClient
    ) { }

    getCalculation(terrainsIds: string, instalationsIds:string,method:string, balance:number) {
        return this.http.get(`${databaseURL}/calculation/`, {
            params: new HttpParams().set('terrainsIds', terrainsIds).set('instalationsIds', instalationsIds).set('method', method).set('balance', balance)
        })
    }
}