import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
  func: ()=>void;
  url: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  tiles: Tile[] = [
    {text: 'One', cols: 3, rows: 1, color: 'lightblue',func: ()=>{this.gotoAllUsersPage()}, url: "/assets/login 1.jpg"},
    {text: 'Two', cols: 1, rows: 2, color: 'lightgreen', func: ()=>{console.log("2")}, url: "/assets/login 1.png"},
    {text: 'Three', cols: 1, rows: 1, color: 'lightpink', func: ()=>{console.log("3")}, url: "/assets/login 1.jpg"},
    {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1', func: ()=>{console.log("4")}, url: "/assets/login 1.png"}
  ];

  gotoAllUsersPage(){
    this.router.navigate(['account'])
  } 
  gotoAllTerrainsPage(){
    this.router.navigate([''])
  } 
  
  constructor(
    private router:Router
  ) {
  }


 

}
