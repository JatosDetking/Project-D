import { ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { SelectionChange, SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Terrain } from 'src/app/interfaces/terrain';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Installation } from 'src/app/interfaces/installation';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
  selector: 'app-calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class CalculationComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @ViewChild('paginatorTerrains') paginatorTerrains!: MatPaginator;
  @ViewChild('terrainsMatSort') sortTerrains!: MatSort;
  @ViewChild('installationPaginators') paginatorInstallations!: MatPaginator;
  @ViewChild('installationsMatSort') sortInstallations!: MatSort;
  @ViewChild('resultPaginators') paginatorResult!: MatPaginator;
  @ViewChild('resultMatSort') sortResult!: MatSort;

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

  dataSourceResult = new MatTableDataSource<any>([]);
  displayedColumnsResult: string[] = ['name', 'price', 'result'];

  err1 = false;
  err2 = false;
  err3 = false;

  resultMethodName = '';


  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

  ngAfterViewInit() {
    this.dataSourceTerrains.paginator = this.paginatorTerrains;
    this.dataSourceTerrains.sort = this.sortTerrains;
    this.dataSourceInstallations.paginator = this.paginatorInstallations;
    this.dataSourceInstallations.sort = this.sortInstallations;
    this.dataSourceResult.paginator = this.paginatorResult;
    this.dataSourceResult.sort = this.sortResult;
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
    ready: [false, Validators.requiredTrue]
  });

  secondFormGroup = this._formBuilder.group({
    ready: [false, Validators.requiredTrue]
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
      // console.log(terrainArray.length)
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
    console.log(this.selectionTerrains);
    console.log(this.selectionTerrains.selected.length);
    /*  const queryParams = { terrain: JSON.stringify(row) };
      const urlTree = this.router.createUrlTree(['terrain'], { queryParams });
      const url = 'http://localhost:4200/#' + urlTree.toString();
      window.open(url, '_blank');*/
  }
  onRowMiddleClickInstallations(row: Installation) {
    const queryParams = { installation: JSON.stringify(row) };
    const urlTree = this.router.createUrlTree(['installation'], { queryParams });
    const url = 'http://localhost:4200/#' + urlTree.toString();
    window.open(url, '_blank');
  }
  checkReady1() {
    if (this.selectionTerrains.selected.length > 0) {
      console.log(this.selectionTerrains.selected.length);
      this.firstFormGroup.setValue({
        ready: true
      });
    } else {
      this.firstFormGroup.setValue({
        ready: false
      });
    }
  }
  isReady1ControlInvalid() {
    if (this.firstFormGroup.get('ready')?.invalid) {
      this.err1 = true;
    } else {
      this.err1 = false;
    }
  }
  resetReady1() {
    this.firstFormGroup.setValue({
      ready: false
    });
  }
  checkReady2() {
    console.log(this.selectionInstallations.selected.length)
    if (this.selectionInstallations.selected.length == 3) {
      const uniqueTypes = new Set(this.selectionInstallations.selected.map(item => item.type));
      if (uniqueTypes.size === 3) {
        this.secondFormGroup.setValue({
          ready: true
        });
      }
    }
    else {
      this.secondFormGroup.setValue({
        ready: false
      });
    }
  }
  isReady2ControlInvalid() {
    if (this.secondFormGroup.get('ready')?.invalid) {
      this.err2 = true;
    } else {
      this.err2 = false;
    }
  }
  resetReady2() {
    this.secondFormGroup.setValue({
      ready: false
    });
  }
  isReady3ControlInvalid() {
    if (this.thirdFormGroup.get('selectedMethod')?.invalid) {
      this.err3 = true;
    } else {
      this.err3 = false;
    }
  }
  calculation() {
    let a = '50,51';
    let b = '10,11,12';
    let c = 'Maximum Expected Efficiency';
    let d = 20018;
    this.resultMethodName = this.thirdFormGroup.get('selectedMethod')!.value;
    if (!this.thirdFormGroup.get('selectedMethod')?.invalid) {
      this.sharedService.CalculationService?.getCalculation(a, b, c, d).subscribe((res: any) => {
        let temp = this.dataSourceTerrains.data.filter(a => res.result.terrains.some((b: any) => b.id === a.id));
        temp.forEach(a => {
          const matchingItem = res.result.terrains.find((b: any) => b.id === a.id);
          Object.assign(a, matchingItem);
        });
        this.dataSourceResult.data = temp
      });
    }

  }
}

