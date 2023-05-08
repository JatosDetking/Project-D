import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Expense } from '../interfaces/expense';
import { Group } from '../interfaces/group';
import { AuthService } from '../services/auth.service';
import { databaseURL } from './env';

@Injectable({
  providedIn: 'root'
})
export class GroupsApiService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getCurrUserGroupsInfo() {
    return this.http.get(`${databaseURL}/groups/all-for-user`, {
      params: {
        username: "laino",
      }
    }).pipe(map((groups: any) => {
      let parsedGroups: any[] = []
      groups.forEach((group: any) => {
        let parsedGroup = {
          name: group.name,
          table_name: group.name + group.id,
          users: JSON.parse(group.users),
          id: group.id
        }
        parsedGroups.push(parsedGroup)
      })

      return parsedGroups
    }))
  }

  deleteExpenseFromGroup(exp_id: number, group: Group) {
    return this.http.post(`${databaseURL}/groups/delete-item`, {
      group_name: group.name,
      group_id: group.id,
      exp_id,
    })
  }

  editExpenseInGroup(exp_id: number, newExpense: Expense, group: Group) {
    return this.http.post(`${databaseURL}/groups/edit`, {
      group_name: group.name,
      group_id: group.id,
      exp_id,
      product_name: newExpense.product_name,
      place: newExpense.place,
      should_track: newExpense.should_track,
      tags: typeof newExpense.tags != 'string'?JSON.stringify(newExpense.tags):newExpense.tags,
      price: newExpense.price,
      date: newExpense.date
    })
  }

  createGroup(group_name: string) {
    let username = "this.authService.getUser()";
    return this.http.post(`${databaseURL}/groups/create`, {
      "username": username,
      "group_name": group_name
    })
  }

  getGroupInfo(group_name: string, group_id: number) {
    return this.http.get(`${databaseURL}/groups/get-group-info`, {
      params: {
        group_name, group_id
      }
    }).pipe(map((groupres: any) => {
      let parsedGroups: any[] = []
      groupres.data.forEach((group: any) => {
        let parsedGroup = {
          name: group.name,
          table_name: group.name + group.id,
          users: JSON.parse(group.users),
          id: group.id
        }
        parsedGroups.push(parsedGroup)
      })
      groupres.data = parsedGroups
      return groupres
    }))
  }

  deleteGroup(group_name: string, group_id: number) {
    return this.http.get(`${databaseURL}/groups/delete`, {
      params: {
        group_name, group_id
      }
    })
  }

  getGroup(group_name: string, group_id: number) {
    return this.http.get(`${databaseURL}/groups/get-group`, {
      params: {
        group_name, group_id
      }
    }).pipe(map((groupData: any) => {
      let items: any = [];
      groupData.data.forEach((item: any) => {
        let expense = { group_name, group_id, ...item }
        expense.tags = JSON.parse(expense.tags)
        items.push(expense)
      })
      groupData.data = items;
      return groupData
    }))
  }

  editGroupUsers(info: {
    group_name: string,
    group_id: number,
    action: 'add' | 'remove' | 'move' | 'make_root',
    username: string,
    location: 'guests' | 'admins'
  }) {
    return this.http.post(`${databaseURL}/groups/edit-group-users`, info, {})
  }

  addExpenseToGroup(expense: any) {
    if(typeof expense.tags != 'string'){
      expense.tags = JSON.stringify(expense.tags)
    }
    return this.http.post(`${databaseURL}/groups/add-item`, expense)
  }

  deleteItemFromGroup(group_name: string, exp_id: number, group_id: number) {
    return this.http.get(`${databaseURL}/groups/get-group`, {
      params: {
        group_name, exp_id, group_id
      }
    })
  }
}
