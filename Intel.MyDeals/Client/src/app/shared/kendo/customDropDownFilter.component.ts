import { Component, Input, AfterViewInit } from '@angular/core';
import { FilterDescriptor } from '@progress/kendo-data-query';
import { FilterService } from '@progress/kendo-angular-grid';

@Component({
    selector: 'dropDown-filter',
    template: `
    <kendo-combobox class="drop-cus-filtersty" [textField]="textField"
        [valueField]="valueField" [data]="data" [value]="selectedValue" (valueChange)="onSelectionChange(valueAccessor($event))">
    </kendo-combobox>
  `,
    styles: []
})
export class CustomDropDownFilterComponent implements AfterViewInit {
    @Input() public isPrimitive: boolean;
    @Input() public currentFilter: any;
    @Input() public data;
    @Input() public textField;
    @Input() public valueField;
    @Input() public filterService: FilterService;
    @Input() public field: string;
    @Input() public operator: string;
    private selectedValue: any;
    private currentOperator: any;
    private currentData: any;
    private value: any[] = [];


    onSelectionChange(item) {
        if (!this.value.some(x => x.Value === item)) {
            this.value.push(item);
        }
        let filter = [];
        if (item == null) {
            this.operator = "isnull";
        } else if (item != undefined && item == "") {
            this.operator = "isempty";
        } else if (item) this.operator = this.currentOperator;
        filter.push({
            field: this.field,
            operator: this.operator,
            value: item
        })        
        this.filterService.filter({
            filters: filter,
            logic: 'or'
        });
        if (this.value != undefined && this.value != null && this.value.length > 0) {
            const valuesel = this.field == 'OBJ_SET_TYPE_CD' || this.field == 'WF_STG_CD' ? this.data.filter(x => x.Value == this.value[0]) : this.field == 'Customer_NM' ? this.data.filter(x => x.CUST_NM == this.value[0]) : this.data.filter(x => x.DROP_DOWN == this.value[0]);
            this.selectedValue = valuesel[0];
        }
    }

    ngAfterViewInit() {
        this.currentData = this.data;
        this.currentOperator = this.operator;
        this.value = this.currentFilter.filters.map((f: FilterDescriptor) => f.value);
        if (this.value != undefined && this.value != null && this.value.length > 0) {
            const valuesel = this.field == 'OBJ_SET_TYPE_CD' || this.field == 'WF_STG_CD' ? this.data.filter(x => x.Value == this.value[0]) : this.field == 'Customer_NM' ? this.data.filter(x => x.CUST_NM == this.value[0]) : this.data.filter(x => x.DROP_DOWN == this.value[0]);
            this.selectedValue = valuesel[0];
        }
    }

    valueAccessor(dataItem){
        if(dataItem!=undefined)
      return  this.isPrimitive ? dataItem : dataItem[this.valueField];
    }
}