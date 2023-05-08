import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { GroupsApiService } from 'src/app/api/groups-api.service';
import { Expense } from 'src/app/interfaces/expense';
import { Group } from 'src/app/interfaces/group';
import { ChartService } from 'src/app/services/chart.service';
import { getDateStr } from '../expenses-calendar/expenses-calendar.component';

@Component({
  selector: 'app-compare-charts',
  templateUrl: './compare-charts.component.html',
  styleUrls: ['./compare-charts.component.scss']
})
export class CompareChartsComponent implements OnInit {

  currUserGroupsInfo: Group[] = []
  selectedGroupsChart1: string[] = []
  selectedGroupsChart2: string[] = []

  fetchedGroupsDataChart1: Expense[] = []
  fetchedGroupsDataChart2: Expense[] = []

  allTagsInDataChart1: string[] = []
  selectedTagsChart1: string[] = []
  allTagsInDataChart2: string[] = []
  selectedTagsChart2: string[] = []

  filteredByTagsChart1: Expense[] = []
  filteredByTagsChart2: Expense[] = []

  AllLocationsChart1: string[] = []
  selectedLocationsChart1: string[] = []
  AllLocationsChart2: string[] = []
  selectedLocationsChart2: string[] = []

  filteredByLocationsChart1: Expense[] = []
  filteredByLocationsChart2: Expense[] = []

