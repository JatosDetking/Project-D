import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { databaseURL } from './env';

@Injectable({
  providedIn: 'root'
})
export class SuggestionsService {

  constructor(
    private http: HttpClient,
  ) { }

  getTags() {
    return this.http.get(`${databaseURL}/suggestion/get-tags`)
  }

  getLocations() {
    return this.http.get(`${databaseURL}/suggestion/get-locations`)
  }

  addTag(tag:string){
    return this.http.post(`${databaseURL}/suggestion/add-tag`,{tag})
  }

  addLocation(location:string){
    return this.http.post(`${databaseURL}/suggestion/add-location`,{location})
  }
}
