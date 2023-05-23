import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-terrain',
  templateUrl: './add-terrain.component.html',
  styleUrls: ['./add-terrain.component.scss']
})
export class AddTerrainComponent implements OnInit {

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
    price: ['', Validators.required]
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isEditable = false;

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

}
