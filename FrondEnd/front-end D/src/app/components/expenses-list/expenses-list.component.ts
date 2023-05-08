import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Expense } from 'src/app/interfaces/expense';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss']
})
export class ExpensesListComponent implements AfterViewInit {

  groupData:Expense[] =[]
  displayedColumns: string[] = window.innerWidth<500?['product_name', 'price','date',"buttons"]: ['id', 'product_name', 'place', 'price','tags','date',"buttons"];
  dataSource?: MatTableDataSource<Expense>;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(
    public groupService:GroupService,
    public authService:AuthService,
    private _liveAnnouncer: LiveAnnouncer
    ) { }
  currUserIsAdmin = false;

  ngAfterViewInit(): void {
    console.log(this.groupService.selectedGroup);
    this.currUserIsAdmin = true;
    this.groupData = this.groupService.groupData!;
    this.dataSource = new MatTableDataSource(this.groupData);
    this.dataSource.sort = this.sort;
  }

  deleteExpense(expense:Expense){
    this.groupService.deleteExpense(expense).subscribe((res)=>{
      this.groupService.refreshGroupData().then(()=>{
        this.ngAfterViewInit()
      })
    },(err)=>{

    });
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  editExpense(expense:Expense){
    this.groupService.editExpense(expense).subscribe((res)=>{
      this.groupService.refreshGroupData().then(()=>{
        this.ngAfterViewInit()
      })
    },(err)=>{

    });
  }
}
