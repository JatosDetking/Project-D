import { AfterViewInit, Component, ViewChild, OnInit, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SharedService } from 'src/app/services/shared.service';
import { TerrainData } from 'src/app/interfaces/terrain';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-list-of-terrain-data',
  templateUrl: './list-of-terrain-data.component.html',
  styleUrls: ['./list-of-terrain-data.component.scss']
})
export class ListOfTerrainDataComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  @Input() data?: number;
  
  displayedColumns: string[] = ['year', 'type','data'];

  dataSource: MatTableDataSource<TerrainData> = new MatTableDataSource<TerrainData>([]);

  constructor(
    private sharedService:SharedService
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
    if(this.data){
    this.sharedService.TerrainDataService?.getMyTerrainDataList(this.data).subscribe((res: any) => {
      const terrainArray: TerrainData[] = [];
      for (const key in res) {
        const terrainData = res[key];
       
        terrainArray.push(terrainData);
      }
      this.dataSource.data = terrainArray;
    });
  }
  }

  onRowClick() {
   
  }
}
