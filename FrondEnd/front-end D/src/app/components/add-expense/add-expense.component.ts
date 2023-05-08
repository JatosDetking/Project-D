import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { onlyWordChars } from 'src/app/utils/controls';
import { ShortExp } from 'src/app/interfaces/expense';
import { QrCodeScannerService } from 'src/app/services/qr-code-scanner.service';
import { SuggestionsService } from 'src/app/api/suggestions.service';
import { GroupsApiService } from 'src/app/api/groups-api.service';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss']
})
export class AddExpenseComponent implements AfterViewInit {

  productNameControl = new FormControl(null, [
    Validators.minLength(4),
    Validators.maxLength(40),
    Validators.required,
  ]);
  productLocationControl = new FormControl(null);
  productPriceControl = new FormControl(null, [
    Validators.pattern('^[1-90]+\.*[1-90]+$'),
    Validators.required,
  ]);
  productDateControl = new FormControl(null, [
    Validators.required,
  ]);
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsCtrl = new FormControl('');
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  allTags: string[] = [];

  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;
  @ViewChild('picker') picker!: ElementRef<HTMLInputElement>;
  expenses: ShortExp[] = []
  constructor(
    public qrScan: QrCodeScannerService,
    public suggestionAPI:SuggestionsService,
    public groupsAPI:GroupsApiService,
    public groupService:GroupService
  ) {
    this.filteredTags = this.tagsCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice())),
    );
  }


  camerascan = false
  useCamera() {
    if (this.camerascan) {
      this.camerascan = false;
      this.qrScan.stopScan((res) => { console.log(res) })
    } else {
      this.camerascan = true;
      this.qrScan.startScan(
        this.imageScanSuccess,
        this.imageScanError,
        this.imageScanError
      )
    }
  }

  scan?: string
  scanMsg?: string
  successString?:string
  all_added = false;
  imageScanSuccess = (msg: string) => {
    if(this.camerascan){
      this.camerascan = false;
      this.qrScan.stopScan((res) => { console.log(res) })
    }
    this.successString = msg
    this.scan = 'success';
    this.scanMsg = 'QR code was scaned successfully.';
    this.parseAndLoadImgData()
  }

  parseAndLoadImgData(){
    let qrstr = this.successString;
    this.successString = undefined;
    let qrCodeParts = qrstr?.split('*');
    let dateDay = qrCodeParts![2];
    let dateTime = qrCodeParts![3];
    let price = +qrCodeParts![4];
    let date = new Date(dateDay);
    let hours = +dateTime.split(':')[0];
    let minutes = +dateTime.split(':')[1];
    let seconds = +dateTime.split(':')[2];
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    this.productDateControl.setValue(date)
    this.productPriceControl.setValue(price);
  }

  imageScanError = (msg: string) => {
    this.scan = 'error';
    this.scanMsg = 'No QR code was scaned.Try again with another image.';
  }

  switchCamera() {
    if (this.camerascan) {
      this.qrScan.switchCamera();
      this.qrScan.stopScan((res) => {
        this.qrScan.startScan(
          this.imageScanSuccess,
          this.imageScanError,
          this.imageScanError
        )
      })
    }else{
      this.qrScan.switchCamera();
    }
  }

  displayLocationsFn(location: string): string {
    return location ? location : '';
  }

  getSuggestions(){
    this.suggestionAPI.getTags().subscribe((data:any)=>{
      this.allTags = data.data
    },(err)=>{
      console.log(err);
    })
    this.suggestionAPI.getLocations().subscribe((data:any)=>{
      this.locationOptions = data.data
    },(err)=>{
      console.log(err);
    })
  }

  locationOptions: string[] = [];
  filteredLocationsOptions?: Observable<string[]>;

  private _filterLocations(name: string): string[] {
    const filterValue = name.toLowerCase();
    return this.locationOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  ngAfterViewInit(): void {
    this.getSuggestions()
    this.filteredLocationsOptions = this.productLocationControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.name)),
      map(name => (name ? this._filterLocations(name) : this.locationOptions.slice())),
    );
    this.qrScan.getPermissionAndComareId()
    const fileinput = document.getElementById('qr-input-file') as HTMLInputElement;
    fileinput.addEventListener('change', (e: any) => {
      if (e.target!.files.length == 0) {
        // No file selected, ignore 
        return;
      }
      const imageFile = e.target.files[0];
      // Scan QR Code
      this.qrScan.scanImage(imageFile,
        this.imageScanSuccess,
        this.imageScanError
      )
    });
  }

  uploadImg() {

  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value&&!this.tags.includes(value)) {
      this.tags.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
    this.tagsCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.tags.indexOf(fruit);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if(!this.tags.includes(event.option.viewValue)){
      this.tags.push(event.option.viewValue);
    }
    this.tagInput.nativeElement.value = '';
    this.tagsCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(tag => tag.toLowerCase().includes(filterValue));
  }

  addExpense() {
    if(
      this.productLocationControl.value&&
      this.productLocationControl.value!=''&&
      !this.locationOptions.includes(this.productLocationControl.value.toLocaleLowerCase())
      ){
        this.suggestionAPI.addLocation(this.productLocationControl.value).subscribe((res)=>{
          console.log(res);
        },(err)=>{
          console.log(err);
        })
    }
    if(
      this.tags.length>0
      ){
        this.tags.forEach((tag)=>{
          if(tag!=''&&tag&&!this.allTags.includes(tag.toLocaleLowerCase())){
            this.suggestionAPI.addTag(tag).subscribe((res)=>{
              console.log(res);
            },(err)=>{
              console.log(err);
            })
          }
        })
    }
    this.getSuggestions();
    this.expenses.push({
      'date': this.productDateControl.value.getTime(),
      'place': this.productLocationControl.value || 'Not specified.',
      'price': this.productPriceControl.value,
      'product_name': this.productNameControl.value,
      'tags': JSON.stringify(this.tags)
    })
    /* this.productDateControl.setValue(null)
    this.productLocationControl.setValue(null)
    this.productPriceControl.setValue(null)
    this.productNameControl.setValue(null)
    this.tags = []  */
  }

  submitExpenses() {
    let expenses = this.expenses
    this.expenses = []
    let group = this.groupService.selectedGroup

    let added:number = 0

    let allAddedChack = ()=>{
      added++;
      if(added == expenses.length){
        this.all_added = true;
        setTimeout(()=>{
          this.all_added = false;
        },3000)
      }
    }
    expenses.forEach((exp)=>{
      this.groupsAPI.addExpenseToGroup({
        group_id:group?.id!,
        group_name:group?.name!,
        product_name:exp.product_name,
        price:exp.price,
        place:exp.place,
        tags:exp.tags,
        date:exp.date,
        should_track:true
      }).subscribe((res)=>{
        allAddedChack()
        console.log(res);
      },(err)=>{
        console.log(err);
      })
    })
    this.groupService.refreshGroupData().then(()=>{
      console.log('group data refreshed');
    })
  }
}
