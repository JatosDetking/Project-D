import { Injectable } from '@angular/core';
import { GroupService } from './group.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  GroupService?:GroupService

  constructor(
    
  ) { }

  shareSelf(serviceName:string,serviceInstance:any){
    //@ts-ignore
    this[serviceName] = serviceInstance
  }
}
