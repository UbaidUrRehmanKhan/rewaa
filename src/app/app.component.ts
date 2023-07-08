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
  myForm: FormGroup;
  totalSectionExpanded: Boolean = false;
  totalCostWithoutTax = 0;
  totalTax = 0;

  taxCodes = [
    { id: 1, name: 'No Tax' },
    { id: 2, name: 'Value Added Tax' }
  ]

  @ViewChild(NgSelectComponent) ngSelectComponent!: NgSelectComponent;

  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.myForm = new FormGroup({
      rows: this.fb.array([])
    });
  }
  ngOnInit() {
    const result = this.dataService.getData();
    for (let i = 0; i < result.length; i++) {
      const currentObject = result[i];
      const concatenatedValue = currentObject.id + ' ' + currentObject.name;
      const newObject = { ...currentObject, concatenatedValue };
      this.items.push(newObject);
    }
    this.myForm?.get('rows')?.valueChanges.subscribe((value) => {
      this.totalCostWithoutTax = 0;
      this.totalTax = 0;
      for (let i = 0; i < (this.myForm?.get('rows') as FormArray).length; i++) {
        const itemFormGroup = (this.myForm.get('rows') as FormArray).at(i) as FormGroup;
        const cost = itemFormGroup.get('cost')?.value;
        const quantity = itemFormGroup.get('quantity')?.value;
        const taxCode = itemFormGroup.get('taxCode')?.value;
        if (taxCode == 1) {
          if (cost && quantity) {
            const total = cost * quantity;
            itemFormGroup.get('total')?.patchValue(total, { emitEvent: false });
            this.totalCostWithoutTax = this.totalCostWithoutTax + itemFormGroup.get('total')?.value;
            this.totalTax = this.totalTax - itemFormGroup.get('tax')?.value;
            itemFormGroup.get('tax')?.setValue(0, { emitEvent: false });
            itemFormGroup.get('totalWithTax')?.setValue(0, { emitEvent: false });
          }
        } else {
          if (cost && quantity) {
            const total = cost * quantity;
            const tax = (15 / 100) * total;
            const totalWithTax = total + tax;
            itemFormGroup.get('total')?.setValue(total, { emitEvent: false });
            this.totalCostWithoutTax = this.totalCostWithoutTax + itemFormGroup.get('total')?.value
            itemFormGroup.get('tax')?.setValue(tax, { emitEvent: false });
            this.totalTax = this.totalTax + itemFormGroup.get('tax')?.value;
            itemFormGroup.get('totalWithTax')?.setValue(totalWithTax, { emitEvent: false });
          }
        }

      }
    });

  }

  textAreaValueLength() {
    return this.textAreaValue ? this.textAreaValue.length : 0;
  }

  get addDynamicRow() {
    return this.myForm.get('rows') as FormArray;
  }

  onAddRow(event: any) {
    (this.myForm.get('rows') as FormArray).push(this.createItemFormGroup(event));
  }

  onRemoveRow(rowIndex: number) {
    if ((this.myForm.get('rows') as FormArray).length == 1) {
      this.hasOrder = false;
      this.ngSelectComponent.clearModel()
    }
    (this.myForm.get('rows') as FormArray).removeAt(rowIndex);
  }

  toggleItem(item: any) {
    item.controls.expanded.value = !item.controls.expanded.value;
  }

  toggleTotalSection() {
    this.totalSectionExpanded = !this.totalSectionExpanded;
  }

  attachBorderBottomToRow(index: any, rowsLength: any) {
    return index != rowsLength - 1;
  }

  createItemFormGroup(event: any): FormGroup {
    return this.fb.group({
      name: event.name,
      id: event.id,
      quantity: null,
      cost: null,
      taxCode: 1,
      expanded: false,
      tax: 0,
      totalWithTax: 0,
      total: 0,
    });
  }

  convertToFormControl(absCtrl: AbstractControl | null): FormControl {
    const ctrl = absCtrl as FormControl;
    return ctrl;
  }

  getRowExpandedValue(row: any) {
    return row.controls.expanded.value;
  }

  rowTotalDetails(row: any) {
    return row.controls.total.value;
  }

  rowTotalWithTaxDetails(row: any) {
    return row.controls.totalWithTax.value ? row.controls.totalWithTax.value : row.controls.total.value;
  }

  rowTaxDetails(row: any) {
    return row.controls.tax.value;
  }

  rowItemsQuanity(row: any) {
    return row.controls.quantity.value ? row.controls.quantity.value : 0;
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
