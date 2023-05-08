import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  constructor(
    public group:GroupService
  ) { }

  ngOnInit(): void {
  }

}
