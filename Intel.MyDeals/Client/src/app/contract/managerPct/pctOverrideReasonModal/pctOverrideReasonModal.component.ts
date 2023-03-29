import { Component,Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataStateChangeEvent, GridDataResult, PageSizeItem } from "@progress/kendo-angular-grid";
import { logger } from "../../../shared/logger/logger";
import { managerPctservice } from "../managerPct.service";
import { MomentService } from "../../../shared/moment/moment.service";
import { process, State } from "@progress/kendo-data-query";

@Component({
    selector: "pct-override-reason-dialog",
    templateUrl: "Client/src/app/contract/managerPct/pctOverrideReasonModal/pctOverrideReasonModal.component.html",
    styleUrls: ['Client/src/app/contract/managerPct/pctOverrideReasonModal/pctOverrideReasonModal.component.css'],
    //Added the below line to remove extra padding which is present for the default mat dialog container
    //To override the default css for the mat dialog and remove the extra padding then encapsulation should be set to none 
    encapsulation: ViewEncapsulation.None
})
export class pctOverrideReasonModal {
    constructor(public dialogRef: MatDialogRef<pctOverrideReasonModal>,
                @Inject(MAT_DIALOG_DATA) public data,
                private managePctSvc: managerPctservice,
                private loggerSvc: logger,
                private momentService: MomentService) {}
    private state: State = {
        skip: 0,
        take: 25,
        group: [],
        filter: {
            logic: "and",
            filters: [],
        }
    }
    private pageSizes: PageSizeItem[] = [
        {
            text: "10",
            value: 10
        },
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
        }
    ];
    public gridData: GridDataResult; 
    public curData: any;
    public dataItem:any;
    private seeMore = false;
    public gridResult : any;
    extendedCols = ["MEET_COMP_PRD", "MEET_COMP_PRC", "BUSNS_OBJ", "PTNTL_MKT_IMPCT", "APRV_ATRNY", "DT_APRV"];
    private disabled: any;
    public isLoading: boolean;


    ngOnInit() {
        if (this.data.cellCurrValues !== "" && this.data.cellCurrValues !== undefined) {
            this.isLoading = true;
            this.dataItem = this.data.cellCurrValues;
            this.curData = this.dataItem.COST_TEST_OVRRD_CMT.split(",");
            this.disabled = this.dataItem?._readonly || (<any>window).usrRole === "Legal" ? "disabled" : "";
            this.getLegalExceptionsPctDetails(this.dataItem.DEAL_END_DT);
        }

    }
    getLegalExceptionsPctDetails(date){
        const formatedDate = this.momentService.moment(date).format("MM-DD-YYYY");
        this.managePctSvc.GetLegalExceptionsPct(formatedDate).subscribe(
            (response) => {
                for (var i = response.length - 1; i >= 0; i -= 1) {
                    response[i]["isSelected"] = this.curData.indexOf(response[i]["MYDL_PCT_LGL_EXCPT_SID"].toString()) >= 0;

                    // If not read only then remove the hidden exception
                    if (!response[i].isSelected && response[i].IS_DSBL) {
                        response.splice(i, 1);
                    }
                }
                this.gridResult = response;
                this.gridData = process(this.gridResult, this.state);
                this.isLoading = false;

            },
            function (response) {
                this.loggerSvc.error("Could not get legalException PCT data.", response, response.statusText);
            }
        )

    }
    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }
    ok(){
            let data = this.gridData.data;
            let rtnVal = [];
    
            for (let r = 0; r < data.length; r++) {
                if (data[r].isSelected) rtnVal.push(data[r].MYDL_PCT_LGL_EXCPT_SID);
            }
    
            if (rtnVal.length == 0) {
                // Nothing was selected
                this.dialogRef.close();
                return;
            }
    
            this.dataItem.COST_TEST_OVRRD_CMT = rtnVal.join(",");
    
            let newItem = {
                "CUST_NM_SID": this.dataItem.CUST_NM_SID,
                "DEAL_OBJ_TYPE_SID": 5,
                "DEAL_OBJ_SID": this.dataItem.DEAL_ID,
                "PRD_MBR_SIDS": this.dataItem.PRD_MBR_SIDS,
                "CST_OVRRD_FLG": 1,
                "CST_OVRRD_RSN": this.dataItem.COST_TEST_OVRRD_CMT
            };
            this.managePctSvc.setPctOverride(newItem).subscribe(
                (response) => {

                },
                function (response) {
                    this.loggerSvc.error("Could not override Data.", response, response.statusText);
                }
            )
            this.dialogRef.close(rtnVal);
        };

    cancel(){
        this.dialogRef.close();
    }
        
   toggleSee() {
      this.seeMore = !this.seeMore;
    }
}