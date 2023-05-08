import { E } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GroupsApiService } from 'src/app/api/groups-api.service';
import { Expense } from 'src/app/interfaces/expense';
import { Group } from 'src/app/interfaces/group';
import { getDateStr } from '../expenses-calendar/expenses-calendar.component';

@Component({
  selector: 'app-calculations',
  templateUrl: './calculations.component.html',
  styleUrls: ['./calculations.component.scss']
})
export class CalculationsComponent implements OnInit {

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

  groupsTableData: {
    group_name: string,
    group_id: number,
    money: number,
    money_persentage: number,
    expenses_count: number,
    expenses_count_persentage: number,
    tags_in_group: string[],
    locations_in_group: string[],
    min_date: string,
    max_date: string,
  }[] = []
  locationsTableData: {
    location: string,
    count: number,
    count_persentage: number,
    money: number,
    money_persentage: number
  }[] = [{ location: 'no-data', count: 0, count_persentage: 0, money: 0, money_persentage: 0 }]
  tagsTableData: {
    tag: string,
    count: number,
    count_persentage: number,
    money: number,
    money_persentage: number
  }[] = [{ tag: 'no-data', count: 0, count_persentage: 0, money: 0, money_persentage: 0 }]
  displayedColumnsTags = window.innerWidth<500?['tag', 'count_persentage', 'money', ]:['tag', 'count', 'count_persentage', 'money', 'money_persentage'];
  displayedColumnsLocations = window.innerWidth<500?['location', 'count_persentage', 'money']:['location', 'count', 'count_persentage', 'money', 'money_persentage'];
  allExpenses: number = 0
  SumPrice: number = 0;

  @ViewChild('tagsSort')
  set tagsSort(value: MatSort) {
    this.tagsTableDataSource.sort = value;
  }
  @ViewChild('locationsSort')
  set locationsSort(value: MatSort) {
    this.locationsTableDataSource.sort = value;
  }
  locationsTableDataSource: MatTableDataSource<{
    location: string,
    count: number,
    count_persentage: number,
    money: number,
    money_persentage: number
  }> = new MatTableDataSource(this.locationsTableData);
  tagsTableDataSource: MatTableDataSource<{
    tag: string,
    count: number,
    count_persentage: number,
    money: number,
    money_persentage: number
  }> = new MatTableDataSource(this.tagsTableData);

  displayDataTables = false

