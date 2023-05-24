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

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

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


  ngAfterViewInit() {
    this.dataSourceTerrains.paginator = this.paginator;
    this.dataSourceTerrains.sort = this.sort;
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

/*checkboxLabelTerrains(row?: PeriodicElement): string {
  if (!row) {
    return `${this.isAllSelectedTerrains() ? 'deselect' : 'select'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
}*/

ngOnInit(): void {
  this.fillListTerrains();
}
firstFormGroup = this._formBuilder.group({
  name: ['', [Validators.required, Validators.maxLength(45)]],
  price: ['', [Validators.pattern(/^\d+$/), Validators.required, Validators.maxLength(50)]],
  selectedType: ['private', Validators.required]
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
}

