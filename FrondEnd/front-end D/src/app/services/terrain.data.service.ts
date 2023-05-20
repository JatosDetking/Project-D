import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { TerrainDataApiService } from "../api/terrain.data-api.service";
import { SharedService } from "./shared.service";

@Injectable({
    providedIn: 'root'
})
export class TerrainDataService {

    constructor(
        private terrainDataApi: TerrainDataApiService,
        private sharedService: SharedService
    ) { sharedService.shareSelf("TerrainDataService", this) }

    getTerrainDataList(id: number) {
        return this.terrainDataApi.getTerrainData(id).pipe(map((res) => {
            return res
        }))
    }
    updateTerrainData(terrainId: number, data: number, id: number) {
        return this.terrainDataApi.updateTerrainData(terrainId, data, id).pipe(map((res) => {
            return res
        }))
    }
}