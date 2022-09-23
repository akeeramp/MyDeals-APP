import { Component, Input, AfterViewInit } from '@angular/core';
import { FilterDescriptor } from '@progress/kendo-data-query';
import { FilterService } from '@progress/kendo-angular-grid';
import * as _ from 'underscore';

@Component({
    selector: 'dropDown-filter',
    template: `
    <kendo-dropdownlist [textField]="textField"
        [valueField]="valueField" [data]="data" [value]="selectedValue" (valueChange)="onSelectionChange(valueAccessor($event))">
    </kendo-dropdownlist>
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

    private currentData: any;
    private value: any[] = [];

    protected valueAccessor = (dataItem: any) => this.isPrimitive ? dataItem : dataItem[this.valueField];    

    onSelectionChange(item) {
        if (!this.value.some(x => x.Value === item)) {
            this.value.push(item);
        }
        let filter = [];
        if (item == null) {
            this.operator = "isnull";
        } else if (item != undefined && item == "") {
            this.operator = "isempty";
        }
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
            const valuesel = this.data.filter(x => x.Value == this.value[0]);
            this.selectedValue = valuesel[0];
        }
    }

    ngAfterViewInit() {
        this.currentData = this.data;
        this.value = this.currentFilter.filters.map((f: FilterDescriptor) => f.value);
        if (this.value != undefined && this.value != null && this.value.length > 0) {
            const valuesel = this.data.filter(x => x.Value == this.value[0]);
            this.selectedValue = valuesel[0];
        }
    }
}