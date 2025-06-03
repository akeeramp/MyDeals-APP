import { Component, Input, Output, EventEmitter, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { distinct, filterBy, FilterDescriptor } from '@progress/kendo-data-query';
import { FilterService } from '@progress/kendo-angular-grid';
import { each, compact, sortBy, filter } from 'underscore';

@Component({
    selector: 'multicheck-filter',
    template: `
    <div *ngIf="showFilter" id="filterBar">
        <input id="multiCheckFilter" class="k-textbox" (input)="onInput($event)" placeholder="Search" />
        <span id="searchIcon" class="k-icon k-i-zoom"></span>
    </div>
    <cdk-virtual-scroll-viewport [itemSize]="7" style="min-height: 200px;display: flex; align-item: center; justify-content: center;">
        <ul *ngIf="currentData && currentData.length > 0; else loader" style="overflow:hidden !important; max-width: 300px;">
            <li #itemElement *cdkVirtualFor="let item of currentData; let i = index;"
            (click)="onSelectionChange(valueAccessor(item), itemElement)"
            [ngClass]="{'k-state-selected': isItemSelected(item)}">
            <div class="k-form-field-checkbox-wrap">
                <input kendoCheckBox type="checkbox" id="chk-{{ valueAccessor(item) }}" (focus)="onFocus(itemElement)" [checked]="isItemSelected(item)" />
                <label class="k-multiselect-checkbox k-checkbox-label" for="chk-{{ valueAccessor(item) }}">{{ textAccessor(item) }}</label>
            </div>
            </li>
        </ul>
        <ng-template #loader>
        <div class="loader-wrapper">
          <span class="loader"></span>
          </div>
        </ng-template>
    </cdk-virtual-scroll-viewport>
    <div id="selectedCount">{{ selectedCount }} items selected</div>`,
    styles: [`
        #searchIcon {
            display: inline-block;
            left: 200px;
            bottom: 30px;
            text-align: center;
            vertical-align: middle;
            overflow: hidden;
        }

        #filterBar {
            margin-bottom: -15px;
        }

        #filterBar input {
            width: 100%;
            margin-left: 1px !important;
        }

        #multiCheckFilter.k-textbox {
            font-size: 14px;
            font-weight: bold;
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

        ul>li {
            padding: 1px 12px;
        }

        #filterBar,
        #selectedCount {
            padding: 0px 5px;
        }

        .k-multiselect-checkbox {
            pointer-events: none;
        }

        #selectedCount {
            font-weight: bold;
        }
        .loader-wrapper {
        height: 200px;
        display:flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        }
        .cdk-virtual-scroll-content-wrapper {
            min-width: 100%;
            min-height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        cdk-virtual-scroll-viewport.cdk-virtual-scroll-viewport ul li {
            word-wrap: break-word;
            width: 100%;
            max-width: 1000px;
        }

        .loader {
            width: 48px;
            height: 48px;
            border: 5px solid #FFF;
            border-bottom-color: #000;
            border-radius: 50%;
            display: inline-block;
            box-sizing: border-box;
            animation: rotation 1s linear infinite;
        }

        @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
        } 

        input.k-textbox {
            padding: .375rem .75rem;
            border-color: #ced4da;
            color: #495057;
            background: none;
            border-radius: .25rem;
            border-style: solid;
            border-width: 1px;
            box-shadow: none;
        }
    `]
})
export class MultiCheckFilterComponent implements OnChanges {
    @Input() public isPrimitive: boolean;
    @Input() public currentFilter: any;
    @Input() public data: any[] = [];
    @Input() public textField;
    @Input() public valueField;
    @Input() public filterService: FilterService;
    @Input() public field: string;
    @Input() public operator: string;
    @Output() public valueChange = new EventEmitter();

    public currentData: any[] = [];
    public compactData: any[] = [];
    public showFilter = true;
    private value: any[] = [];
    private selectedCount: number = 0;

    protected textAccessor = (dataItem: any) => this.isPrimitive ? dataItem : dataItem[this.textField];
    protected valueAccessor = (dataItem: any) => this.isPrimitive ? dataItem : dataItem[this.valueField];

    loadFilter() {
        //this code is to remove all falsy values
        this.currentData = compact(this.data);
        if (this.data.includes(0)) this.currentData.push(0);
        if (this.data.findIndex(x => x == '' && typeof x == 'string') > -1 && this.data.findIndex(x => x == undefined) == -1) {
            if (this.isPrimitive) this.currentData.push('');
            else this.currentData.push({
                'Text': '',
                'Value': ''
            });
        }
        if (this.data.findIndex(x => x == null) > -1 && this.data.findIndex(x => x == undefined) == -1) {
            if (this.isPrimitive) this.currentData.push(null);
            else this.currentData.push({
                'Text': 'null',
                'Value': null
            });
        };
        this.currentData = sortBy(this.currentData);
        if (this.textField != undefined && this.textField != null && this.textField != '' && this.valueField != undefined && this.valueField != null && this.valueField != null) {
            if (this.data && this.data.length > 0 && filter(this.data, (x) => { return x && x[this.textField] && x[this.textField] == 'Select All' }).length == 0) {
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
        this.compactData = [...this.currentData];
        this.value = this.currentFilter.filters.map((f: FilterDescriptor) => f.value);
        if (this.currentData && this.currentData.length > 0) {
            this.showFilter = typeof this.textAccessor(this.currentData[0]) === 'string';
        }
        if (this.compactData.length == 1) {
            this.value.push('Select All');
        }
        this.selectedCount = this.value && this.value.length > 0 ? this.value.length : 0;
        if (this.value.includes('Select All'))
            this.selectedCount--;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes["data"] && (changes["data"].firstChange || ((changes["data"].previousValue && changes["data"].previousValue.length == 0)) && changes["data"].currentValue.length > 0)) {
            if (this.data && this.data.length > 0) {
                this.loadFilter();
            }
            else {
                this.valueChange.emit();
            }
        }
    }

    //public ngAfterViewInit() {
    //    if (this.data.length > 0) {
    //        this.loadFilter();
    //    }
    //    else {
    //        this.valueChange.emit(25);
    //    }
    //}

    public isItemSelected(item) {
        return this.value.some(x => x === this.valueAccessor(item));
    }

    public onSelectionChange(item, li) {
        if (!(this.compactData.length == 1 && this.compactData[0].Text == 'Select All')) {
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
                    this.value = this.compactData.map(x => x[this.valueField]);
                else
                    this.value = this.compactData;
            }
            if (this.value.includes('Select All') && item !== 'Select All') {
                this.value = this.value.filter(x => x !== 'Select All');
            }
            else if (!this.value.includes('Select All') && item !== 'Select All') {
                if (this.valueField != undefined && this.valueField != null && this.valueField != '') {
                    if (this.value.length == this.compactData.filter(x => x[this.valueField] != 'Select All').length) {
                        this.value.push('Select All');
                    }
                }
                else if (this.valueField == undefined || this.valueField == null || this.valueField == '') {
                    if (this.value.length == this.compactData.filter(x => x != 'Select All').length) {
                        this.value.push('Select All');
                    }
                }
            }
            each(this.value, itm => {
                let operator = 'eq';
                if (itm == null) {
                    operator = "isnull";
                } else if (itm != undefined && itm.length == 0) {
                    operator = "isempty";
                }
                if (itm != 'Select All') {
                    filter.push({
                        field: this.field,
                        operator: operator,
                        value: itm
                    });
                }
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