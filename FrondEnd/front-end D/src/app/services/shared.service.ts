import { Injectable } from '@angular/core';
import { GroupService } from './group.service';
import { TerrainService } from './terrain.service';
import { TerrainDataService } from './terrain.data.service';
import { CommentService } from './comment.service';
import { SharedLogicService } from './shared.logic.service';
import { UserService } from './user.service';
import { VotesService } from './votes.service';
import { InstallationService } from './installation.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  GroupService?:GroupService
  TerrainService?:TerrainService
  TerrainDataService?:TerrainDataService
  CommentService?:CommentService
  SharedLogicService?:SharedLogicService
  UserService?:UserService
  VotesService?:VotesService
  InstallationService?:InstallationService
  AuthService?:AuthService
  constructor(
    
  ) { }

  shareSelf(serviceName:string,serviceInstance:any){
    //@ts-ignore
    this[serviceName] = serviceInstance
  }
}
