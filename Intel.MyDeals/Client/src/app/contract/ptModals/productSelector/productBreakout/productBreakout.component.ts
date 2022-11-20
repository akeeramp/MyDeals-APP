import { Component, Inject, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { process, State } from "@progress/kendo-data-query";

import { logger } from "../../../../shared/logger/logger";
import { productSelectorService } from '../productselector.service';

@Component({
    selector: 'product-breakout',
    templateUrl: 'Client/src/app/contract/ptModals/productSelector/productBreakout/productBreakout.component.html',
    styleUrls: [
        'Client/node_modules/bootstrap/dist/css/bootstrap.min.css',
        'Client/node_modules/@progress/kendo-theme-bootstrap/dist/all.css',
        'Client/src/app/admin/kendo_grid.css',
        'Client/src/app/contract/ptModals/productSelector/productBreakout/productBreakout.component.css'
    ],
    encapsulation: ViewEncapsulation.Emulated
})
export class ProductBreakoutComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) private data,
            public dialogRef: MatDialogRef<ProductBreakoutComponent>,
            private productSelectorService: productSelectorService,
            private loggerService: logger) {
        // Dialog Input Data
        if (!data.columnTypes) {
            this.loggerService.error('ProductBreakoutComponent:: ', 'Input Variable', new TypeError("Input variable `columnTypes` is required"));
        } else if (!data.productData) {
            this.loggerService.error('ProductBreakoutComponent:: ', 'Input Variable', new TypeError("Input variable `productData` is required"));
        } else {
            this.columnTypes = data.columnTypes;
            this.productData = data.productData;    
        }
    }

    private columnTypes: string;  // Required
    private productData;    // Required

    private initializeGridOptions() {
        this.gridOptions = {
            dataSource: this.dataSource,
            sortable: true,
            resizable: true,
            excel: {
                fileName: this.columnTypes == "CAP" ? "CAP Breakup Deatils Export.xlsx" : "YCS2 Details Export.xlsx",
                filterable: true
            },
            columns: this.columnTypes == "CAP" ? this.capColumns : this.ycs2Columns
        };
    }

    public isLoading = true;

    private readonly capColumns = [
        { field: "HIER_VAL_NM", title: "Product", width: '11%' },
        { field: "Level4", title: "Deal Product Name", width: '20%', template: " #= kendo.toString(Level4) #" },
        { field: "CAP_START", title: "Date Range", width: '24%', template: "#= kendo.toString(new Date(CAP_START), 'M/d/yyyy') # - #= kendo.toString(new Date(CAP_END), 'M/d/yyyy') #" },
        { field: "GEO_MBR_SID", title: "GEO", width: '11%' },
        { field: "CUST_MBR_SID1", title: "SOLD TO", width: '11%'},
        { field: "CAP", title: "CAP", width: '11%' },
        { field: "CAP_PRC_COND", template: '<input type="checkbox" style="margin-top:2px;" disabled ng-checked="dataItem.CAP_PRC_COND == \'YCP1\'" />', title: 'YCP1', width: '11%' },
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

    private cancel() {
        this.dialogRef.close();
    }

    private getData(cellProductData) {
        if (!!cellProductData && cellProductData.length === 1) {
            this.isLoading = true;
            this.productSelectorService.GetProductCAPYCS2Data(cellProductData[0].getAvailable,
                    cellProductData[0].priceCondition,
                    cellProductData).subscribe((response) => {
                this.responseData = response;
                this.dataSource = process(this.responseData, this.state);
                this.isLoading = false;
                return this.responseData;
            }, (error) => {
                this.loggerService.error('ProductBreakoutComponent::getData:: Unable to get CAP Breakout data', error);
            });
        }
    }
    
    ngOnInit(): void {
        this.initializeGridOptions();
        this.getData(this.productData);
    }

}