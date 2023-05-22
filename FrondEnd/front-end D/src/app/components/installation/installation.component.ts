import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { Installation } from 'src/app/interfaces/installation';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationsComponent } from 'src/app/dialogs/confirmations/confirmations.component';


@Component({
  selector: 'app-installation',
  templateUrl: './installation.component.html',
  styleUrls: ['./installation.component.scss']
})
export class InstallationComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @ViewChild('inputInterval') inputInterval?: ElementRef
  @ViewChild('inputInterval2') inputInterval2?: ElementRef
  @ViewChild('inputInterval3') inputInterval3?: ElementRef
  @ViewChild('inputInterval4') inputInterval4?: ElementRef
  isCreator = true;
  inEdit = false;
  perform_factors: string[] = [];

  myId: number = +(localStorage.getItem("id") || 0);

  name = new FormControl('', [Validators.required, Validators.maxLength(45)]);
  price = new FormControl('', [Validators.pattern(/^\d+$/), Validators.required, Validators.maxLength(50)]);
  inter1 = new FormControl('', [Validators.pattern(/^\d+\.*\d*$/), Validators.required, Validators.maxLength(10)]);
  inter2 = new FormControl('', [Validators.pattern(/^\d+\.*\d*$/), Validators.required, Validators.maxLength(10)]);
  performance1 = new FormControl('', [Validators.pattern(/^\d+\.*\d*$/), Validators.required, Validators.maxLength(10)]);
  performance2 = new FormControl('', [Validators.pattern(/^\d+\.*\d*$/), Validators.required, Validators.maxLength(10)]);
  performance3 = new FormControl('', [Validators.pattern(/^\d+\.*\d*$/), Validators.required, Validators.maxLength(10)]);

  creator: User = {
    id: 0,
    username: "creator",
    email: "creator",
    name: "creator"
  };

  installation: Installation = {
    id: 0,
    name: "Empty",
    price: 0,
    type: "Empty",
    intervals: "Empty",
    performance_factors: "Empty",
    creator: this.creator
  };

  constructor(
    private route: ActivatedRoute,
    public sharedService: SharedService,
    private ref: ChangeDetectorRef,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.installation = JSON.parse(this.route.snapshot.queryParams['installation']);
    this.creator = this.installation.creator;
    //this.formater();

    this.name.setValue(this.installation.name);
    this.price.setValue(this.installation.price);

    this.editorProfile();
  }

  editorProfile() {
    if (this.creator.id == this.myId) {
      this.isCreator = true;
    }
    else {
      this.isCreator = false;
    }
  }
  goToEditMode() {
    this.inEdit = true;
  }
  saveChanges() {
    let interval = this.inter1.value + "-" + this.inter2.value;
    let parformance = this.performance1.value + "-" + this.performance2.value + "-" + this.performance3.value;
    this.sharedService.InstallationService?.updateInstallation(this.installation.id, this.name.value, interval, parformance, this.price.value).subscribe((res: any) => {

      this.refreshInstallation();
    });
    this.inEdit = false;
  }
  refreshInstallation() {
    this.sharedService.InstallationService?.getInstallation(this.installation.id).subscribe((res: any) => {
      this.installation = res;

      this.name.setValue(this.installation.name);
      this.price.setValue(this.installation.price);
      this.formater();
    });
  }
  formater() {
    this.perform_factors = [];
    let intervals = this.installation.intervals.split("-");
    let performanceFactors = this.installation.performance_factors.split("-");
    let row1 = `For the interval (0; ${intervals[0]}) the value is ${performanceFactors[0]}.`
    let row2 = `For the interval (${intervals[0]}; ${intervals[1]}) the value is ${performanceFactors[1]}.`
    let row3 = `For the interval (${intervals[1]}; ∞) the value is ${performanceFactors[2]}.`;
    this.perform_factors.push(row1);
    this.perform_factors.push(row2);
    this.perform_factors.push(row3);
    this.inter1.setValue(intervals[0]);
    this.inter2.setValue(intervals[1]);

    this.performance1.setValue(performanceFactors[0]);
    this.performance2.setValue(performanceFactors[1]);
    this.performance3.setValue(performanceFactors[2]);
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
    this.formater();
  }
  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

  deleteInstallation(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '350px';
    dialogConfig.height = '200px';
    dialogConfig.data = 'Are you sure you want to delete this installation?';

    const dialogRef = this.dialog.open(ConfirmationsComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: any) => {
      if(result==true)
      this.sharedService.InstallationService?.deleteInstallation(this.installation.id).subscribe((res: any) => {
        this.router.navigate(['home']);
      });
    });
  }
}
