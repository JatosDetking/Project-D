
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { ListOfTerrainDataComponent } from '../list-of-terrain-data/list-of-terrain-data.component';

@Component({
  selector: 'app-add-terrain',
  templateUrl: './add-terrain.component.html',
  styleUrls: ['./add-terrain.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class AddTerrainComponent implements OnInit {

  @ViewChild('dataTable') dataTable?: ListOfTerrainDataComponent
  terrainData: any = [];

  duplicate = false;
  invalidS = false;

  temp = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\-*\d+\.*\d*$/)]);
  rad = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d+\.*\d*$/)]);
  wind = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d+\.*\d*$/)]);
  water = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d+\.*\d*$/)]);
  year = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d+(\.\d{0,1})?$/)]);


  firstFormGroup = this._formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(45)]],
    price: ['', [Validators.pattern(/^\d+$/), Validators.required, Validators.maxLength(8)]],
    selectedType: ['private', Validators.required]
  });

  secondFormGroup = this._formBuilder.group({
    ready: [false, Validators.requiredTrue]
  });
  constructor(private _formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private sharedService: SharedService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkReady()
  }

  test() {
    const nameValue = this.firstFormGroup.get('name')?.value;
    console.log(nameValue);
  }
  checkReady() {
    const value: any[] = this.terrainData;
    if (Array.isArray(value) && value.length > 0) {
      this.secondFormGroup.setValue({
        ready: true
      });
    }
  }
  addData() {
    if (this.year.value % 1 <= 0.4) {
      this.invalidS = false;
      this.duplicate = this.terrainData.some((val: any) => {
        return val.year === this.year.value;
      });
      if (!this.duplicate) {
        this.terrainData.push({ data: this.temp.value, type: 'temperature', year: this.year.value })
        this.terrainData.push({ data: this.rad.value, type: 'solar radiation', year: this.year.value })
        this.terrainData.push({ data: this.wind.value, type: 'wind speed', year: this.year.value })
        this.terrainData.push({ data: this.water.value, type: 'flow rate', year: this.year.value })
        this.checkReady()
        this.ref.detectChanges();
        this.dataTable?.updeteList();
      }
    } else {
      this.invalidS = true;
    }
  }
  complete() {
    this.sharedService.TerrainService?.addTerrain(this.firstFormGroup.get('name')?.value, this.firstFormGroup.get('price')?.value, this.firstFormGroup.get('selectedType')?.value, this.terrainData).subscribe(res => {
      this.router.navigate(['home']);
    });
  }
}


