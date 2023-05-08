import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY } from '@angular/material/dialog';
import { GroupsApiService } from 'src/app/api/groups-api.service';
import { Expense } from 'src/app/interfaces/expense';
import { Group } from 'src/app/interfaces/group';
import { ChartService } from 'src/app/services/chart.service';
import { getDateStr } from '../expenses-calendar/expenses-calendar.component';

@Component({
  selector: 'app-single-chart',
  templateUrl: './single-chart.component.html',
  styleUrls: ['./single-chart.component.scss']
})

export class SingleChartComponent implements OnInit {

  currUserGroupsInfo: Group[] = []
  selectedGroups: string[] = []

  allTagsInData: string[] = []
  selectedTags: string[] = []

  fetchedGroupsData: Expense[] = []
  filteredByTags: Expense[] = []

  AllLocations: string[] = []
  selectedLocations: string[] = []
  filteredByLocations: Expense[] = []

  expensesDates: string[] = []
  range = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });
  filteredExpensesByDates: Expense[] = []

  constructor(
    private groupAPI: GroupsApiService,
    private chart: ChartService,
  ) { }

  tagsListVisible = true;
  hideShowTagsList() {
    this.tagsListVisible = !this.tagsListVisible
  }

  locationsListVisible = true;
  hideShowLocationsList() {
    this.locationsListVisible = !this.locationsListVisible
  }

  selectAllTags() {
    this.selectedTags = [...this.allTagsInData];
    this.filterDataByTags();
  }

  deselectAllTags() {
    this.selectedTags = [];
    this.filterDataByTags();
  }

  selectAllLocations() {
    this.selectedLocations = [...this.AllLocations];
    this.filterDataByLocations();
  }

  deselectAllLocations() {
    this.selectedLocations = []
    this.filterDataByLocations();
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

  selectedTag(tag: string) {
    return this.selectedTags.includes(tag)
  }

  selectTag(tag: string) {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter((selectedTag) => selectedTag != tag);
    } else {
      this.selectedTags.push(tag)
    }
    this.filterDataByTags();
  }

  selectedLocation(location: string) {
    return this.selectedLocations.includes(location)
  }

  selectLocation(location: string) {
    if (this.selectedLocations.includes(location)) {
      this.selectedLocations = this.selectedLocations.filter((selectedLocation) => selectedLocation != location);
    } else {
      this.selectedLocations.push(location)
    }
    this.filterDataByLocations();
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
    data.forEach((expense) => {
      let datetxt = this.getDateStr(new Date(expense.date));
      expense['date-txt-place'] = datetxt + " " + expense.place
    })

    data = data.sort((a, b) => {
      return a.date - b.date
    })

    let prices: number[] = []
    let dates: number[] = []
    let labels: string[] = []
    data.forEach((expense) => {
      prices.push(expense.price);
      dates.push(expense.date)
      labels.push(expense['date-txt-place']!);
    })
    this.chart.getNewChart(ctx!, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          fill: 'start',
          label: 'Price',
          //@ts-ignore
          data,
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
        parsing: {
          xAxisKey: 'date-txt-place',
          yAxisKey: 'price'
        },
        scales: {
          y: {
            beginAtZero: true
          },
          x: {
            ticks: {
              maxRotation: 90,
              minRotation: 90
            }
          }
        },
        /* elements: {
          line: {
            tension: 0.4
          }
        } */
      }
    })
  }

  filterExpensesByDates() {
    let start = this.range.controls.start.value;
    let startTime = start.getTime()
    let end = this.range.controls.end.value;
    let endTime = end.getTime()
    this.filteredExpensesByDates = []
    this.filteredByLocations.forEach((expense) => {
      let expTime = expense.date
      if (expTime >= startTime - 1000 * 60 * 60 * 2 && expTime <= endTime + 1000 * 60 * 60 * 23) {
        this.filteredExpensesByDates.push(expense)
      }
    })
    this.fillChart()
  }

  addDateValueChangeSub() {
    this.range.controls.start.valueChanges.subscribe(() => {
      this.validDates();
    })
    this.range.controls.end.valueChanges.subscribe(() => {
      this.validDates();
    })
  }

  validDates() {
    if (
      this.range.controls.start.value &&
      this.range.controls.end.value
    ) {
      this.filterExpensesByDates()
    }
  }

  calcAllDatesAndDisplayAll() {
    let filteredByLocations = this.filteredByLocations
    this.expensesDates = []
    let minDate: number
    let maxDate: number
    filteredByLocations.forEach((expense) => {
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

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      let dateStr = this.getDateStr(cellDate);
      return (this.expensesDates.includes(dateStr)) ? 'expense-date' : '';
    }
    return '';
  };

  filterDataByTags() {
    let filteredByTags: Expense[] = []
    this.filteredByTags = []
    this.fetchedGroupsData.forEach((expense) => {
      let shouldDisplay = false
      expense.tags.forEach((extag) => {
        if (this.selectedTags.includes(extag)) {
          shouldDisplay = true
        }
      })
      if (shouldDisplay) {
        filteredByTags.push(expense)
      }
    })
    this.filteredByTags = filteredByTags
    this.displayLocations()
  }

  filterDataByLocations() {
    let filteredByTags = this.filteredByTags;
    let filteredByLocations: Expense[] = [];
    filteredByTags.forEach((expense) => {
      if (this.selectedLocations.includes(expense.place)) {
        filteredByLocations.push(expense)
      }
    })

    this.filteredByLocations = filteredByLocations
    this.calcAllDatesAndDisplayAll()
  }

  displayLocations() {
    let groupsData = this.filteredByTags
    this.AllLocations = []
    let allLocationsInData: string[] = []
    groupsData.forEach(expense => {
      if (!allLocationsInData.includes(expense.place)) {
        allLocationsInData.push(expense.place)
      }
    })
    this.AllLocations = allLocationsInData;
    this.selectedLocations = [...allLocationsInData];
    if (this.AllLocations.length > 0) {
      this.filterDataByLocations()
    }
  }

  displayTags() {
    let groupsData = this.fetchedGroupsData
    this.allTagsInData = []
    let allTagsInData: string[] = []
    groupsData.forEach(expense => {
      let expenseTags = expense.tags;
      expenseTags.forEach((tag: string) => {
        if (!allTagsInData.includes(tag)) {
          allTagsInData.push(tag)
        }
      })
    })
    this.allTagsInData = allTagsInData;
    this.selectedTags = [...allTagsInData];
    if (this.allTagsInData.length > 0) {
      this.filterDataByTags()
    }
  }

  getDateStr = getDateStr

  groupsDataFetched() {
    this.displayTags()
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
      this.noGroupSelected()
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

  noGroupSelected() {
    this.allTagsInData = []
    this.selectedTags = []

    this.fetchedGroupsData = []
    this.filteredByTags = []

    this.AllLocations = []
    this.selectedLocations = []
    this.filteredByLocations = []

    this.expensesDates = []
    this.range.controls.start.setValue(null);
    this.range.controls.end.setValue(null);
    this.filteredExpensesByDates = []
  }

  ngOnInit(): void {
    this.groupAPI.getCurrUserGroupsInfo().subscribe((res) => {
      this.currUserGroupsInfo = res;
    }, (err) => {
      console.error(err)
    })
    this.addDateValueChangeSub()
  }

}
