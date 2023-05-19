import { Injectable } from '@angular/core';
import { GroupService } from './group.service';
import { TerrainService } from './terrain.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  GroupService?:GroupService
  TerrainService?:TerrainService
  constructor(
    
  ) { }

  shareSelf(serviceName:string,serviceInstance:any){
    //@ts-ignore
    this[serviceName] = serviceInstance
  }
}
