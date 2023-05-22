import { AfterViewInit, Component, ViewChild, OnInit, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SharedService } from 'src/app/services/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { Installation } from 'src/app/interfaces/installation';
import { Router } from '@angular/router';
import { SharedLogicService } from 'src/app/services/shared.logic.service';


@Component({
  selector: 'app-list-of-installations',
  templateUrl: './list-of-installations.component.html',
  styleUrls: ['./list-of-installations.component.scss']
})
export class ListOfInstallationsComponent implements OnInit {

  @Input() location?: string = '0';
  @Input() id?: number;

  displayedColumns: string[] = ['name', 'price', 'type'];
  listSize: number[] = [];

  dataSource: MatTableDataSource<Installation> = new MatTableDataSource<Installation>([]);

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
    if (this.location == 'isMyAccount') {

    } else if (this.location == 'isAccount') {

    } else {
      this.sharedService.InstallationService?.getAllInstalation().subscribe((res: any) => {
        const installationArray: Installation[] = [];
        for (const key in res) {
          const instalationData = res[key];
          const instalation: Installation = instalationData;
          installationArray.push(instalation);
        }
        this.dataSource.data = installationArray;
      });
      this.listSize = [10, 20, 50, 100, 1000];
    }
  }

  onRowClick(row: Installation) {
    this.router.navigate(['installation'], { queryParams: { installation: JSON.stringify(row) } });
  }
}
