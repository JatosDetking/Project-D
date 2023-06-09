import { Component, OnInit, AfterViewChecked, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-instalation',
  templateUrl: './add-instalation.component.html',
  styleUrls: ['./add-instalation.component.scss']
})
export class AddInstalationComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @ViewChild('inputInterval') inputInterval?: ElementRef
  @ViewChild('inputInterval2') inputInterval2?: ElementRef
  @ViewChild('inputInterval3') inputInterval3?: ElementRef
  @ViewChild('inputInterval4') inputInterval4?: ElementRef

  selectedType = 'solar installation';

  name = new FormControl('', [Validators.required, Validators.maxLength(45)]);
  price = new FormControl('', [Validators.pattern(/^\d+$/), Validators.required, Validators.maxLength(8)]);
  inter1 = new FormControl('', [Validators.pattern(/^\d+\.*\d*$/), Validators.required, Validators.maxLength(10)]);
  inter2 = new FormControl('', [Validators.pattern(/^\d+\.*\d*$/), Validators.required, Validators.maxLength(10)]);
  performance1 = new FormControl('', [Validators.pattern(/^\d+\.*\d*$/), Validators.required, Validators.maxLength(10)]);
  performance2 = new FormControl('', [Validators.pattern(/^\d+\.*\d*$/), Validators.required, Validators.maxLength(10)]);
  performance3 = new FormControl('', [Validators.pattern(/^\d+\.*\d*$/), Validators.required, Validators.maxLength(10)]);
  constructor(
    private ref: ChangeDetectorRef,
    private router: Router,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    this.inter1.valueChanges.subscribe(value => {
      //@ts-ignore
      this.inputInterval?.nativeElement.value = this.inter1.value;
      //@ts-ignore
      this.inputInterval2?.nativeElement.value = this.inter1.value;
      (this.inputInterval?.nativeElement as HTMLInputElement).style.width = this.inputInterval?.nativeElement.value.length + 'ch';
      (this.inputInterval2?.nativeElement as HTMLInputElement).style.width = this.inputInterval2?.nativeElement.value.length + 'ch';
    })
    this.inter2.valueChanges.subscribe(value => {
      //@ts-ignore
      this.inputInterval3?.nativeElement.value = this.inter2.value;
      //@ts-ignore
      this.inputInterval4?.nativeElement.value = this.inter2.value;
      (this.inputInterval3?.nativeElement as HTMLInputElement).style.width = this.inputInterval3?.nativeElement.value.length + 'ch';
      (this.inputInterval4?.nativeElement as HTMLInputElement).style.width = this.inputInterval4?.nativeElement.value.length + 'ch';
    })
    this.inter1.setValue(1);
    this.inter2.setValue(2);
  }
  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

  addInstalation() {
    let interval = this.inter1.value + "-" + this.inter2.value;
    let parformance = this.performance1.value + "-" + this.performance2.value + "-" + this.performance3.value;
    this.sharedService.InstallationService?.addInstallation(this.name.value, interval, parformance, this.price.value, this.selectedType).subscribe((res: any) => {
      this.router.navigate(['home']);
    });
  }
}
