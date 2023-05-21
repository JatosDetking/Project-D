import { AfterViewInit, Component, ViewChild, OnInit, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SharedLogicService } from 'src/app/services/shared.logic.service';
import { SharedService } from 'src/app/services/shared.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-list-of-users',
  templateUrl: './list-of-users.component.html',
  styleUrls: ['./list-of-users.component.scss']
})
export class ListOfUsersComponent implements OnInit {

  displayedColumns: string[] = ['username', 'email','name'];
  listSize: number[] = [];

  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    private sharedService: SharedService,
    private router: Router,
    private sharedLogicService: SharedLogicService
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.fillList();
  }

  fillList() {

    this.sharedService.UserService?.getAllUsers().subscribe((res: any) => {
      const terrainArray: User[] = [];
      for (const key in res) {
        const userData = res[key];
        const user: User = userData;
        terrainArray.push(user);
      }
      this.dataSource.data = terrainArray;
      this.listSize = [10, 25, 50, 100];
    });
  }
  onRowClick(row: User) {
    this.sharedLogicService?.goToAccount(row);
  }
}



