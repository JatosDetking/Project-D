import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.scss']
})
export class CalculationComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private sharedService: SharedService,
    private router: Router
  ) { }

  ngOnInit(): void {
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
}

