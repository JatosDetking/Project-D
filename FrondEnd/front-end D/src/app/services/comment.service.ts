import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { CommentAPIService } from "../api/comment-api.service";

@Injectable({
    providedIn: 'root'
  })
  export class CommentService {
  
    constructor(
        private commentApi:CommentAPIService
    ) { }

    getComments(id:number){
        return this.commentApi.getUComments(id).pipe(map((res)=>{
          return res
        }))
      }
  }