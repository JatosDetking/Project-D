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
    getInstallation(id: number) {
        return this.http.get(`${databaseURL}/installation/get`, {
            params: new HttpParams().set('id', id)
        })
    }
    getAllUserInstallations(id: number) {
        return this.http.get(`${databaseURL}/installation/getallofuser`, {
            params: new HttpParams().set('id', id)
        })
    }
    updateInstalation(id: number, name: string, intervals: string, performance_factors: string, price: number) {
        return this.http.put(`${databaseURL}/installation/edit`,
            { id, name, intervals, performance_factors, price }
        )
    }
    addInstalation(name: string, intervals: string, performance_factors: string, price: number, type:string) {
        return this.http.post(`${databaseURL}/installation/add`,
            {name, intervals, performance_factors, price, type }
        )
    }

    deleteInstallation(id: number) {
        return this.http.delete(`${databaseURL}/installation/delete`, {
          params: new HttpParams().set('id', id)
        })
      }

}