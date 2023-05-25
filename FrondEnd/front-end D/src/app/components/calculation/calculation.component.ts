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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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
    this.dataSourceTerrains.paginator = this.paginator;
    this.dataSourceTerrains.sort = this.sort;
    this.dataSourceInstallations.paginator = this.paginator;
    this.dataSourceInstallations.sort = this.sort;
  }

  isAllSelectedTerrains() {
    const numSelected = this.selectionTerrains.selected.length;
    const numRows = this.dataSourceTerrains.data.length;
    return numSelected === numRows;
  }

  toggleAllRowsTerrains() {
    if (this.isAllSelectedTerrains()) {
      this.selectionTerrains.clear();
      return;
    }
    this.selectionTerrains.select(...this.dataSourceTerrains.data);
  }

  isAllSelectedInstallations() {
    const numSelected = this.selectionInstallations.selected.length;
    const numRows = this.dataSourceInstallations.data.length;
    return numSelected === numRows;
  }

  toggleAllRowsInstallations() {
    if (this.isAllSelectedTerrains()) {
      this.selectionInstallations.clear();
      return;
    }
    this.selectionInstallations.select(...this.dataSourceInstallations.data);
  }

  /*checkboxLabelTerrains(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelectedTerrains() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }*/

  ngOnInit(): void {
    this.fillListTerrains();
    this.fillListInstalations();
  }
  firstFormGroup = this._formBuilder.group({
    ready: [true, Validators.requiredTrue]
  });

  secondFormGroup = this._formBuilder.group({
    ready: [false, Validators.requiredTrue]
  });

  thirdFormGroup = this._formBuilder.group({
    ready: [false, Validators.requiredTrue]
  });

  fourthFormGroup = this._formBuilder.group({
    ready: [false, Validators.requiredTrue]
  });

  fifthFormGroup = this._formBuilder.group({
    ready: [false, Validators.requiredTrue]
  });


  fillListTerrains() {
    this.sharedService.TerrainService?.getMyTerrainsList().subscribe((res: any) => {
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
      this.dataSourceTerrains.data = terrainArray;
      // this.listSize = [10, 25, 50, 100];
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
}

