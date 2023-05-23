import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { TerrainApiService } from "../api/terrains-api.service";
import { TerrainData } from "../interfaces/terrain";
import { SharedService } from "./shared.service";

@Injectable({
  providedIn: 'root'
})
export class TerrainService {

  constructor(
    private terrainApi: TerrainApiService,
    private sharedService: SharedService
  ) { sharedService.shareSelf("TerrainService", this) }

  getMyTerrainsList() {
    return this.terrainApi.getMyTerrains().pipe(map((res) => {
      return res
    }))
  }
  getUserTerrains(id: number) {
    return this.terrainApi.getUserTerrains(id).pipe(map((res) => {
      return res
    }))
  }
  getTerrain(id: number) {
    return this.terrainApi.getTerrain(id).pipe(map((res) => {
      return res
    }))
  }
  getAllTerrains() {
    return this.terrainApi.getAllTerrains().pipe(map((res) => {
      return res
    }))
  }

  addTerrain(name: string, price: number, type: string, data: TerrainData[]) {
    return this.terrainApi.addTerrain(name, price, type, data).pipe(map((res) => {
      return res
    }))
  }
  updateTerrain(id: number, name: string, price: number, type: string) {
    return this.terrainApi.updateTerrain(id, name, price, type).pipe(map((res) => {
      return res
    }))
  }
  deteleTerrain(id: number) {
    return this.terrainApi.deleteTerrain(id).pipe(map((res) => {
      return res
    }))
  }

}