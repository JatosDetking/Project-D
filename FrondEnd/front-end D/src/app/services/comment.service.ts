import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { CommentAPIService } from "../api/comment-api.service";
import { SharedService } from "./shared.service";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(
    private commentApi: CommentAPIService,
    private sharedService: SharedService
  ) { sharedService.shareSelf("CommentService", this) }

  getComments(id: number) {
    return this.commentApi.getUComments(id).pipe(map((res) => {
      return res
    }))
  }

  setComments(id: number, content: string) {
    return this.commentApi.setComment(id, content).pipe(map((res) => {
      return res
    }))
  }
  setSubComments(id: number, content: string, comId: number) {
    return this.commentApi.setSubComment(id, content, comId).pipe(map((res) => {
      return res
    }))
  }
  deleteComments(id: number) {
    return this.commentApi.deleteComment(id).pipe(map((res) => {
      return res
    }))
  }
  updateComments(id: number, content: string) {
    return this.commentApi.updateComment(id, content).pipe(map((res) => {
      return res
    }))
  }
}