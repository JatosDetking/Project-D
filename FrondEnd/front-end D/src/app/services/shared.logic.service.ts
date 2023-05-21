import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { User } from "../interfaces/user";
import { SharedService } from "./shared.service";
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class SharedLogicService {

  constructor(
    private sharedService: SharedService,
    private router: Router
  ) { sharedService.shareSelf("SharedLogicService", this) }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    return `${formattedTime} ${formattedDate}`;
  }

  goToAccount(user: User) {
    if(user.id == +localStorage.getItem('id')!){
      this.router.navigate(['myaccount']);
    }else{
      this.router.navigate(['account'], { queryParams: { user: JSON.stringify(user) } });
    }   
  }
}