import { Component, Inject, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { GroupService } from './services/group.service';
import { SharedService } from './services/shared.service';
import { TerrainService } from './services/terrain.service';
import { TerrainDataService } from './services/terrain.data.service';
import { CommentService } from './services/comment.service'; 
import { SharedLogicService } from './services/shared.logic.service';
import { UserService } from './services/user.service';
import { VotesService } from './services/votes.service';
import { InstallationService } from './services/installation.service';


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
    private terrainDataService:TerrainDataService,
    private commentService:CommentService,
    private sharedLogicService:SharedLogicService,
    private userService:UserService,
    private votesService:VotesService,
    private installationService:InstallationService,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) {
  }

  ngOnInit(): void {
    /* this._locale = 'fr';
    this._adapter.setLocale(this._locale); */
  }
}
