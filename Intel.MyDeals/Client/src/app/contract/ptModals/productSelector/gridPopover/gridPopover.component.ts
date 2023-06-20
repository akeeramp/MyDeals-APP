import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { process, State } from "@progress/kendo-data-query";
import { CurrencyPipe } from '@angular/common';
import { logger } from "../../../../shared/logger/logger";
import { productSelectorService } from '../productselector.service';
import { ProductBreakoutComponent } from '../productBreakout/productBreakout.component';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'grid-popover [popOver] [columnTypes] [currentPricingTableRow] [productMemberSId] [priceCondition]',
    templateUrl: 'Client/src/app/contract/ptModals/productSelector/gridPopover/gridPopover.component.html',
    styleUrls: [
        'Client/node_modules/bootstrap/dist/css/bootstrap.min.css',
        'Client/src/app/admin/kendo_grid.css',
        'Client/node_modules/@progress/kendo-theme-bootstrap/dist/all.css',
        'Client/src/app/contract/ptModals/productSelector/gridPopover/gridPopover.component.css'
    ]
})
export class GridPopoverComponent implements OnInit {

    constructor(public dialogService: MatDialog, private currencyPipe: CurrencyPipe,
        private productSelectorService: productSelectorService,
        private loggerService: logger) { }

    @Input() private popOver: NgbPopover;   // Required (for Breakout modal)

    @Input() private columnTypes: string;  // Required
    @Input() private currentPricingTableRow;    // Required
    @Input() private productMemberSId;  // Required
    @Input() private priceCondition;    // Required
    private productData;

    private openModal() {
        // Close Popover
        if (this.popOver.isOpen()) {
            this.popOver.close();
        }

        // Open Modal with data
        this.dialogService.open(ProductBreakoutComponent, {
            data: {
                columnTypes: this.columnTypes,
                productData: this.productData
            },
            panelClass: 'product-breakout-modal-gridPopOver'
        });
    }

    private initializeGridOptions() {
        if (!this.popOver) {
            this.loggerService.error('GridPopoverComponent:: ', 'Input Variable', new TypeError("Input variable `popOver` is required"));
        } else if (!this.columnTypes) {
            this.loggerService.error('GridPopoverComponent:: ', 'Input Variable', new TypeError("Input variable `columnTypes` is required"));
        } else if (!this.currentPricingTableRow) {
            this.loggerService.error('GridPopoverComponent:: ', 'Input Variable', new TypeError("Input variable `currentPricingTableRow` is required"));
        } else if (!this.productMemberSId) {
            this.loggerService.error('GridPopoverComponent:: ', 'Input Variable', new TypeError("Input variable `productMemberSId` is required"));
        } else if (!this.priceCondition) {
            this.loggerService.error('GridPopoverComponent:: ', 'Input Variable', new TypeError("Input variable `priceCondition` is required"));
        } else {
            this.gridOptions = {
                dataSource: this.dataSource,
                sortable: true,
                columns: this.columnTypes == "CAP" ? this.capColumns : this.ycs2Columns
            };

            this.productData = [{
                'CUST_MBR_SID': this.currentPricingTableRow.CUST_MBR_SID,
                'PRD_MBR_SID': this.productMemberSId,
                'GEO_MBR_SID': this.currentPricingTableRow.GEO_COMBINED,
                'DEAL_STRT_DT': this.currentPricingTableRow.START_DT,
                'DEAL_END_DT': this.currentPricingTableRow.END_DT,
                'getAvailable': 'N',
                'priceCondition': this.priceCondition
            }];
        }
    }

    public isLoading = true;

    private readonly capColumns = [
        { field: "CAP", title: "CAP", template: "#= isNaN(CAP) ? CAP : kendo.toString(parseFloat(CAP), 'c') #" },
        { field: "Level4", title: "Deal Product Name", template: " #= kendo.toString(Level4) #" },
        { field: "GEO_MBR_SID", title: "GEO" },
        { field: "CAP_START", title: "Start Date", template: "#= kendo.toString(new Date(CAP_START), 'M/d/yyyy') #" },
        { field: "CAP_END", title: "End Date", template: " #= kendo.toString(new Date(CAP_END), 'M/d/yyyy') #" }
    ];

    private readonly ycs2Columns = [
        { field: "YCS2", title: "YCS2", template: "#= isNaN(YCS2) ? YCS2 : kendo.toString(parseFloat(YCS2), 'c') #" },
        { field: "GEO_MBR_SID", title: "GEO" },
        { field: "SOLD_TO_ID", title: "Sold To Id", template: " #= kendo.toString(SOLD_TO_ID) #" },
        { field: "Level4", title: "Deal Product Name", template: " #= kendo.toString(Level4) #" },
        { field: "MTRL_ID", title: "Material Id", template: " #= kendo.toString(MTRL_ID) #" },
        { field: "YCS2_START", title: "Start Date", template: "#= kendo.toString(new Date(YCS2_START), 'M/d/yyyy') #" },
        { field: "YCS2_END", title: "End Date", template: " #= kendo.toString(new Date(YCS2_END), 'M/d/yyyy') #" }
    ];

    private responseData = [];
    private state: State = {
        skip: 0,
        group: [],
        filter: {
            logic: "and",
            filters: []
        }
    };

    public dataSource = process(this.responseData, this.state);
    public gridOptions; // Defined in `ngOnInit()` due to `columnTypes` variable being passed

    private getData(cellProductData) {
        if (!!cellProductData && cellProductData.length === 1) {
            this.isLoading = true;
            this.productSelectorService.GetProductCAPYCS2Data(cellProductData[0].getAvailable,
                    cellProductData[0].priceCondition,
                    cellProductData).subscribe((response) => {
                        this.responseData = response;
                        this.dataSource = process(this.responseData, this.state);
                        this.responseData.forEach((row) => {
                            if (row.CAP != undefined && row.CAP != '' && row.CAP != 'No CAP') {
                                row.CAP = this.currencyPipe.transform(row.CAP, 'USD', 'symbol', '1.2-2');
                            }
                        })
                this.isLoading = false;
                return this.responseData;
            }, (error) => {
                this.loggerService.error('GridPopoverComponent::getData::', error);
            });
        }
    }
    
    ngOnInit(): void {
        this.initializeGridOptions();
        this.getData(this.productData);
    }

}