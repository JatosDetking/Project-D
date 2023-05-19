import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";


@Injectable({
    providedIn: 'root'
  })
  export class SharedLogicService {
  
    constructor(

    ) { }

    formatDateTime(dateString: string): string {
        const date = new Date(dateString);
      
        const formattedDate = date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      
        return `${formattedTime} ${formattedDate}`;
      }
  }