import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { distinct, filterBy, FilterDescriptor } from '@progress/kendo-data-query';
import { FilterService } from '@progress/kendo-angular-grid';
import * as _ from 'underscore';

@Component({
    selector: 'multicheck-filter',
    template: `
    <div *ngIf="showFilter" id="filterBar">
        <input id="multiCheckFilter" class="k-textbox" (input)="onInput($event)" placeholder="Search" />
        <span id="searchIcon" class="k-icon k-i-zoom"></span>
    </div>
    <cdk-virtual-scroll-viewport [itemSize]="7">
        <ul style="overflow:hidden">      
          <li #itemElement
            *cdkVirtualFor="let item of currentData; let i = index;"
            (click)="onSelectionChange(valueAccessor(item), itemElement)"
            [ngClass]="{'k-state-selected': isItemSelected(item)}">
            <input
              type="checkbox"
              id="chk-{{valueAccessor(item)}}"
              (focus)="onFocus(itemElement)"
              class="k-checkbox"
              [checked]="isItemSelected(item)" />
            <label
              class="k-multiselect-checkbox k-checkbox-label" style="white-space:break-spaces;"
              for="chk-{{valueAccessor(item)}}">
                {{ textAccessor(item) }}
            </label>
          </li>
        </ul>
    </cdk-virtual-scroll-viewport>
    <div id="selectedCount">{{selectedCount}} items selected</div>
  `,
    styles: [`
    #searchIcon{
        display:inline-block;
        left:200px;
        bottom:30px;
        text-align:center;
        vertical-align:middle;
        overflow:hidden;
    }
    #filterBar{
        margin-bottom: -15px;
    }
    #filterBar input{
        width:100%;
        margin-left:1px !important;
    }
    #multiCheckFilter.k-textbox {
        font-size:14px;
        font-weight:bold;
    }
    ul {
      list-style-type: none;
      padding-left: 0;
      padding-right: 12px;
      position: relative;
      overflow: hidden;
      overflow-x: hidden;
      white-space: nowrap;
      max-height: initial;
      margin-bottom: 5px;
    }

    ul>li{
        padding: 1px 12px;
    }

    #filterBar, #selectedCount {
      padding: 0px 5px;
    }    

    .k-multiselect-checkbox {
      pointer-events: none;
    }
   #selectedCount{
        font-weight:bold;
    }
    cdk-virtual-scroll-viewport.cdk-virtual-scroll-viewport ul {
        max-height: 200px!important;
        overflow: auto!important;
    }
    cdk-virtual-scroll-viewport {
        display: unset;
    }
  `]
})
export class MultiCheckFilterComponent implements AfterViewInit {
    @Input() public isPrimitive: boolean;
    @Input() public currentFilter: any;
    @Input() public data: any[];
    @Input() public textField;
    @Input() public valueField;
    @Input() public filterService: FilterService;
    @Input() public field: string;
    @Input() public operator: string;
    @Output() public valueChange = new EventEmitter<number[]>();

    public currentData: any[] = [];
    public showFilter = true;
    private value: any[] = [];
    private selectedCount: number = 0;

    protected textAccessor = (dataItem: any) => this.isPrimitive ? dataItem : dataItem[this.textField];
    protected valueAccessor = (dataItem: any) => this.isPrimitive ? dataItem : dataItem[this.valueField];

    public ngAfterViewInit() {
        //this code is to remove all falsy values
        this.currentData = _.compact(this.data);
        if (this.data.findIndex(x => x == '') > -1) this.currentData.push('');
        if (this.data.findIndex(x => x == null) > -1) this.currentData.push(null);
        this.currentData = _.sortBy(this.currentData);
        if (this.textField != undefined && this.textField != null && this.textField != '' && this.valueField != undefined && this.valueField != null && this.valueField != null) {
            if (this.data && this.data.length > 0 && this.data.filter(x => x[this.textField] == 'Select All').length == 0) {
                let selectAlldata: any = {};
                selectAlldata[this.textField] = 'Select All';
                selectAlldata[this.valueField] = 'Select All';
                this.currentData.unshift(selectAlldata);
            }
        }
        else {
            if (!this.data.includes('Select All'))
                this.currentData.unshift('Select All')
        }
        this.value = this.currentFilter.filters.map((f: FilterDescriptor) => f.value);
        if (this.currentData && this.currentData.length > 0) {
            this.showFilter = typeof this.textAccessor(this.currentData[0]) === 'string';
        }
        this.selectedCount = this.value && this.value.length > 0 ? this.value.length : 0;
        if (this.value.includes('Select All'))
            this.selectedCount--;
    }

    public isItemSelected(item) {
        return this.value.some(x => x === this.valueAccessor(item));
    }

    public onSelectionChange(item, li) {
        let filter = [];
        if (this.value.some(x => x === item)) {
            if (item == 'Select All') {
                this.value = [];
            }
            else
                this.value = this.value.filter(x => x !== item);
        } else {
            this.value.push(item);
        }
        if (this.value.includes('Select All') && item == 'Select All') {
            if (this.valueField != undefined && this.valueField != null && this.valueField != '')
                this.value = this.currentData.map(x => x[this.valueField]);
            else
                this.value = this.currentData;
        }
        if (this.value.includes('Select All') && item !== 'Select All') {
            this.value = this.value.filter(x => x !== 'Select All');
        }
        else if (!this.value.includes('Select All') && item !== 'Select All') {
            if (this.valueField != undefined && this.valueField != null && this.valueField != '') {
                if (this.value.length == this.currentData.filter(x => x[this.valueField] != 'Select All').length) {
                    this.value.push('Select All');
                }
            }
            else if (this.valueField == undefined || this.valueField == null || this.valueField == '') {
                if (this.value.length == this.currentData.filter(x => x != 'Select All').length) {
                    this.value.push('Select All');
                }
            }
        }
        _.each(this.value, itm => {
            let operator = 'eq';
            if (itm == null) {
                operator = "isnull";
            } else if (itm != undefined && itm.length == 0) {
                operator = "isempty";
            }
            filter.push({
                field: this.field,
                operator: operator,
                value: itm
            })
        });
        this.filterService.filter({
            filters: filter,
            logic: 'or'
        });
        this.onFocus(li);
        this.selectedCount = this.value && this.value.length > 0 ? this.value.length : 0;
        if (this.value.includes('Select All'))
            this.selectedCount--;
    }


    public onInput(e: any) {
        this.currentData = distinct([
            ...filterBy(this.data, {
                operator: 'contains',
                field: this.textField,
                value: e.target.value
            })],
            this.textField
        );
        if (e.target.value.length == 0) {
            if (this.textField != undefined && this.textField != null && this.textField != '' && this.valueField != undefined && this.valueField != null && this.valueField != null) {
                if (this.currentData && this.currentData.length > 0 && this.currentData.filter(x => x[this.textField] == 'Select All').length == 0) {
                    let selectAlldata: any = {};
                    selectAlldata[this.textField] = 'Select All';
                    selectAlldata[this.valueField] = 'Select All';
                    this.currentData.unshift(selectAlldata);
                }
            }
            else {
                if (!this.currentData.includes('Select All'))
                    this.currentData.unshift('Select All')
            }
        }
    }

    public onFocus(li: any): void {
        const ul = li.parentNode;
        const below = ul.scrollTop + ul.offsetHeight < li.offsetTop + li.offsetHeight;
        const above = li.offsetTop < ul.scrollTop;

        // Scroll to focused checkbox
        if (below || above) {
            ul.scrollTop = li.offsetTop;
        }
    }
}