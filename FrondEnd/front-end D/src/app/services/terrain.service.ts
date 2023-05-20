import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { TerrainApiService } from "../api/terrains-api.service"; 
import { SharedService } from "./shared.service";

@Injectable({
    providedIn: 'root'
  })
  export class TerrainService {
  
    constructor(
        private terrainApi:TerrainApiService,
        private sharedService: SharedService
    ) {sharedService.shareSelf("TerrainService", this) }

    getMyTerrainsList(){
        return this.terrainApi.getMyTerrains().pipe(map((res)=>{
          return res
        }))
      }
  }