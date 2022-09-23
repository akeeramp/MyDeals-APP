import { downgradeComponent } from "@angular/upgrade/static";
import { DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { distinct, process, State } from "@progress/kendo-data-query";
import { Component, Inject, Input } from "@angular/core";
import * as angular from "angular";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { logger } from "../../../shared/logger/logger";
import * as _ from 'underscore';
import { flexoverLappingcheckDealService } from "./flexOverlappingDealsCheck.service";
import { productSelectorService } from "../productSelector/productselector.service";
import { pricingTableEditorService } from "../../pricingTableEditor/pricingTableEditor.service";
import { PTE_Common_Util } from '../../PTEUtils/PTE_Common_util'


@Component({
    selector: "flexoverlappingCheckDeal",
    templateUrl: "Client/src/app/contract/ptModals/FlexOverlappingDealsCheck/flexOverlappingDealsCheck.component.html",
    styleUrls: ["Client/src/app/contract/ptModals/FlexOverlappingDealsCheck/flexOverlappingDealsCheck.component.css"],

})

export class FlexOverlappingCheckComponent {
    constructor(private flexoverLappingCheckDealsSvc: flexoverLappingcheckDealService,
        private loggerSvc: logger,
        private pteService: pricingTableEditorService,
        private prodSelSVC: productSelectorService,
        public dialogRef: MatDialogRef<FlexOverlappingCheckComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,) { }

    private state: State = {
        skip: 0,
        take: 25,
        group: [],
        // Initial filter descriptor
        filter: {
            logic: "and",
            filters: [],
        },
    };

    @Input() curPricingTable: any;
    @Input() pricingTableRowData: any;
    private reqBody: any;
    private ovlpResult: any[];
    private pageSizes: PageSizeItem[] = [
        {
            text: "25",
            value: 25
        },
        {
            text: "50",
            value: 50
        },
        {
            text: "100",
            value: 100
        },
        {
            text: "250",
            value: 250
        },
        {
            text: "500",
            value: 500
        }
    ];
    private gridData: any;
    private isLoading: boolean = false;
               
    closeWindow(): void {
        this.dialogRef.close();
    }
    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.ovlpResult, this.state);
    }
    distinctPrimitive(fieldName: string): any {
        let distinctData = distinct(this.ovlpResult, fieldName).map(item => item[fieldName]);
        distinctData.unshift('Select All');
        return distinctData;
    }
    getOverlapFlexResult() {
        let restrictGroupFlexOverlap = false;
        let OVLPFlexPdtPTRUSRPRDError = false;
        let ovlprslt = PTE_Common_Util.validateOVLPFlexProduct(this.data.PTR, undefined, true, this.curPricingTable, restrictGroupFlexOverlap, this.data.overlapFlexResult, OVLPFlexPdtPTRUSRPRDError);
        let updatedOvlpRslt = [];
        for (var j = 0; j < ovlprslt.length; j++) {
            for (var i = 0; i < this.data.PTR.length; i++) {
                if ((this.data.PTR[i].DC_ID == ovlprslt[j].ROW_ID) && this.data.PTR[i].TIER_NBR == '1') {
                    var temp = angular.copy(this.data.PTR[i]);
                    var tempOvlp = angular.copy(ovlprslt[j]);
                    tempOvlp["START_DT"] = temp.START_DT;
                    tempOvlp["END_DT"] = temp.END_DT;
                    var prdJSON = JSON.parse(temp.PTR_SYS_PRD);
                    for (var item in prdJSON) {
                        for (var m = 0; m < prdJSON[item].length; m++) {
                            if (prdJSON[item][m].PRD_MBR_SID == ovlprslt[j].PRD_MBR_SID) {
                                tempOvlp["HIER_VAL_NM"] = prdJSON[item][m].HIER_VAL_NM;
                            }
                        }
                    }
                    updatedOvlpRslt.push(tempOvlp);
                    break;
                }
            }
        }
        this.ovlpResult = updatedOvlpRslt;
        this.gridData = process(this.ovlpResult, this.state);
        this.isLoading = false;
    }
    ngOnInit() {
        this.isLoading = true;
        if (this.curPricingTable == undefined) { 
            this.curPricingTable = this.data.pricingTableData;
            this.pricingTableRowData = this.data.PTR;
        }
        this.state.group = [{ field: "OVLP_ROW_ID" }];
        this.getOverlapFlexResult();
    }

}





angular.module("app").directive(
    "flexoverlappingCheckDeal",
    downgradeComponent({
        component: FlexOverlappingCheckComponent,
    })
);