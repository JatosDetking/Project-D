import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from 'src/app/services/shared.service';
import { ConfirmationsComponent } from '../confirmations/confirmations.component';

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
  dataValue2: FormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(10)
  ]);
  constructor(
    public dialogRef: MatDialogRef<TerrainDataEditComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private sharedService: SharedService,
    public dialog: MatDialog
  ) {
    this.data = data,
      this.dataValue.setValue(this.data.terrainData.data);

    if (this.data.mode == 'add') {
      data.creator = true;
    }
    if (this.data.hasOwnProperty('terrainData2')) {
      this.dataValue2.setValue(this.data.terrainData2.data);
      if (this.data.terrainData2.type == "temperature") {
        this.dataValue2.addValidators(Validators.pattern(/^\-*\d+\.*\d*$/));
      } else {
        this.dataValue2.addValidators(Validators.pattern(/^\d+\.*\d*$/));
      }
    }
  }

  updateTerrainData() {
    if (this.data.mode == 'add') {
      if (this.data.hasOwnProperty('terrainData2')) {

        this.dialogRef.close({ action: 'update', data: [this.dataValue.value, this.dataValue2.value] });
      } else {
        this.dialogRef.close({ action: 'update', data: [this.dataValue.value] });
      }
    }
    else {
      if (this.data.hasOwnProperty('terrainData2')) {
        console.log(this.dataValue.value)
        console.log(this.dataValue2.value)
        console.log(this.data.terrainData.id)
        console.log(this.data.terrainData2.id)
        this.sharedService.TerrainDataService?.updateTerrainData(this.data.terrainId, this.dataValue.value, this.data.terrainData.id).subscribe(res => {
          this.sharedService.TerrainDataService?.updateTerrainData(this.data.terrainId, this.dataValue2.value, this.data.terrainData2.id).subscribe(res => {
            this.dialogRef.close();
          });
        });
      } else {
        this.sharedService.TerrainDataService?.updateTerrainData(this.data.terrainId, this.dataValue.value, this.data.terrainData.id).subscribe(res => {
          this.dialogRef.close();
        });
      }
    }
  }
  deleteTerrainData() {
    if (this.data.mode == 'add') {
      this.dialogRef.close({ action: 'delete' });
    }
    else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '350px';
      dialogConfig.height = '200px';
      dialogConfig.data = 'Are you sure you want to delete this data?';

      const dialogRef = this.dialog.open(ConfirmationsComponent, dialogConfig);

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result == true) {
            this.sharedService.TerrainDataService?.deleteTerrainData(this.data.terrainId, this.data.terrainData.year).subscribe(res => {
              this.dialogRef.close();
            });  
        }
      });
    }

  }

  ngOnInit(): void {
  }

}
