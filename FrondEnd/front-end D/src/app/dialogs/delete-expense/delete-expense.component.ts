import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupsApiService } from 'src/app/api/groups-api.service';
import { Expense } from 'src/app/interfaces/expense';
import { Group } from 'src/app/interfaces/group';

@Component({
  selector: 'app-delete-expense',
  templateUrl: './delete-expense.component.html',
  styleUrls: ['./delete-expense.component.scss']
})
export class DeleteExpenseComponent {
  spinner = false;

  constructor(
    public dialogRef: MatDialogRef<DeleteExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {expense:Expense,group:Group},
    public groupsAPI:GroupsApiService,
  ) { }

  deleteGroup(){
    this.spinner = true;
    this.groupsAPI.deleteExpenseFromGroup(this.data.expense.id!,this.data.group).subscribe((res)=>{
      this.spinner = false;
      console.log(res);
      this.dialogRef.close(true)
    },(err)=>{
      this.spinner = false;
      console.log(err);
    })
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
