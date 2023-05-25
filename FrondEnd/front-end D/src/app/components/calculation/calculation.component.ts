import { ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Terrain } from 'src/app/interfaces/terrain';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Installation } from 'src/app/interfaces/installation';

@Component({
  selector: 'app-calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.scss']
})
export class CalculationComponent implements OnInit, AfterViewInit {

  @ViewChild('installationTerrains') paginatorTerrains!: MatPaginator;
  @ViewChild('TerrainsMatSort') sortTerrains!: MatSort;
  @ViewChild('installationPaginators') paginatorInstallations!: MatPaginator;
  @ViewChild('InstallationsMatSort') sortInstallations!: MatSort;


  constructor(private _formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private sharedService: SharedService,
    private router: Router
  ) { }

  dataSourceTerrains = new MatTableDataSource<Terrain>([]);
  displayedColumnsTerrains: string[] = ['select', 'name', 'price'];
  selectionTerrains = new SelectionModel<Terrain>(true, []);

  dataSourceInstallations = new MatTableDataSource<Installation>([]);
  displayedColumnsInstallations: string[] = ['select', 'name', 'type', 'price'];
  selectionInstallations = new SelectionModel<Installation>(true, []);


  ngAfterViewInit() {
    this.dataSourceTerrains.paginator = this.paginatorTerrains;
    this.dataSourceTerrains.sort = this.sortTerrains;
    this.dataSourceInstallations.paginator = this.paginatorInstallations;
    this.dataSourceInstallations.sort = this.sortInstallations;
  }

  isAllSelectedTerrains() {
    const numSelected = this.selectionTerrains.selected.length;
    const numRows = this.dataSourceTerrains.data.length;
    return numSelected === numRows;
  }
  isHaveSelectedTerrains() {
    const numSelected = this.selectionTerrains.selected.length;
    const numRows = this.dataSourceTerrains.data.length;
    if (numSelected > 0 && numSelected < numRows) {
      return true
    }
    else {
      return false
    }
  }

  toggleAllRowsTerrains() {
    if (this.isAllSelectedTerrains()) {
      this.selectionTerrains.clear();
    } else {
      const selectedRows = this.selectionTerrains.selected.length;
      if (selectedRows === 0) {
        this.selectionTerrains.select(...this.dataSourceTerrains.data);
      } else {
        this.selectionTerrains.clear();
      }
    }
  }

  isAllSelectedInstallations() {
    const numSelected = this.selectionInstallations.selected.length;
    const numRows = this.dataSourceInstallations.data.length;
    return numSelected === numRows;
  }

  isHaveSelectedInstallations() {
    const numSelected = this.selectionInstallations.selected.length;
    const numRows = this.dataSourceInstallations.data.length;
    if (numSelected > 0 && numSelected < numRows) {
      return true
    }
    else {
      return false
    }
  }

  toggleAllRowsInstallations() {
    if (this.isAllSelectedInstallations()) {
      this.selectionInstallations.clear();
    } else {
      const selectedRows = this.selectionInstallations.selected.length;
      if (selectedRows === 0) {
        this.selectionInstallations.select(...this.dataSourceInstallations.data);
      } else {
        this.selectionInstallations.clear();
      }
    }
  }

  ngOnInit(): void {
    this.fillListTerrains();
    this.fillListInstalations();


  }
  firstFormGroup = this._formBuilder.group({
    ready: [true, Validators.requiredTrue]
  });

  secondFormGroup = this._formBuilder.group({
    ready: [true, Validators.requiredTrue]
  });

  thirdFormGroup = this._formBuilder.group({
    selectedMethod: ['', Validators.required]
  });

  fillListTerrains() {
    this.sharedService.TerrainService?.getAllTerrains().subscribe((res: any) => {
      const terrainArray: Terrain[] = [];
      for (const key in res) {
        const terrainData = res[key];
        const terrain: Terrain = {
          id: terrainData.id,
          name: terrainData.name,
          price: terrainData.price,
          creator_id: terrainData.creator_id,
          type: terrainData.type,
          last_change_time: this.sharedService.SharedLogicService?.formatDateTime(terrainData.last_change_time)!,
          last_change_id: terrainData.last_change_id,
        };
        terrainArray.push(terrain);
      }
      console.log(terrainArray.length)
      this.dataSourceTerrains.data = terrainArray;
    });
  }
  fillListInstalations() {
    this.sharedService.InstallationService?.getAllInstallation().subscribe((res: any) => {
      const installationArray: Installation[] = [];
      for (const key in res) {
        const instalationData = res[key];
        const instalation: Installation = instalationData;
        installationArray.push(instalation);
      }
      this.dataSourceInstallations.data = installationArray;
    });
  }
  filterInstallationsByType(selectedTypes: string[]): void {
    this.dataSourceInstallations.filterPredicate = (data: Installation, filter: string) => {
      const filters = filter.split(',');
      return filters.includes(data.type);
    };
    this.dataSourceInstallations.filter = selectedTypes.join(',');
  }
  onRowMiddleClickTerrains(row: Terrain) {

    const queryParams = { terrain: JSON.stringify(row) };
    const urlTree = this.router.createUrlTree(['terrain'], { queryParams });
    const url = 'http://localhost:4200/#' + urlTree.toString();
    window.open(url, '_blank');
  }
  onRowMiddleClickInstallations(row: Installation) {
    const queryParams = { installation: JSON.stringify(row) };
    const urlTree = this.router.createUrlTree(['installation'], { queryParams });
    const url = 'http://localhost:4200/#' + urlTree.toString();
    window.open(url, '_blank');
  }
}

