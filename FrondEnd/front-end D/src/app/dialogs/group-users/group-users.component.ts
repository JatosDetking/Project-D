import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GroupsApiService } from 'src/app/api/groups-api.service';
import { Group, Users } from 'src/app/interfaces/group';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/group.service';
import { AddUserComponent } from '../add-user/add-user.component';

@Component({
  selector: 'app-group-users',
  templateUrl: './group-users.component.html',
  styleUrls: ['./group-users.component.scss']
})
export class GroupUsersComponent implements AfterViewInit {

  loaded = false;
  groupData?:Group
  users?:Users
  currUserRole?:'root_admin'|'admin'|'guest'

  constructor(
    public groupService: GroupService,
    public groupsAPI: GroupsApiService,
    public auth:AuthService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<GroupUsersComponent>,
  ) { }

  getGroupUsersData() {
    this.loaded = false;
    this.groupsAPI.getGroupInfo(this.groupService.selectedGroup!.name,this.groupService.selectedGroup!.id).subscribe((groupData)=>{
      this.groupData = groupData.data[0]
      this.users = this.groupData!.users
   /*    if(this.users.root_admin == this.auth.getUser()){
        this.currUserRole = 'root_admin'
      }else if(this.users.admins&&this.users.admins.includes(this.auth.getUser())){
        this.currUserRole = 'admin'
      }else if(this.users.guests&&this.users.guests.includes(this.auth.getUser())){
        this.currUserRole = 'guest'
      } */
      this.currUserRole = 'admin'
      this.loaded = true;
    },err=>{
      console.error(err)
    })
  }

  ngAfterViewInit(): void {
    this.getGroupUsersData()
  }

  makeRoot(user:string){
    let group = this.groupData!
    this.groupsAPI.editGroupUsers({
      group_name:group.name,
      group_id:group.id,
      location:'guests',
      username:user,
      action:'make_root'
    }).subscribe((res)=>{
      console.log(res);
      this.getGroupUsersData()
    },err=>{
      console.log(err);
    })
  }

  makeGuest(user:string){
    let group = this.groupData!
    this.groupsAPI.editGroupUsers({
      group_name:group.name,
      group_id:group.id,
      location:'guests',
      username:user,
      action:'move'
    }).subscribe((res)=>{
      console.log(res);
      this.getGroupUsersData()
    },err=>{
      console.log(err);
    })
  }

  addPerson(){
    const dialogRef = this.dialog.open(AddUserComponent, {
      panelClass:'create-group',
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      this.getGroupUsersData()
    });
  }

  removeUser(user:string){
    let group = this.groupData!
    this.groupsAPI.editGroupUsers({
      group_name:group.name,
      group_id:group.id,
      location:'admins',
      username:user,
      action:'remove'
    }).subscribe((res)=>{
      console.log(res);
      this.getGroupUsersData()
    },err=>{
      console.log(err);
    })
  }

  makeAdmin(user:string){
    let group = this.groupData!
    this.groupsAPI.editGroupUsers({
      group_name:group.name,
      group_id:group.id,
      location:'admins',
      username:user,
      action:'move'
    }).subscribe((res)=>{
      console.log(res);
      this.getGroupUsersData()
    },err=>{
      console.log(err);
    })
  }

  closeUserPanel(){
    this.dialogRef.close()
  }
}
