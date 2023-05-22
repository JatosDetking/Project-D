import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { databaseURL } from './env';
@Injectable({
    providedIn: 'root'
})
export class InstallationApiService {

    constructor(
        private http: HttpClient
    ) { }

    getAllInstallations() {
        return this.http.get(`${databaseURL}/installation/getall`)
    }
    updateInstalation(id: number, name: string, intervals: string, performance_factors: string, price: number) {
        return this.http.put(`${databaseURL}/installation/edit`,
            { id, name, intervals, performance_factors, price }
        )
    }
    getInstallation(id: number) {
        return this.http.get(`${databaseURL}/installation/get`, {
            params: new HttpParams().set('id', id)
        })
    }
    deleteInstallation(id: number) {
        return this.http.delete(`${databaseURL}/installation/delete`, {
          params: new HttpParams().set('id', id)
        })
      }

}