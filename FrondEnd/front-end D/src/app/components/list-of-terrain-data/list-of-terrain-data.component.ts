import { AfterViewInit, Component, ViewChild, OnInit, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SharedService } from 'src/app/services/shared.service';
import { TerrainData } from 'src/app/interfaces/terrain';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TerrainDataEditComponent } from 'src/app/dialogs/terrain-data-edit/terrain-data-edit.component';

@Component({
  selector: 'app-list-of-terrain-data',
  templateUrl: './list-of-terrain-data.component.html',
  styleUrls: ['./list-of-terrain-data.component.scss']
})
export class ListOfTerrainDataComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() data?: number;
  @Input() inEdit?: boolean;

  displayedColumns: string[] = ['year', 'type', 'data'];

  dataSource: MatTableDataSource<TerrainData> = new MatTableDataSource<TerrainData>([]);


  constructor(
    public dialog: MatDialog,
    private sharedService: SharedService
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
    this.fillList()
  }

  fillList() {
    if (this.data) {
      this.sharedService.TerrainDataService?.getTerrainDataList(this.data).subscribe((res: any) => {
        const terrainArray: TerrainData[] = [];
        for (const key in res) {
          const terrainData = res[key];

          terrainArray.push(terrainData);
        }
        this.dataSource.data = terrainArray;
      });
    }
  }

  openDialogChangeTerrainDataEdit(row: TerrainData): void {


    const dialogConfig = new MatDialogConfig();
    if (row.type == 'temp') {
      dialogConfig.width = '350px';
      dialogConfig.height = '550px';
      dialogConfig.data = {
        terrainData: this.dataSource.data.find(data => data.type === 'rad' && data.year === row.year), terrainId: this.data, terrainData2: row
      };
    } else if (row.type == 'rad') {

      dialogConfig.width = '350px';
      dialogConfig.height = '550px';
      dialogConfig.data = {
        terrainData: row, terrainId: this.data, terrainData2: this.dataSource.data.find(data => data.type === 'temp' && data.year === row.year)
      };
    } else {
      dialogConfig.width = '350px';
      dialogConfig.height = '400px';
      dialogConfig.data = { terrainData: row, terrainId: this.data };
    }

    const dialogRef = this.dialog.open(TerrainDataEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: any) => {
      this.fillList();
    });
  }
}
