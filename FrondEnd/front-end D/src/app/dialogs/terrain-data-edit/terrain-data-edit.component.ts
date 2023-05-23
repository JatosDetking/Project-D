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

    if (this.data.hasOwnProperty('terrainData2')) {
      this.dataValue2.setValue(this.data.terrainData2.data);

      if (this.data.terrainData2.type == "temp") {
        this.dataValue2.addValidators(Validators.pattern(/^\-*\d+\.*\d*$/));
      } else {
        this.dataValue2.addValidators(Validators.pattern(/^\d+\.*\d*$/));
      }
    }


  }

  updateTerrainData() {
    if (this.data.hasOwnProperty('terrainData2')) {
      this.sharedService.TerrainDataService?.updateTerrainData(this.data.terrainId, this.dataValue.value, this.data.terrainData.id).subscribe(res => {
      });
      this.sharedService.TerrainDataService?.updateTerrainData(this.data.terrainId, this.dataValue2.value, this.data.terrainData2.id).subscribe(res => {
        this.dialogRef.close();
      });
    } else {
      this.sharedService.TerrainDataService?.updateTerrainData(this.data.terrainId, this.dataValue.value, this.data.terrainData.id).subscribe(res => {
        this.dialogRef.close();
      });
    }

  }
  deleteTerrainData() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '350px';
    dialogConfig.height = '200px';
    dialogConfig.data = 'Are you sure you want to delete this data?';

    const dialogRef = this.dialog.open(ConfirmationsComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == true) {
        if (this.data.hasOwnProperty('terrainData2')) {
          this.sharedService.TerrainDataService?.deleteTerrainData(this.data.terrainId, this.data.terrainData.id, this.data.terrainData2.id).subscribe(res => {
            this.dialogRef.close();
          });
        } else {
          this.sharedService.TerrainDataService?.deleteTerrainData(this.data.terrainId, this.data.terrainData.id, -1).subscribe(res => {
            this.dialogRef.close();
          });
        }
      }
    });
  }

  ngOnInit(): void {
  }

}
