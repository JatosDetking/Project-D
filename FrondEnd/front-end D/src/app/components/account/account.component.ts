import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  
  @ViewChild(MatAccordion)
  accordion!: MatAccordion;

  user?:User;

  constructor(
    private route: ActivatedRoute

  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(this.route.snapshot.queryParams['user']);
  }

}