  constructor(
    private groupAPI: GroupsApiService,
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

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      let dateStr = this.getDateStr(cellDate);
      return (this.expensesDates.includes(dateStr)) ? 'expense-date' : '';
    }
    return '';
  };

  selectLocation(location: string) {
    if (this.selectedLocations.includes(location)) {
      this.selectedLocations = this.selectedLocations.filter((selectedLocation) => selectedLocation != location);
    } else {
      this.selectedLocations.push(location)
    }
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

  noGroupSeleccted() {
    this.allTagsInData = []
    this.selectedTags = []

    this.fetchedGroupsData = []
    this.filteredByTags = []

    this.AllLocations = []
    this.selectedLocations = []
    this.filteredByLocations = []

    this.expensesDates = []

    this.range.controls.start.setValue(null)
    this.range.controls.end.setValue(null)
    this.filteredExpensesByDates = []

    this.groupsTableData = []
    this.locationsTableData = [{ location: 'no-data', count: 0, count_persentage: 0, money: 0, money_persentage: 0 }]
    this.tagsTableData = [{ tag: 'no-data', count: 0, count_persentage: 0, money: 0, money_persentage: 0 }]
    this.allExpenses = 0
    this.SumPrice = 0;

    this.locationsTableDataSource.data = this.locationsTableData
    this.tagsTableDataSource.data = this.tagsTableData
    this.displayDataTables = false
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

  calculate() {

    let allExpenses = 0;
    let SumPrice = 0;
    let groupExpCount: { [key: string]: number } = {}
    let groupExpPrice: { [key: string]: number } = {}
    let minMaxDatesInGroup: { [key: string]: { mindate: number, maxdate: number } } = {}
    let tagsAndLocationInGroups: { [key: string]: { tags: string[], locations: string[] } } = {}
    let tagsCount: { [key: string]: number } = {}
    let tagsPrices: { [key: string]: number } = {}
    let locationsCount: { [key: string]: number } = {}
    let locationsPrices: { [key: string]: number } = {}

    this.filteredExpensesByDates.forEach((expense) => {
      allExpenses++;
      SumPrice += expense.price;
      expense.tags.forEach((tag) => {
        if (tagsCount[tag]) {
          tagsCount[tag]++;
          tagsPrices[tag] += expense.price
        } else {
          tagsCount[tag] = 1;
          tagsPrices[tag] = expense.price;
        }
      })
      if (locationsCount[expense.place]) {
        locationsCount[expense.place]++;
        locationsPrices[expense.place] += expense.price;
      } else {
        locationsCount[expense.place] = 1;
        locationsPrices[expense.place] = expense.price;
      }
      let gname = expense.group_name + expense.group_id
      if (groupExpCount[gname]) {
        groupExpCount[gname]++;
        groupExpPrice[gname] += expense.price;
      } else {
        groupExpCount[gname] = 1;
        groupExpPrice[gname] = expense.price;
      }
      if (minMaxDatesInGroup[gname]) {
        if (minMaxDatesInGroup[gname].mindate > expense.date) {
          minMaxDatesInGroup[gname].mindate = expense.date
        }
        if (minMaxDatesInGroup[gname].maxdate < expense.date) {
          minMaxDatesInGroup[gname].maxdate = expense.date
        }
      } else {
        minMaxDatesInGroup[gname] = { mindate: expense.date, maxdate: expense.date }
      }
      if (tagsAndLocationInGroups[gname]) {
        expense.tags.forEach((tag) => {
          if (!tagsAndLocationInGroups[gname].tags.includes(tag)) {
            tagsAndLocationInGroups[gname].tags.push(tag)
          }
        })
        if (!tagsAndLocationInGroups[gname].locations.includes(expense.place)) {
          tagsAndLocationInGroups[gname].locations.push(expense.place)
        }
      } else {
        tagsAndLocationInGroups[gname] = { tags: [...expense.tags], locations: [expense.place] }
      }
    })
    let groupsData: {
      group_name: string,
      group_id: number,
      money: number,
      money_persentage: number,
      expenses_count: number,
      expenses_count_persentage: number,
      tags_in_group: string[],
      locations_in_group: string[],
      min_date: string,
      max_date: string,
    }[] = []
    let locationsData: {
      location: string,
      count: number,
      count_persentage: number,
      money: number,
      money_persentage: number
    }[] = []
    let tagsData: {
      tag: string,
      count: number,
      count_persentage: number,
      money: number,
      money_persentage: number
    }[] = []
    Object.keys(groupExpCount).forEach((group_name) => {
      let group = this.currUserGroupsInfo.find((group) => { return group.table_name == group_name });
      let money = groupExpPrice[group_name];
      let expenses_count = groupExpCount[group_name];
      let money_persentage = (money / SumPrice) * 100
      let expenses_count_persentage = (expenses_count / allExpenses) * 100
      let tags_in_group = tagsAndLocationInGroups[group_name].tags;
      let locations_in_group = tagsAndLocationInGroups[group_name].locations;
      let min_date = new Date(minMaxDatesInGroup[group_name].mindate).toDateString()
      let max_date = new Date(minMaxDatesInGroup[group_name].maxdate).toDateString()
      groupsData.push({
        group_name: group?.name!,
        group_id: group?.id!,
        expenses_count,
        money,
        money_persentage,
        expenses_count_persentage,
        tags_in_group,
        locations_in_group,
        min_date,
        max_date
      })
    })
    Object.keys(locationsCount).forEach((location) => {
      let count = locationsCount[location];
      let count_persentage = (count / allExpenses) * 100;
      let money = locationsPrices[location];
      let money_persentage = (money / SumPrice) * 100
      locationsData.push({
        location,
        count,
        count_persentage,
        money,
        money_persentage
      })
    })
    Object.keys(tagsCount).forEach((tag) => {
      let count = tagsCount[tag];
      let count_persentage = (count / allExpenses) * 100;
      let money = tagsPrices[tag];
      let money_persentage = (money / SumPrice) * 100
      tagsData.push({
        tag,
        count,
        count_persentage,
        money,
        money_persentage
      })
    })
    this.groupsTableData = groupsData;
    this.tagsTableData = tagsData;
    this.locationsTableData = locationsData;
    this.allExpenses = allExpenses;
    this.SumPrice = SumPrice
    this.displayTables()
  }

  displayTables() {
    this.tagsTableDataSource.data = this.tagsTableData;
    this.locationsTableDataSource.data = this.locationsTableData;
    this.displayDataTables = true;
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
    this.calculate()
  }

  validDates() {
    if (
      this.range.controls.start.value &&
      this.range.controls.end.value
    ) {
      this.filterExpensesByDates()
    }
  }

  addDateValueChangeSub() {
    this.range.controls.start.valueChanges.subscribe(() => {
      this.validDates();
    })
    this.range.controls.end.valueChanges.subscribe(() => {
      this.validDates();
    })
  }

  ngOnInit(): void {
    this.groupAPI.getCurrUserGroupsInfo().subscribe((res) => {
      this.currUserGroupsInfo = res;
    }, (err) => {
      console.error(err)
    })
    this.addDateValueChangeSub()
    this.tagsTableDataSource.sort = this.tagsSort;
    this.locationsTableDataSource.sort = this.locationsSort;

  }

}
