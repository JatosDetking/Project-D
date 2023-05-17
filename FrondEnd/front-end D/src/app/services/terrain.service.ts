import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { TerrainApiService } from "../api/terrains-api.service"; 

@Injectable({
    providedIn: 'root'
  })
  export class TerrainService {
  
    constructor(
        private terrainApi:TerrainApiService
    ) { }

    getMyTerrainsList(){
        return this.terrainApi.getMyTerrains().pipe(map((res)=>{
          return res
        }))
      }
  }