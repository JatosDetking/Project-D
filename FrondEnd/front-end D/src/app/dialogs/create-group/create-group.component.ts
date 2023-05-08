import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GroupsApiService } from 'src/app/api/groups-api.service';
import { letterControl, onlyWordChars, whitespaceControl } from 'src/app/utils/controls';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {
  spinner = false;
  groupName = new FormControl(null,[
    Validators.minLength(4),
    Validators.maxLength(20),
    Validators.required,
    letterControl,
    onlyWordChars
  ])
  
  constructor(
    public dialogRef: MatDialogRef<CreateGroupComponent>,
    public groupsAPI:GroupsApiService,
  ) { }

  ngOnInit(): void {
  }

  createGroup(){
    this.spinner = true
    this.groupsAPI.createGroup(this.groupName.value).subscribe((res)=>{
      this.spinner = false;
      this.dialogRef.close({name:this.groupName.value});
    },(err)=>{
      this.spinner = false;
    })
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
