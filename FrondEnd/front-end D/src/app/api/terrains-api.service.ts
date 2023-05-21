import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { databaseURL } from './env';
@Injectable({
  providedIn: 'root'
})
export class TerrainApiService {

  constructor(
    private http : HttpClient
    ) { }

  getMyTerrains(){
    return this.http.get(`${databaseURL}/terrain/getmyterrain`)
  }
  getTerrain(id:number){
    return this.http.get(`${databaseURL}/terrain/getterrain`,{
      params:new HttpParams().set('id',id)
    })
  }
  updateTerrain(id: number, name: string, price: number, type: string) {
    return this.http.put(`${databaseURL}/terrain/editterrain`,
        { id, name, price, type}
    )
}

}