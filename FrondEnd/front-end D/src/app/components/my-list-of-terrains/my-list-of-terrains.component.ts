import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Terrain } from 'src/app/interfaces/terrain';
import { TerrainService } from 'src/app/services/terrain.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-list-of-terrains',
  templateUrl: './my-list-of-terrains.component.html',
  styleUrls: ['./my-list-of-terrains.component.scss']
})
export class MyListOfTerrainsComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['name', 'price'];

  dataSource: MatTableDataSource<Terrain> = new MatTableDataSource<Terrain>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private terrainService: TerrainService,
    private router: Router
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
    this.terrainService.getMyTerrainsList().subscribe((res: any) => {
      const terrainArray: Terrain[] = [];
      for (const key in res) {
        const terrainData = res[key];
        const terrain: Terrain = {
          id: terrainData.id,
          name: terrainData.name,
          price: terrainData.price,
          creator_id: terrainData.creator_id,
          type: terrainData.type,
          last_change_time: this.formatDateTime(terrainData.last_change_time),
          last_change_id: terrainData.last_change_id,
          terrainsData: []
        };
        terrainArray.push(terrain);
      }
      this.dataSource.data = terrainArray;
    });
  }

  onRowClick(row: Terrain) {
    this.router.navigate(['terrain'], { queryParams: { terrain: JSON.stringify(row) } });
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
  
    const formattedDate = date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  
    return `${formattedTime} ${formattedDate}`;
  }
}


