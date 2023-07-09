import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormArray, FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [ReactiveFormsModule, FormsModule, NgSelectModule, HttpClientModule],
      providers: [
        provideToastr()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should add an item to the form array', () => {
    component.onAddRow({ id: 1, name: 'Iphone' });
    const itemsFormArray = component.myForm.get('rows') as FormArray;
    expect(itemsFormArray.length).toBe(1);
  });

  it('should remove an item from the form array', () => {
    component.onAddRow({ id: 1, name: 'Iphone' });
    component.onRemoveRow(0);
    const itemsFormArray = component.myForm.get('rows') as FormArray;
    expect(itemsFormArray.length).toBe(0);
  });

  it('should submit the form group successfully', () => {

    const myForm = component.myForm as FormGroup
    myForm.controls['supplierName'].setValue('Ubaid');
    myForm.controls['supplierLocation'].setValue('Multan');
    myForm.controls['amountPaid'].setValue(1000);
    myForm.controls['paymentMethod'].setValue('Cash');
    component.onAddRow({ id: 1, name: 'Iphone' });
    const itemsFormArray = component.myForm.get('rows') as FormArray;
    const itemFormGroup = itemsFormArray.at(0) as FormGroup;
    itemFormGroup.controls['cost'].setValue(10);
    itemFormGroup.controls['quantity'].setValue(5);

    spyOn(console, 'log');
    component.formSubmit();
    expect(console.log).toHaveBeenCalledWith('Form array submitted successfully');
  });

});
