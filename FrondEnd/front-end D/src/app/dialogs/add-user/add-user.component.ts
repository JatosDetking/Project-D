import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GroupsApiService } from 'src/app/api/groups-api.service';
import { GroupService } from 'src/app/services/group.service';
import { letterControl, onlyWordChars, whitespaceControl } from 'src/app/utils/controls';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  spinner = false;
  benderr ?:string;
  usernameControl = new FormControl(null,[
    Validators.minLength(4),
    Validators.maxLength(20),
    Validators.required,
    letterControl,
    onlyWordChars
  ])
  
  constructor(
    public dialogRef: MatDialogRef<AddUserComponent>,
    public groupsAPI:GroupsApiService,
    public group:GroupService
  ) { }

  ngOnInit(): void {
  }

  addUser(){
    this.spinner = true
    let selectedGroup = this.group.selectedGroup!;
    this.groupsAPI.editGroupUsers({
      username:this.usernameControl.value,
      location:'guests',
      action:'add',
      group_name:selectedGroup.name,
      group_id:selectedGroup.id
    }).subscribe((res)=>{
      this.spinner = false;
      this.dialogRef.close();
    },(err)=>{
      this.benderr = err.error[0];
      setTimeout(() => {
        this.benderr = undefined;
      }, 3000);
      this.spinner = false;
    })
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