  rangeChart1 = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });
  rangeChart2 = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });

  expensesDatesChart1: string[] = []
  expensesDatesChart2: string[] = []

  filteredExpensesByDatesChart1: Expense[] = []
  filteredExpensesByDatesChart2: Expense[] = []

  tagsListVisibleChart1 = true;
  tagsListVisibleChart2 = true;

  locationsListVisibleChart1 = true;
  locationsListVisibleChart2 = true;
  constructor(
    private groupAPI: GroupsApiService,
    private chart: ChartService,
  ) { }

  addDateValueChangeSub() {
    this.rangeChart1.controls.start.valueChanges.subscribe(() => {
      this.validDatesChart1();
    })
    this.rangeChart1.controls.end.valueChanges.subscribe(() => {
      this.validDatesChart1();
    })
    this.rangeChart2.controls.start.valueChanges.subscribe(() => {
      this.validDatesChart2();
    })
    this.rangeChart2.controls.end.valueChanges.subscribe(() => {
      this.validDatesChart2();
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

  selectedTagChart1(tag: string) {
    return this.selectedTagsChart1.includes(tag)
  }

  selectTagChart1(tag: string) {
    if (this.selectedTagsChart1.includes(tag)) {
      this.selectedTagsChart1 = this.selectedTagsChart1.filter((selectedTag) => selectedTag != tag);
    } else {
      this.selectedTagsChart1.push(tag)
    }
    this.filterDataByTagsChart1();
  }

  deselectAllTagsChart1() {
    this.selectedTagsChart1 = [];
    this.filterDataByTagsChart1();
  }

  selectAllTagsChart1() {
    this.selectedTagsChart1 = [...this.allTagsInDataChart1];
    this.filterDataByTagsChart1();
  }

  hideShowTagsListChart1() {
    this.tagsListVisibleChart1 = !this.tagsListVisibleChart1
  }

  selectedTagChart2(tag: string) {
    return this.selectedTagsChart2.includes(tag)
  }

  selectTagChart2(tag: string) {
    if (this.selectedTagsChart2.includes(tag)) {
      this.selectedTagsChart2 = this.selectedTagsChart2.filter((selectedTag) => selectedTag != tag);
    } else {
      this.selectedTagsChart2.push(tag)
    }
    this.filterDataByTagsChart2();
  }

  deselectAllTagsChart2() {
    this.selectedTagsChart2 = [];
    this.filterDataByTagsChart2();
  }

  selectAllTagsChart2() {
    this.selectedTagsChart2 = [...this.allTagsInDataChart2];
    this.filterDataByTagsChart2();
  }

  hideShowTagsListChart2() {
    this.tagsListVisibleChart2 = !this.tagsListVisibleChart2
  }

  selectedLocationChart1(location: string) {
    return this.selectedLocationsChart1.includes(location)
  }

  selectLocationChart1(location: string) {
    if (this.selectedLocationsChart1.includes(location)) {
      this.selectedLocationsChart1 = this.selectedLocationsChart1.filter((selectedLocation) => selectedLocation != location);
    } else {
      this.selectedLocationsChart1.push(location)
    }
    this.filterDataByLocationsChart1();
  }

  selectedLocationChart2(location: string) {
    return this.selectedLocationsChart2.includes(location)
  }

  selectLocationChart2(location: string) {
    if (this.selectedLocationsChart2.includes(location)) {
      this.selectedLocationsChart2 = this.selectedLocationsChart2.filter((selectedLocation) => selectedLocation != location);
    } else {
      this.selectedLocationsChart2.push(location)
    }
    this.filterDataByLocationsChart2();
  }

  deselectAllLocationsChart1() {
    this.selectedLocationsChart1 = []
    this.filterDataByLocationsChart1();
  }

  deselectAllLocationsChart2() {
    this.selectedLocationsChart2 = []
    this.filterDataByLocationsChart2();
  }

  selectAllLocationsChart1() {
    this.selectedLocationsChart1 = [...this.AllLocationsChart1];
    this.filterDataByLocationsChart1();
  }

  selectAllLocationsChart2() {
    this.selectedLocationsChart2 = [...this.AllLocationsChart2];
    this.filterDataByLocationsChart2();
  }

  hideShowLocationsListChart1() {
    this.locationsListVisibleChart1 = !this.locationsListVisibleChart1
  }

  hideShowLocationsListChart2() {
    this.locationsListVisibleChart2 = !this.locationsListVisibleChart2
  }

  selectChart1Group(group: Group) {
    if (!this.selectedGroupsChart1.includes(group.table_name)) {
      this.selectedGroupsChart1.push(group.table_name);
    } else {
      this.selectedGroupsChart1 = this.selectedGroupsChart1.filter(name => name != group.table_name)
    }
    this.getGroupsDataChart1()
  }

  selectedChart1Group(group: Group) {
    return this.selectedGroupsChart1.includes(group.table_name);
  }

  selectChart2Group(group: Group) {
    if (!this.selectedGroupsChart2.includes(group.table_name)) {
      this.selectedGroupsChart2.push(group.table_name);
    } else {
      this.selectedGroupsChart2 = this.selectedGroupsChart2.filter(name => name != group.table_name)
    }
    this.getGroupsDataChart2()
  }

  selectedChart2Group(group: Group) {
    return this.selectedGroupsChart2.includes(group.table_name);
  }

  getGroupsDataChart1() {
    let selectedGroups: Group[] = []
    this.selectedGroupsChart1.forEach((selectedGroup) => {
      this.currUserGroupsInfo.forEach((infoGroup) => {
        if (selectedGroup == infoGroup.table_name) {
          selectedGroups.push(infoGroup);
        }
      })
    })
    let fetchedData = 0;
    this.fetchedGroupsDataChart1 = []
    if (selectedGroups.length == 0) {
      this.noGroupsSelectedChart1()
    }
    selectedGroups.forEach((group) => {
      this.groupAPI.getGroup(group.name, group.id).subscribe((groupData) => {
        fetchedData++;
        this.fetchedGroupsDataChart1.push(...groupData.data)
        if (fetchedData == selectedGroups.length) {
          this.groupsDataFetchedChart1()
        }
      }, (err) => {
        console.error(err)
      })
    })
  }

  noGroupsSelectedChart1() {
    this.fetchedGroupsDataChart1 = []

    this.allTagsInDataChart1 = []
    this.selectedTagsChart1 = []

    this.filteredByTagsChart1 = []

    this.AllLocationsChart1 = []
    this.selectedLocationsChart1 = []

    this.filteredByLocationsChart1 = []

    this.rangeChart1.controls.start.setValue(null)
    this.rangeChart1.controls.end.setValue(null)

    this.expensesDatesChart1 = []

    this.filteredExpensesByDatesChart1 = []

    this.tagsListVisibleChart1 = true;

    this.locationsListVisibleChart1 = true;
  }

  getGroupsDataChart2() {
    let selectedGroups: Group[] = []
    this.selectedGroupsChart2.forEach((selectedGroup) => {
      this.currUserGroupsInfo.forEach((infoGroup) => {
        if (selectedGroup == infoGroup.table_name) {
          selectedGroups.push(infoGroup);
        }
      })
    })
    let fetchedData = 0;
    this.fetchedGroupsDataChart2 = []
    if (selectedGroups.length == 0) {
      this.noGroupsSelectedChart2()
    }
    selectedGroups.forEach((group) => {
      this.groupAPI.getGroup(group.name, group.id).subscribe((groupData) => {
        fetchedData++;
        this.fetchedGroupsDataChart2.push(...groupData.data)
        if (fetchedData == selectedGroups.length) {
          this.groupsDataFetchedChart2()
        }
      }, (err) => {
        console.error(err)
      })
    })
  }

  noGroupsSelectedChart2() {
    this.fetchedGroupsDataChart2 = []

    this.allTagsInDataChart2 = []
    this.selectedTagsChart2 = []

    this.filteredByTagsChart2 = []

    this.AllLocationsChart2 = []
    this.selectedLocationsChart2 = []

    this.filteredByLocationsChart2 = []

    this.rangeChart2.controls.start.setValue(null)
    this.rangeChart2.controls.end.setValue(null)

    this.expensesDatesChart2 = []

    this.filteredExpensesByDatesChart2 = []

    this.tagsListVisibleChart2 = true;

    this.locationsListVisibleChart2 = true;
  }

  groupsDataFetchedChart1() {
    this.displayTagsChart1()
  }

  groupsDataFetchedChart2() {
    this.displayTagsChart2()
  }

  displayTagsChart1() {
    let groupsData = this.fetchedGroupsDataChart1
    this.allTagsInDataChart1 = []
    let allTagsInData: string[] = []
    groupsData.forEach(expense => {
      let expenseTags = expense.tags;
      expenseTags.forEach((tag: string) => {
        if (!allTagsInData.includes(tag)) {
          allTagsInData.push(tag)
        }
      })
    })
    this.allTagsInDataChart1 = allTagsInData;
    this.selectedTagsChart1 = [...allTagsInData];
    if (this.allTagsInDataChart1.length > 0) {
      this.filterDataByTagsChart1()
    }
  }

  displayTagsChart2() {
    let groupsData = this.fetchedGroupsDataChart2
    this.allTagsInDataChart2 = []
    let allTagsInData: string[] = []
    groupsData.forEach(expense => {
      let expenseTags = expense.tags;
      expenseTags.forEach((tag: string) => {
        if (!allTagsInData.includes(tag)) {
          allTagsInData.push(tag)
        }
      })
    })
    this.allTagsInDataChart2 = allTagsInData;
    this.selectedTagsChart2 = [...allTagsInData];
    if (this.allTagsInDataChart2.length > 0) {
      this.filterDataByTagsChart2()
    }
  }

  filterDataByTagsChart1() {
    let filteredByTags: Expense[] = []
    this.filteredByTagsChart1 = []
    this.fetchedGroupsDataChart1.forEach((expense) => {
      let shouldDisplay = false
      expense.tags.forEach((extag) => {
        if (this.selectedTagsChart1.includes(extag)) {
          shouldDisplay = true
        }
      })
      if (shouldDisplay) {
        filteredByTags.push(expense)
      }
    })
    this.filteredByTagsChart1 = filteredByTags
    this.displayLocationsChart1()
  }

  filterDataByTagsChart2() {
    let filteredByTags: Expense[] = []
    this.filteredByTagsChart2 = []
    this.fetchedGroupsDataChart2.forEach((expense) => {
      let shouldDisplay = false
      expense.tags.forEach((extag) => {
        if (this.selectedTagsChart2.includes(extag)) {
          shouldDisplay = true
        }
      })
      if (shouldDisplay) {
        filteredByTags.push(expense)
      }
    })
    this.filteredByTagsChart2 = filteredByTags
    this.displayLocationsChart2()
  }

  displayLocationsChart1() {
    let groupsData = this.filteredByTagsChart1
    this.AllLocationsChart1 = []
    let allLocationsInData: string[] = []
    groupsData.forEach(expense => {
      if (!allLocationsInData.includes(expense.place)) {
        allLocationsInData.push(expense.place)
      }
    })
    this.AllLocationsChart1 = allLocationsInData;
    this.selectedLocationsChart1 = [...allLocationsInData];
    if (this.AllLocationsChart1.length > 0) {
      this.filterDataByLocationsChart1()
    }
  }

  displayLocationsChart2() {
    let groupsData = this.filteredByTagsChart2
    this.AllLocationsChart2 = []
    let allLocationsInData: string[] = []
    groupsData.forEach(expense => {
      if (!allLocationsInData.includes(expense.place)) {
        allLocationsInData.push(expense.place)
      }
    })
    this.AllLocationsChart2 = allLocationsInData;
    this.selectedLocationsChart2 = [...allLocationsInData];
    if (this.AllLocationsChart2.length > 0) {
      this.filterDataByLocationsChart2()
    }
  }

  filterDataByLocationsChart1() {
    let filteredByTags = this.filteredByTagsChart1;
    let filteredByLocations: Expense[] = [];
    filteredByTags.forEach((expense) => {
      if (this.selectedLocationsChart1.includes(expense.place)) {
        filteredByLocations.push(expense)
      }
    })

    this.filteredByLocationsChart1 = filteredByLocations
    this.calcAllDatesAndDisplayAllChart1()
  }

  filterDataByLocationsChart2() {
    let filteredByTags = this.filteredByTagsChart2;
    let filteredByLocations: Expense[] = [];
    filteredByTags.forEach((expense) => {
      if (this.selectedLocationsChart2.includes(expense.place)) {
        filteredByLocations.push(expense)
      }
    })

    this.filteredByLocationsChart2 = filteredByLocations
    this.calcAllDatesAndDisplayAllChart2()
  }

  getDateStr = getDateStr

  calcAllDatesAndDisplayAllChart1() {
    let filteredByLocations = this.filteredByLocationsChart1
    this.expensesDatesChart1 = []
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
      this.expensesDatesChart1.push(datestr)
    })
    this.rangeChart1.controls.start.setValue(new Date(minDate! - 1000 * 60 * 60 * 3))
    this.rangeChart1.controls.end.setValue(new Date(maxDate! + 1000 * 60 * 60 * 10))
    this.validDatesChart1()
  }

  calcAllDatesAndDisplayAllChart2() {
    let filteredByLocations = this.filteredByLocationsChart2
    this.expensesDatesChart2 = []
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
      this.expensesDatesChart2.push(datestr)
    })
    this.rangeChart2.controls.start.setValue(new Date(minDate! - 1000 * 60 * 60 * 3))
    this.rangeChart2.controls.end.setValue(new Date(maxDate! + 1000 * 60 * 60 * 10))
    this.validDatesChart2()
  }

  validDatesChart1() {
    if (
      this.rangeChart1.controls.start.value &&
      this.rangeChart1.controls.end.value
    ) {
      this.filterExpensesByDatesChart1()
    }
  }

  validDatesChart2() {
    if (
      this.rangeChart2.controls.start.value &&
      this.rangeChart2.controls.end.value
    ) {
      this.filterExpensesByDatesChart2()
    }
  }

  filterExpensesByDatesChart1() {
    let start = this.rangeChart1.controls.start.value;
    let startTime = start.getTime()
    let end = this.rangeChart1.controls.end.value;
    let endTime = end.getTime()
    this.filteredExpensesByDatesChart1 = []
    this.filteredByLocationsChart1.forEach((expense) => {
      let expTime = expense.date
      if (expTime >= startTime - 1000 * 60 * 60 * 2 && expTime <= endTime + 1000 * 60 * 60 * 23) {
        this.filteredExpensesByDatesChart1.push(expense)
      }
    })
    this.fillChartChart1()
  }

  filterExpensesByDatesChart2() {
    let start = this.rangeChart2.controls.start.value;
    let startTime = start.getTime()
    let end = this.rangeChart2.controls.end.value;
    let endTime = end.getTime()
    this.filteredExpensesByDatesChart2 = []
    this.filteredByLocationsChart2.forEach((expense) => {
      let expTime = expense.date
      if (expTime >= startTime - 1000 * 60 * 60 * 2 && expTime <= endTime + 1000 * 60 * 60 * 23) {
        this.filteredExpensesByDatesChart2.push(expense)
      }
    })
    this.fillChartChart2()
  }

  fillChartChart1() {
    let canvasContainer = document.getElementById('chart1') as HTMLDivElement;
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
    }[] = this.filteredExpensesByDatesChart1;
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

  fillChartChart2() {
    let canvasContainer = document.getElementById('chart2') as HTMLDivElement;
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
    }[] = this.filteredExpensesByDatesChart2;
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

  dateClassChart1: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      let dateStr = this.getDateStr(cellDate);
      return (this.expensesDatesChart1.includes(dateStr)) ? 'expense-date' : '';
    }
    return '';
  };

  dateClassChart2: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      let dateStr = this.getDateStr(cellDate);
      return (this.expensesDatesChart2.includes(dateStr)) ? 'expense-date' : '';
    }
    return '';
  };
}
