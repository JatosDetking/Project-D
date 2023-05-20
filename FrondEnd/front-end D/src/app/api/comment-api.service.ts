import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { databaseURL } from './env';
@Injectable({
  providedIn: 'root'
})
export class CommentAPIService {

  constructor(
    private http: HttpClient
  ) { }

  getUComments(id: number) {
    return this.http.get(`${databaseURL}/terrain/comment/getterraincomments`, {
      params: new HttpParams().set('terrainId', id)
    })
  }

  setComment(terrainId: number, content: string) {
    return this.http.post(`${databaseURL}/terrain/comment/comment`,
      { terrainId, content }
    )
  }
  setSubComment(terrainId: number, content: string, parent_id: number) {
    return this.http.post(`${databaseURL}/terrain/comment/comment`,
      { terrainId, content, parent_id }
    )
  }
  deleteComment(id: number) {
    return this.http.delete(`${databaseURL}/terrain/comment/deletecomment`, {
      params: new HttpParams().set('id', id)
    })
  }
  updateComment(id: number, content: string) {
    return this.http.put(`${databaseURL}/terrain/comment/editcomment`,
      { id, content }
    )
  }
}