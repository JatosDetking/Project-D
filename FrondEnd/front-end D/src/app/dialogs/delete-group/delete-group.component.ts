import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupsApiService } from 'src/app/api/groups-api.service';
import { Group } from 'src/app/interfaces/group';

@Component({
  selector: 'app-delete-group',
  templateUrl: './delete-group.component.html',
  styleUrls: ['./delete-group.component.scss']
})
export class DeleteGroupComponent implements OnInit {
  spinner = false;

  constructor(
    public dialogRef: MatDialogRef<DeleteGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {group:Group},
    public groupsAPI:GroupsApiService,
  ) { }

  ngOnInit(): void {
  }

  deleteGroup(){
    this.spinner = true;
    this.groupsAPI.deleteGroup(this.data.group.name,this.data.group.id)
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
