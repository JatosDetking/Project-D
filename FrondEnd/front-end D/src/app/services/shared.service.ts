import { Injectable } from '@angular/core';
import { GroupService } from './group.service';
import { TerrainService } from './terrain.service';
import { TerrainDataService } from './terrain.data.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  GroupService?:GroupService
  TerrainService?:TerrainService
  TerrainDataService?:TerrainDataService
  constructor(
    
  ) { }

  shareSelf(serviceName:string,serviceInstance:any){
    //@ts-ignore
    this[serviceName] = serviceInstance
  }
}
