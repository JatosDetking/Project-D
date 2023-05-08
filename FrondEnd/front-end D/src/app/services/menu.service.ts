import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  reason = '';

  sidenav?: MatSidenav;
  constructor() {

  }

  initSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }

  close = (reason: string) => {
    this.reason = reason;
    this.sidenav!.close();
  }
  toggle = ()=> {
    if (this.sidenav?.opened) {
      this.sidenav!.close();
    } else {
      this.sidenav?.open();
    }
  }

}
