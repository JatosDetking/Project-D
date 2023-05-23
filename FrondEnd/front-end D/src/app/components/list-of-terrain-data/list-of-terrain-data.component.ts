import { AfterViewInit, Component, AfterViewChecked, ViewChild, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
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
export class ListOfTerrainDataComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() data?: number;
  @Input() inEdit?: boolean;
  @Input() isCreator?: boolean;
  @Input() mode: string = '';

  @Input() terrainData?: any[] = [];
  @Output() terrainDataChange: EventEmitter<any> = new EventEmitter<any>();

  private originalData?: number;

  displayedColumns: string[] = ['year', 'type', 'data'];
  listSize: number[] = [];
  dataSource: MatTableDataSource<TerrainData> = new MatTableDataSource<TerrainData>([]);


  constructor(
    public dialog: MatDialog,
    private sharedService: SharedService,
    private ref: ChangeDetectorRef,
  ) { }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.terrainData!;
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

  updeteList() {
    this.dataSource.data = this.terrainData!;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    if (this.mode == 'add') {
      this.dataSource.data = this.terrainData!;
      this.listSize = [5];

    } else {
      this.fillList()
      this.listSize = [10, 20, 50, 100, 1000];
    }
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

  openDialogChangeTerrainDataEdit(row: TerrainData, i: number): void {
    const dialogConfig = new MatDialogConfig();
    console.log(i)
    let i2 = -1;
    if (this.mode != '') {
      if (row.type == 'temperature') {
        dialogConfig.width = '350px';
        dialogConfig.height = '550px';
        i2 = this.dataSource.data.findIndex(data => data.type === 'solar radiation' && data.year === row.year);
        dialogConfig.data = {
          terrainData: this.dataSource.data.find(data => data.type === 'solar radiation' && data.year === row.year), terrainId: this.data, terrainData2: row,
          creator: this.isCreator, mode: this.mode
        };
      } else if (row.type == 'solar radiation') {

        dialogConfig.width = '350px';
        dialogConfig.height = '550px';
        i2 = this.dataSource.data.findIndex(data => data.type === 'temperature' && data.year === row.year);
        dialogConfig.data = {
          terrainData: row, terrainId: this.data, terrainData2: this.dataSource.data.find(data => data.type === 'temperature' && data.year === row.year), creator: this.isCreator, mode: this.mode
        };
      } else {
        dialogConfig.width = '350px';
        dialogConfig.height = '400px';
        dialogConfig.data = { terrainData: row, terrainId: this.data, creator: this.isCreator, mode: this.mode };
      }
    } else {
      if (row.type == 'temperature') {
        dialogConfig.width = '350px';
        dialogConfig.height = '550px';
        dialogConfig.data = {
          terrainData: this.dataSource.data.find(data => data.type === 'solar radiation' && data.year === row.year), terrainId: this.data, terrainData2: row,
          creator: this.isCreator, mode: ''
        };
      } else if (row.type == 'solar radiation') {

        dialogConfig.width = '350px';
        dialogConfig.height = '550px';
        dialogConfig.data = {
          terrainData: row, terrainId: this.data, terrainData2: this.dataSource.data.find(data => data.type === 'temperature' && data.year === row.year), creator: this.isCreator, mode: ''
        };
      } else {
        dialogConfig.width = '350px';
        dialogConfig.height = '400px';
        dialogConfig.data = { terrainData: row, terrainId: this.data, creator: this.isCreator, mode: '' };
      }
    }

    const dialogRef = this.dialog.open(TerrainDataEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (this.mode == 'add') {
        if (result) {
          if (result.action == 'update') {
            if (i2 != -1) {
              this.terrainData![i2].data = result.data[1];
            }
            row.data = result.data[0];
          } else if (result.action == 'delete') {
            if (i2 != -1) {
              if (i2 > i) {
                this.terrainData!.splice(i2, 1);
                this.terrainData!.splice(i, 1);
              } else {
                this.terrainData!.splice(i, 1);
                this.terrainData!.splice(i2, 1);
              }
            } else {
              this.terrainData!.splice(i, 1);
            }

          }
          this.updeteList()
        }
      } else {
        this.fillList()
      }
    });
  }
}
