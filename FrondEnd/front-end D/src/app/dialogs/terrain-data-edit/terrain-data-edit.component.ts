import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-terrain-data-edit',
  templateUrl: './terrain-data-edit.component.html',
  styleUrls: ['./terrain-data-edit.component.scss']
})
export class TerrainDataEditComponent implements OnInit {

  data: any;


  dataValue: FormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(10)
  ]);
  constructor(
    public dialogRef: MatDialogRef<TerrainDataEditComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private sharedService: SharedService
  ) {
    this.data = data,
      this.dataValue.setValue(this.data.terrainData.data);
      if(this.data.terrainData.type == "temp"){
        this.dataValue.addValidators( Validators.pattern(/^\-*\d+\.*\d*$/));
      }else{
        this.dataValue.addValidators( Validators.pattern(/^\d+\.*\d*$/));
      }
      
  }

  updateTerrainData() {
    this.sharedService.TerrainDataService?.updateTerrainData(this.data.terrainId, this.dataValue.value, this.data.terrainData.id).subscribe(res => {
      this.dialogRef.close();
    });
  }

  ngOnInit(): void {
  }

}
