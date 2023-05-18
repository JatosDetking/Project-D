import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { UserAPIService } from "../api/user-api.service";

@Injectable({
    providedIn: 'root'
  })
  export class UserService {
  
    constructor(
        private userApi:UserAPIService
    ) { }

    getUserInfo(id:number){
        return this.userApi.getUserInfo(id).pipe(map((res)=>{
          return res
        }))
      }
  }