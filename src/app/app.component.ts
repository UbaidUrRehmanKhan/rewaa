import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from './services/data.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, NgForm, AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'rewaa-assignment';
  textAreaValue: any;
  hasOrder: boolean = false;
  items: any = [];

  addForm: FormGroup;

  rows: FormArray;


  @ViewChild(NgSelectComponent) ngSelectComponent!: NgSelectComponent;

  constructor(private fb: FormBuilder, private dataService: DataService, private formBuilder: FormBuilder) {
    this.addForm = this.fb.group({
      items: [null, Validators.required],
      items_value: ['no', Validators.required]
    });
    this.rows = this.fb.array([]);
  }
  ngOnInit() {
    const result = this.dataService.getData();
    for (let i = 0; i < result.length; i++) {
      const currentObject = result[i];
      const concatenatedValue = currentObject.id + ' ' + currentObject.name;
      const newObject = { ...currentObject, concatenatedValue };
      this.items.push(newObject);
    }
  }

  textAreaValueLength() {
    return this.textAreaValue ? this.textAreaValue.length : 0;
  }

  get addDynamicRow() {
    return this.rows as FormArray;
  }

  onAddRow(event: any) {
    this.rows.push(this.createItemFormGroup(event));
  }

  onRemoveRow(rowIndex: number) {
    if (this.rows.length == 1) {
      this.hasOrder = false;
      this.ngSelectComponent.clearModel()
    }
    this.rows.removeAt(rowIndex);
  }

  toggleItem(item: any) {
    item.controls.expanded.value = !item.controls.expanded.value;
  }

  attachBorderBottomToRow(index: any, rows: any) {
    return index != rows.length - 1;
  }

  createItemFormGroup(event: any): FormGroup {
    return this.fb.group({
      name: event.name,
      id: event.id,
      quantity: null,
      cost: null,
      taxCode: null,
      expanded: false
    });
  }

  convertToFormControl(absCtrl: AbstractControl | null): FormControl {
    const ctrl = absCtrl as FormControl;
    return ctrl;
  }

  getExpandedValue(row: any) {
    return row.controls.expanded.value;
  }


  onSelectChange(event: any) {
    if (event) {
      console.log(event)
      this.hasOrder = true;
      this.onAddRow(event);
    }

    // this.ngSelectComponent.clearModel();
    // add new form group row
  }
}
