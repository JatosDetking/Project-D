import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { databaseURL } from './env';
import { TerrainData } from '../interfaces/terrain';
@Injectable({
  providedIn: 'root'
})
export class TerrainApiService {

  constructor(
    private http: HttpClient
  ) { }

  getMyTerrains() {
    return this.http.get(`${databaseURL}/terrain/getmyterrain`)
  }
  getTerrain(id: number) {
    return this.http.get(`${databaseURL}/terrain/getterrain`, {
      params: new HttpParams().set('id', id)
    })
  }
  getUserTerrains(id: number) {
    return this.http.get(`${databaseURL}/terrain/getuserterrain`, {
      params: new HttpParams().set('id', id)
    })
  }
  getAllTerrains() {
    return this.http.get(`${databaseURL}/terrain/getallterrains`)
  }

  updateTerrain(id: number, name: string, price: number, type: string) {
    return this.http.put(`${databaseURL}/terrain/editterrain`,
      { id, name, price, type }
    )
  }
  addTerrain(name: string, price: number, type: string, data: TerrainData[]) {
    return this.http.post(`${databaseURL}/terrain/add`,
      { name, price, type }
    )
  }
  deleteTerrain(id: number) {
    return this.http.delete(`${databaseURL}/terrain/deleteterrain`, {
      params: new HttpParams().set('id', id)
    })
  }

}