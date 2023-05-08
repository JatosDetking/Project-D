import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { QrCodeScannerService } from 'src/app/services/qr-code-scanner.service';
import { SuggestionsService } from 'src/app/api/suggestions.service';
import { GroupsApiService } from 'src/app/api/groups-api.service';
import { GroupService } from 'src/app/services/group.service';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Expense } from 'src/app/interfaces/expense';
import { Group } from 'src/app/interfaces/group';

@Component({
  selector: 'app-edit-expense',
  templateUrl: './edit-expense.component.html',
  styleUrls: ['./edit-expense.component.scss']
})
export class EditExpenseComponent implements AfterViewInit {

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
  spinner = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsCtrl = new FormControl('');
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  allTags: string[] = [];
  filteredLocationsOptions?: Observable<string[]>;

  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;
  @ViewChild('picker') picker!: ElementRef<HTMLInputElement>;

  constructor(
    public qrScan: QrCodeScannerService,
    public suggestionAPI: SuggestionsService,
    public groupsAPI: GroupsApiService,
    public groupService: GroupService,
    public dialogRef: MatDialogRef<EditExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { expense: Expense, group: Group },
  ) {
    this.filteredTags = this.tagsCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice())),
    );
  }

  ngOnInit(): void {
  }

  editExpense() {
    this.spinner = true;
    if (
      this.productLocationControl.value &&
      this.productLocationControl.value != '' &&
      !this.locationOptions.includes(this.productLocationControl.value.toLocaleLowerCase())
    ) {
      this.suggestionAPI.addLocation(this.productLocationControl.value).subscribe((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      })
    }
    if (
      this.tags.length > 0
    ) {
      this.tags.forEach((tag) => {
        if (tag != '' && tag && !this.allTags.includes(tag.toLocaleLowerCase())) {
          this.suggestionAPI.addTag(tag).subscribe((res) => {
            console.log(res);
          }, (err) => {
            console.log(err);
          })
        }
      })
    }
    this.getSuggestions();
    this.groupsAPI.editExpenseInGroup(this.data.expense.id!,{
      'date': this.productDateControl.value.getTime(),
      'place': this.productLocationControl.value || 'Not specified.',
      'price': this.productPriceControl.value,
      'product_name': this.productNameControl.value,
      'tags': this.tags,
      "group_id":this.data.group.id,
      "group_name":this.data.group.name,
      "should_track":true,
    },this.data.group).subscribe((res)=>{
      this.spinner = false;
      console.log(res);
      this.dialogRef.close(true)
    },(err)=>{
      this.spinner = false;
      console.log(err);
    })
    /* this.groupsAPI.editGroupUsers
    
    this.expenses.push({
      'date': this.productDateControl.value.getTime(),
      'place': this.productLocationControl.value || 'Not specified.',
      'price': this.productPriceControl.value,
      'product_name': this.productNameControl.value,
      'tags': JSON.stringify(this.tags)
    }) */
    /* this.productDateControl.setValue(null)
    this.productLocationControl.setValue(null)
    this.productPriceControl.setValue(null)
    this.productNameControl.setValue(null)
    this.tags = []  */
  }
  locationOptions: string[] = [];
  getSuggestions() {
    this.suggestionAPI.getTags().subscribe((data: any) => {
      this.allTags = data.data
    }, (err) => {
      console.log(err);
    })
    this.suggestionAPI.getLocations().subscribe((data: any) => {
      this.locationOptions = data.data
    }, (err) => {
      console.log(err);
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value && !this.tags.includes(value)) {
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
    if (!this.tags.includes(event.option.viewValue)) {
      this.tags.push(event.option.viewValue);
    }
    this.tagInput.nativeElement.value = '';
    this.tagsCtrl.setValue(null);
  }

  displayLocationsFn(location: string): string {
    return location ? location : '';
  }

  ngAfterViewInit(): void {
    this.getSuggestions()
    this.filteredLocationsOptions = this.productLocationControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.name)),
      map(name => (name ? this._filterLocations(name) : this.locationOptions.slice())),
    );
    this.productNameControl.setValue(this.data.expense.product_name);
    this.productDateControl.setValue(new Date(this.data.expense.date));
    this.productPriceControl.setValue(this.data.expense.price);
    this.productLocationControl.setValue(this.data.expense.place);
    this.tags = this.data.expense.tags
  }

  private _filterLocations(name: string): string[] {
    const filterValue = name.toLowerCase();
    return this.locationOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(tag => tag.toLowerCase().includes(filterValue));
  }
}
