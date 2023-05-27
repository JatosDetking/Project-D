import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { databaseURL } from './env';
@Injectable({
    providedIn: 'root'
})
export class VotesAPIService {

    constructor(
        private http: HttpClient
    ) { }

    getVotes(id: number) {
        return this.http.get(`${databaseURL}/terrain/vote/getterrainvotes`, {
            params: new HttpParams().set('terrainId', id)
        })
    }

    getMyVote(id: number) {
        return this.http.get(`${databaseURL}/terrain/vote/getmyvote`, {
            params: new HttpParams().set('terrainId', id)
        })
    }

    setMyVote(terrainId: number, vote: number) {
        return this.http.post(`${databaseURL}/terrain/vote/`,
            { terrainId, vote }
        )
    }
}