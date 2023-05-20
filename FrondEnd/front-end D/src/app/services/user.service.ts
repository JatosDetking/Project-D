import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { UserAPIService } from "../api/user-api.service";
import { User } from "../interfaces/user";
import { SharedService } from "./shared.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private userApi: UserAPIService,
    private sharedService: SharedService
  ) { sharedService.shareSelf("UserService", this) }
 
  getUserInfo(id: number) {
    return this.userApi.getUserInfo(id).pipe(map((res) => {
      return res
    }))
  }

  getUser(id: number) {
    const user: User = {
      id: 0,
      username: "",
      email: "",
      name: ""
    };
    this.getUserInfo(id).subscribe((res: any) => {
      user.id = id;
      user.username = res.username;
      user.email = res.email;
      user.name = res.name;
    });
    return user;
  }
}