import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { databaseURL } from './env';
@Injectable({
    providedIn: 'root'
})
export class TerrainDataApiService {

    constructor(
        private http: HttpClient
    ) { }

    getTerrainData(id: number) {
        return this.http.get(`${databaseURL}/terrain/data/getdata`, {
            params: new HttpParams().set('terrainId', id)
        })
    }
    updateTerrainData(terrainId: number, data: number, id: number) {
        return this.http.put(`${databaseURL}/terrain/data/editdata`,
            { terrainId, id, data }
        )
    }


}