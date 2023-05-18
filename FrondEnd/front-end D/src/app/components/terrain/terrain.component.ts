import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Terrain } from 'src/app/interfaces/terrain';

@Component({
  selector: 'app-terrain',
  templateUrl: './terrain.component.html',
  styleUrls: ['./terrain.component.scss']
})
export class TerrainComponent implements OnInit {
  terrain: Terrain  = {
    id: 0,
    name: "Empty",
    price: 0,
    creator_id: 0,
    type: "Empty",
    last_change_time: "Empty",
    last_change_id: 0,
    terrainsData: []
  };

  constructor(
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.terrain = JSON.parse(this.route.snapshot.queryParams['terrain']);
    //console.log(this.terrain.id)
  }

}
