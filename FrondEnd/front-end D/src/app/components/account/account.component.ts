import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  user?:User;

  constructor(
    private route: ActivatedRoute

  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(this.route.snapshot.queryParams['user']);
  }

}
