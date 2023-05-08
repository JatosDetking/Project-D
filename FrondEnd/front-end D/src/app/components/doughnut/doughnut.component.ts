import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { GroupsApiService } from 'src/app/api/groups-api.service';
import { Expense } from 'src/app/interfaces/expense';
import { Group } from 'src/app/interfaces/group';
import { ChartService } from 'src/app/services/chart.service';
import { getDateStr } from '../expenses-calendar/expenses-calendar.component';

@Component({
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html',
  styleUrls: ['./doughnut.component.scss']
})
export class DoughnutComponent implements OnInit {
  
  currUserGroupsInfo: Group[] = []
  selectedGroups:string[] = []

  fetchedGroupsData: Expense[] = []

  expensesDates: string[] = []
  range = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });
  
  filteredExpensesByDates: Expense[] = []

  display = new FormControl('Types')
  calculate = new FormControl('Price')
  /* display : 'Types'|'Locations' = 'Types';
  calculate : 'Price'|'Amount' = 'Price'; */

  constructor(
    private groupAPI: GroupsApiService,
    private chart: ChartService,

  ) { }

  addDateValueChangeSub() {
    this.range.controls.start.valueChanges.subscribe(() => {
      this.validDates();
    })
    this.range.controls.end.valueChanges.subscribe(() => {
      this.validDates();
    })
    this.display.valueChanges.subscribe(()=>{
      this.validDates()
    })
    this.calculate.valueChanges.subscribe(()=>{
      this.validDates()
    })
  }

  ngOnInit(): void {
    this.groupAPI.getCurrUserGroupsInfo().subscribe((res) => {
      this.currUserGroupsInfo = res;
    }, (err) => {
      console.error(err)
    })
    this.addDateValueChangeSub()
  }

  selectedGroup(group: Group) {
    let groupTableName = group.table_name
    return this.selectedGroups.includes(groupTableName)
  }

  selectGroup(group: Group) {
    let groupTableName = group.table_name
    if (this.selectedGroups.includes(groupTableName)) {
      this.selectedGroups = this.selectedGroups.filter((group) => group != groupTableName);
    } else {
      this.selectedGroups.push(groupTableName)
    }
    this.getGroupsData()
  }

  getGroupsData() {
    /* let oldSelectedTags = this.selectedTags;
    this.selectedTags = []; */
    let selectedGroups: Group[] = []
    this.selectedGroups.forEach((selectedGroup) => {
      this.currUserGroupsInfo.forEach((infoGroup) => {
        if (selectedGroup == infoGroup.table_name) {
          selectedGroups.push(infoGroup);
        }
      })
    })
    let fetchedData = 0;
    this.fetchedGroupsData = []
    if (selectedGroups.length == 0) {
      this.noGroupSeleccted()
    }
    selectedGroups.forEach((group) => {
      this.groupAPI.getGroup(group.name, group.id).subscribe((groupData) => {
        fetchedData++;
        this.fetchedGroupsData.push(...groupData.data)
        if (fetchedData == selectedGroups.length) {
          this.groupsDataFetched()
        }
      }, (err) => {
        console.error(err)
      })
    })
  }

  noGroupSeleccted(){
    this.fetchedGroupsData = []

    this.expensesDates = []
    this.range.controls.start.setValue(null)
    this.range.controls.end.setValue(null)
  
    this.filteredExpensesByDates = []
  }

  getDateStr = getDateStr

  calcAllDatesAndDisplayAll() {
    let data = this.fetchedGroupsData
    this.expensesDates = []
    let minDate: number
    let maxDate: number
    data.forEach((expense) => {
      if (!minDate || minDate > expense.date) {
        minDate = expense.date
      }
      if (!maxDate || maxDate < expense.date) {
        maxDate = expense.date
      }
      let date = new Date(expense.date);
      let datestr = this.getDateStr(date)
      this.expensesDates.push(datestr)
    })
    this.range.controls.start.setValue(new Date(minDate! - 1000 * 60 * 60 * 3))
    this.range.controls.end.setValue(new Date(maxDate! + 1000 * 60 * 60 * 10))
    this.validDates()
  }

  validDates() {
    if (
      this.range.controls.start.value &&
      this.range.controls.end.value
    ) {
      this.filterExpensesByDates()
    }
  }

  filterExpensesByDates() {
    let start = this.range.controls.start.value;
    let startTime = start.getTime()
    let end = this.range.controls.end.value;
    let endTime = end.getTime()
    this.filteredExpensesByDates = []
    this.fetchedGroupsData.forEach((expense) => {
      let expTime = expense.date
      if (expTime >= startTime - 1000 * 60 * 60 * 2 && expTime <= endTime + 1000 * 60 * 60 * 23) {
        this.filteredExpensesByDates.push(expense)
      }
    })
    this.fillChart()
  }

  fillChart() {
    let canvasContainer = document.getElementById('single-chart') as HTMLDivElement;
    canvasContainer.childNodes.forEach((child) => {
      canvasContainer.removeChild(child)
    })
    let newCanvasElement = document.createElement('canvas');
    canvasContainer.appendChild(newCanvasElement);
    let ctx = newCanvasElement.getContext('2d');
    let data: {
      "group_name": string,
      "group_id": number,
      "product_name": string,
      "place": string,
      "should_track": boolean,
      "tags": string[],
      "price": number,
      "date": number,
      "date-txt-place"?: string,
      "id"?: number
    }[] = this.filteredExpensesByDates;
    
    let tagsCount:{[key:string]:number} = {}
    let locationsCount:{[key:string]:number} = {}

    let tagsPrice:{[key:string]:number} = {}
    let locationsPrice:{[key:string]:number} = {}

    data.forEach((expense)=>{
      let tags = expense.tags;
      let price = expense.price
      tags.forEach((tag)=>{
        if(tagsCount[tag]){
          tagsCount[tag]++
        }else{
          tagsCount[tag] = 1
        }
        if(tagsPrice[tag]){
          tagsPrice[tag]+=price
        }else{
          tagsPrice[tag] = price
        }
      })
      let location = expense.place;
      if(locationsCount[location]){
        locationsCount[location]++
      }else{
        locationsCount[location] = 1
      }
      if(locationsPrice[location]){
        locationsPrice[location]+=price
      }else{
        locationsPrice[location] = price
      }
    })
    
    let displayBy = this.display.value;
    let calculateBy = this.calculate.value;

    let labels:any
    let values:any
    if(displayBy == 'Types'){
      labels = Object.keys(tagsCount);
      if(calculateBy == 'Price'){
        values = Object.values(tagsPrice)
      }else if(calculateBy == 'Amount'){
        values = Object.values(tagsCount)
      }
    }else if(displayBy == 'Locations'){
      labels = Object.keys(locationsCount);
      if(calculateBy == 'Price'){
        values = Object.values(locationsPrice)
      }else if(calculateBy == 'Amount'){
        values = Object.values(locationsCount)
      }
    }
    this.chart.getNewChart(ctx!, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          fill: 'start',
          label: 'Price',
          //@ts-ignore
          data:values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        
      }
    })
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      let dateStr = this.getDateStr(cellDate);
      return (this.expensesDates.includes(dateStr)) ? 'expense-date' : '';
    }
    return '';
  };

  groupsDataFetched(){
    this.calcAllDatesAndDisplayAll()
  }

}
