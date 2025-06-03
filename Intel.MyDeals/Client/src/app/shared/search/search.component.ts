import { Component, EventEmitter, Input, Output, OnDestroy } from "@angular/core";
import { Item } from "@progress/kendo-angular-charts/common/collection.service";
import { MomentService } from "../../shared/moment/moment.service";
import { contractStatusWidgetService } from "../../dashboard/contractStatusWidget.service";
import { logger } from "../logger/logger";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: 'app-search',
    templateUrl: 'Client/src/app/shared/search/search.component.html',
    styleUrls: ['Client/src/app/shared/search/search.component.css'],
})
export class SearchComponent implements OnDestroy {
    private startDateValue: Date;
    private endDateValue: Date;
    private showSearchFilters: boolean = true;
    private showGrid: boolean = false;
    public fruits: Array<string> = ['Apple', 'Orange', 'Banana'];
    public custData: any;
    public selectedCustNames: Item[];
    public selectedCustomerIds = [];
    public UItemplate = null;
    public c_Id: number = 0;
    public ps_Id: number = 0;
    public pt_Id: number = 0;
    public searchText: string = "";
    public contractData: []; 

    @Input() title: string = " ";
    @Input() titleText: string = " ";
    @Output() isDirty = new EventEmitter();
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();

    constructor(protected cntrctWdgtSvc: contractStatusWidgetService,
                protected loggerSvc: logger,
                private momentService: MomentService) { }
    ngOnInit(): void {
        this.showSearchFilters = false;
        this.selectedCustNames = window.localStorage.selectedCustNames ? JSON.parse(window.localStorage.selectedCustNames) : [];
        this.startDateValue = window.localStorage.startDateValue && window.localStorage.startDateValue != "null" ? new Date(window.localStorage.startDateValue) : new Date(this.momentService.moment().subtract(6, 'months').format("MM/DD/YYYY"));
        this.endDateValue = window.localStorage.endDateValue && window.localStorage.endDateValue != "null" ? new Date(window.localStorage.endDateValue) : new Date(this.momentService.moment().add(6, 'months').format("MM/DD/YYYY"));


        this.cntrctWdgtSvc.getCustomerDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: Array<any>) => {
                if (response && response.length > 0) {
                    this.custData = response;
                }
                else {
                    this.loggerSvc.error("No result found.", 'Error');
                }
            }, function (error) {
                this.loggerSvc.error("Unable to get Dropdown Customers.", error, error.statusText);
            });
    }

    onCustomerChange(custData) {
        this.isDirty.emit(true);
        window.localStorage.selectedCustNames = JSON.stringify(custData);
    }

    onDateChange(value, dateChanged) {
        this.isDirty.emit(true);
        if (value && value != null && value != '') {
            if (dateChanged == "startDateChange") {
                window.localStorage.startDateValue = value;
            }
            else if (dateChanged == "endDateChange") {
                window.localStorage.endDateValue = value;
            }
        }
    }
    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}