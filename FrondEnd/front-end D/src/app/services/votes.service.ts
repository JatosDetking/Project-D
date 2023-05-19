import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { VotesAPIService } from "../api/votes-api.service";


@Injectable({
  providedIn: 'root'
})
export class VotesService {

  constructor(
    private votesApi: VotesAPIService
  ) { }

  getVotes(id: number) {
    return this.votesApi.getVotes(id).pipe(map((res) => {
      return res
    }))
  }

  getMyVotes(id: number) {
    return this.votesApi.getMyVote(id).pipe(map((res) => {
      return res
    }))
  }

  setMyVote(id: number, vote:number) {
    return this.votesApi.setMyVote(id,vote).pipe(map((res) => {
      return res
    }))
  }
  deleteMyVote(id: number) {
    return this.votesApi.deleteMyVote(id).pipe(map((res) => {
      return res
    }))
  }

  
}