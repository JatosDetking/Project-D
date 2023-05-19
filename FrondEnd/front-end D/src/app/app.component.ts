import { Component, Inject, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { GroupService } from './services/group.service';
import { SharedService } from './services/shared.service';
import { TerrainService } from './services/terrain.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'frontend D';
  constructor(
    private shared:SharedService,
    private group:GroupService,
    private _adapter: DateAdapter<any>,
    private terrainService: TerrainService,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) {
  }

  ngOnInit(): void {
    /* this._locale = 'fr';
    this._adapter.setLocale(this._locale); */
  }
}
