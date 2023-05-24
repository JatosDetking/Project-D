import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
  func: () => void;
  url: string,
  bgColor: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  tiles: Tile[] = [
    { text: 'Add terrain', cols: 2, rows: 1, color: '#DDBDF1', func: () => {this.gotoAddTerain() }, url: "/assets/login 1.png", bgColor: 'lightblue' },
    { text: 'Add instalation', cols: 2, rows: 1, color: '#DDBDF1', func: () => { this.gotoAddInstalation() }, url: "/assets/login 1.png", bgColor: 'lightblue' },
    { text: 'Calculation', cols: 2, rows: 3, color: 'lightgreen', func: () => { this.gotoCalculatin() }, url: "/assets/login 1.png", bgColor: 'blue' },
    { text: 'Terrains', cols: 4, rows: 1, color: 'lightblue', func: () => { this.gotoAllTerrains() }, url: "/assets/login 1.jpg", bgColor: 'lightblue' },
    { text: 'Instalations', cols: 2, rows: 1, color: 'lightpink', func: () => { this.gotoAllInstalation() }, url: "/assets/login 1.jpg", bgColor: 'lightblue' },
    { text: 'Users', cols: 2, rows: 1, color: '#DDBDF1', func: () => { this.gotoAllUsersPage() }, url: "/assets/login 1.png", bgColor: 'lightblue' },
  ];

  gotoAllUsersPage() {
    this.router.navigate(['listofusers'])
  }
  gotoAllInstalation() {
    this.router.navigate(['listofinstallations'])
  }
  gotoAllTerrains() {
    this.router.navigate(['listofterrais'])
  }
  gotoAddTerain() {
    this.router.navigate(['addterrain'])
  }
  gotoAddInstalation() {
    this.router.navigate(['addinstallation'])
  }
  gotoCalculatin() {
    this.router.navigate(['home'])
  }

  gotoAllTerrainsPage() {
    this.router.navigate([''])
  }

  constructor(
    private router: Router
  ) {
  }




}
