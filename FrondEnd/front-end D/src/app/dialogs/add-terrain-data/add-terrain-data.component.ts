import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-terrain-data',
  templateUrl: './add-terrain-data.component.html',
  styleUrls: ['./add-terrain-data.component.scss']
})
export class AddTerrainDataComponent implements OnInit {

  tempArr: any[] = [];
  terrainId = -1;
  years: number[] = [];
  duplicate= false;

  temp = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\-*\d+\.*\d*$/)]);
  rad = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d+\.*\d*$/)]);
  wind = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d+\.*\d*$/)]);
  water = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d+\.*\d*$/)]);
  year = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d+$/)]);


  constructor(private sharedService: SharedService,
    public dialogRef: MatDialogRef<AddTerrainDataComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.terrainId = data.terrainId;
    this.years = data.year;
  }

  ngOnInit(): void {
  }

  addTerrainData() {
    this.duplicate = this.years.includes( this.year.value);
    if (!this.duplicate) {
      this.tempArr.push({ data: this.temp.value, type: 'temperature', year: this.year.value })
      this.tempArr.push({ data: this.rad.value, type: 'solar radiation', year: this.year.value })
      this.tempArr.push({ data: this.wind.value, type: 'wind speed', year: this.year.value })
      this.tempArr.push({ data: this.water.value, type: 'water level', year: this.year.value })
  
      this.sharedService.TerrainDataService?.addTerrainData(this.terrainId,this.tempArr).subscribe(res => { 
        this.dialogRef.close();
      });
    }
   
  }
}
