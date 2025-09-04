import { Component, Input, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { FilterService, SinglePopupService, PopupCloseEvent } from '@progress/kendo-angular-grid';


const closest = (node: any, predicate: any): any => {
    while (node && !predicate(node)) {
        node = node.parentNode;
    }

    return node;
};

@Component({
    selector: 'date-range-filter',
    template: `<div class="k-form">
    <label class="k-form-field">
        <kendo-dropdownlist
        [data]="listItems"
        textField="text"
        valueField="value"
        [(ngModel)]="selectedValue"
        [valuePrimitive]="true"
        (valueChange)="onFilterChange($event)"
        class="margin-bottom-five"
      >
      </kendo-dropdownlist>
        <kendo-datepicker (valueChange)="onselectedDateChange($event)" [navigation]="false"
            [(ngModel)]="selectedDate"  [popupSettings]="popupSettings">
        </kendo-datepicker>
    </label>
</div>`
})
export class CustomDateFilterComponent implements OnInit, OnDestroy {
    @Input() public filter: any;
    @Input() public filterService: FilterService;
    @Input() public field: string;

    constructor(private element: ElementRef,
        private popupService: SinglePopupService) {
        // Handle the service onClose event and prevent the menu from closing when the datepickers are still active.
        this.popupSubscription = popupService.onClose.subscribe((e: PopupCloseEvent) => {
            if (document.activeElement && closest(document.activeElement,
                node => node === this.element.nativeElement || (String(node.className).indexOf('date-range-filter') >= 0))) {
                e.preventDefault();
            }
        });
    }
    public selectedDate: any;
    public popupSettings: any = {
        popupClass: 'date-range-filter'
    };
    private popupSubscription: any;
    public listItems: Array<any> = [
        { text: "Is equal", value: 'eq' },
        { text: "Is after", value: 'gt' },
        { text: "Is before", value: 'lt' },
        { text: "Is after or equal", value: 'gte' },
        { text: "Is before or equal", value: 'lte' },
        
    ];

    public selectedValue = "gte";

    public ngOnInit(): void {
        const filter= this.findValue();
        if(filter){
            this.selectedDate=filter.value;
            this.selectedValue=filter.operator;
        }
    }

    public ngOnDestroy(): void {
        this.popupSubscription.unsubscribe();
    }

    public onselectedDateChange(value: any): void {
        this.filterRange(value);
    }
    public onFilterChange(obj:any,){
        this.filterRange(this.selectedDate);
        }

    private findValue() {
      const filter = this.filter.filters.filter(x => x.field === this.field)[0];
      return filter ? filter : null;
    }

    private filterRange(selectedDate) {
        const filters = [];

        if (selectedDate) {
            const filterValue = selectedDate;
            // handle different comparison operators
            if (this.selectedValue === 'eq') {
                // Equal to: check entire day
                const selectedDateOfDay = new Date(filterValue);
                selectedDateOfDay.setHours(0, 0, 0, 0);

                const endOfDay = new Date(filterValue);
                endOfDay.setHours(23, 59, 59, 999);

                filters.push({
                    field: this.field,
                    operator: 'gte',
                    value: selectedDateOfDay
                });
                filters.push({
                    field: this.field,
                    operator: 'lte',
                    value: endOfDay
                });
            } else if (this.selectedValue === 'lte') {
                // Less than or equal: end of selected day
                const endOfDay = new Date(filterValue);
                endOfDay.setHours(23, 59, 59, 999);

                filters.push({
                    field: this.field,
                    operator: 'lte',
                    value: endOfDay
                });
            } else {
                // For 'gt','gte' and 'lt', use as-is
                filters.push({
                    field: this.field,
                    operator: this.selectedValue,
                    value: filterValue
                });
            }

            this.selectedDate = selectedDate;
        }

        this.filterService.filter({
            logic: "and",
            filters: filters
        });
    }
}