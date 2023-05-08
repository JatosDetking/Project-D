import { isExpressionFactoryMetadata } from '@angular/compiler/src/render3/r3_factory';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Expense } from 'src/app/interfaces/expense';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/group.service';

export let getDateStr = (date: Date)=> {
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate()
  return `${day}-${month}-${year}`
}

@Component({
  selector: 'app-expenses-calendar',
  templateUrl: './expenses-calendar.component.html',
  styleUrls: ['./expenses-calendar.component.scss']
})
export class ExpensesCalendarComponent implements OnInit {

  groupData: Expense[] = []
  filteredExpenses: Expense[] = []
  dates: string[] = []
  range = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });
  displayedColumns: string[] = window.innerWidth<500?['product_name', 'price','date',"buttons"]: ['id', 'product_name', 'place', 'price','tags','date',"buttons"];
  currUserIsAdmin = false;

  constructor(
    public groupService: GroupService,
    public authService:AuthService
  ) { }
  
  getDateStr = getDateStr

  initData() {
    this.groupService.refreshGroupData().then(()=>{
      this.groupData = this.groupService.groupData!;
      console.log(this.groupService.selectedGroup);
      this.currUserIsAdmin = true;
      this.dates = []
      this.groupData.forEach((expense) => {
        let date = new Date(expense.date);
        let datestr = this.getDateStr(date)
        this.dates.push(datestr)
      })
      this.validDates()
    })
  }

  filterExpenses(){
    let start = this.range.controls.start.value;
    let startTime = start.getTime()
    let end = this.range.controls.end.value;
    let endTime = end.getTime()
    this.filteredExpenses = []
    this.groupData.forEach((expense)=>{
      let expTime = expense.date
      if(expTime>=startTime-1000*60*60*2&&expTime<=endTime+1000*60*60*23){
        this.filteredExpenses.push(expense)
      }
    })
    this.filteredExpensesDataSourse.data = this.filteredExpenses
  }
  @ViewChild(MatSort, {static: false})
  set sort(value: MatSort) {
    this.filteredExpensesDataSourse.sort = value;
  }
  filteredExpensesDataSourse = new MatTableDataSource(this.filteredExpenses)
  validDates(){
    if(
      this.range.controls.start.value&&
      this.range.controls.end.value
      ){
        this.filterExpenses()
    }
  }
  
  addDateValueChangeSub(){
    this.range.controls.start.valueChanges.subscribe(()=>{
      this.validDates();
    })
    this.range.controls.end.valueChanges.subscribe(()=>{
      this.validDates();
    })
  }

  ngOnInit(): void {
    this.initData()
    this.addDateValueChangeSub()
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      let dateStr = this.getDateStr(cellDate);
      return (this.dates.includes(dateStr))?'expense-date':'';
    }
    return '';
  };

  deleteExpense(expense:Expense){
    this.groupService.deleteExpense(expense).subscribe((res)=>{
      this.groupService.refreshGroupData().then(()=>{
        this.initData()
      })
    },(err)=>{

    });
  }

  editExpense(expense:Expense){
    this.groupService.editExpense(expense).subscribe((res)=>{
      this.groupService.refreshGroupData().then(()=>{
        this.initData()
      })
    },(err)=>{

    });
  }

}
