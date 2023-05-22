import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmations',
  templateUrl: './confirmations.component.html',
  styleUrls: ['./confirmations.component.scss']
})
export class ConfirmationsComponent implements OnInit {

  data: any
  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.data = data;
  }

  ngOnInit(): void {
  }

}
