import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { GroupsApiService } from '../api/groups-api.service';
import { DeleteExpenseComponent } from '../dialogs/delete-expense/delete-expense.component';
import { EditExpenseComponent } from '../dialogs/edit-expense/edit-expense.component';
import { Expense } from '../interfaces/expense';
import { Group } from '../interfaces/group';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  selectedGroup?:Group
  groupData?:Expense[]
  selectedSubmenu?:'add'|'calendar'|'list'

  constructor(
    private groupsAPI:GroupsApiService,
    private share:SharedService,
    public dialog: MatDialog,
  ) { 
    share.shareSelf('GroupService',this);
  }

  removeData(){
    this.selectedGroup = undefined
    this.groupData = undefined
    this.selectedSubmenu = undefined
  }

  selectSubmenu(sel:'add'|'calendar'|'list'){
    this.selectedSubmenu = sel;
  }

  selectGroup(group:Group){
    this.selectedGroup = group
    this.selectedSubmenu = 'add'
    this.refreshGroupData()
  }

  refreshGroupData(){
    return new Promise((resolve,reject)=>{
      this.groupsAPI.getGroup(this.selectedGroup!.name,this.selectedGroup!.id).subscribe((res)=>{
        this.groupData = res.data;
        this.groupsAPI.getGroupInfo(this.selectedGroup!.name,this.selectedGroup!.id).subscribe((res:any)=>{
          this.selectedGroup = res.data[0];
          resolve(true)
        },(error)=>{
          console.log(error);
        })
      },(error)=>{
        console.log(error);
      })
    })
  }

  deleteExpense(expense:Expense){
    console.log('delete',expense);
    const dialogRef = this.dialog.open(DeleteExpenseComponent, {
      panelClass:'delete-expense',
      width: '300px',
      data:{expense,group:this.selectedGroup}
    });

    return dialogRef.afterClosed()
  }

  editExpense(expense:Expense){
    console.log('edit',expense);
    const dialogRef = this.dialog.open(EditExpenseComponent, {
      panelClass:'edit-expense',
      width: '300px',
      data:{expense,group:this.selectedGroup}
    });

    return dialogRef.afterClosed()
  }
}
