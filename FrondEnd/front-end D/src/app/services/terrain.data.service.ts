import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { TerrainDataApiService } from "../api/terrain.data-api.service";
import { SharedService } from "./shared.service";

@Injectable({
    providedIn: 'root'
  })
  export class TerrainDataService {
  
    constructor(
        private terrainDataApi:TerrainDataApiService,
        private sharedService: SharedService
    ) {sharedService.shareSelf("TerrainDataService", this) }

    getMyTerrainDataList(id:number){
        return this.terrainDataApi.getMyTerrainData(id).pipe(map((res)=>{
          return res
        }))
      }
  }