import { Component, Input, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { Observable } from "rxjs";
import { GridDataResult, PageChangeEvent, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State, GroupDescriptor } from "@progress/kendo-data-query";
import { ContractStatusBoardService } from "./contractStatusBoard.service";
import { arrayBuffer } from "stream/consumers";
import * as angular from "angular";
import { downgradeComponent } from "@angular/upgrade/static";


@Component({
    selector: "contract-status-board-angular",
    providers: [ContractStatusBoardService],
    templateUrl: "Client/src/app/core/gridStatusBoard/contractStatusBoard.component.html"
})

export class contractStatusBoardComponent implements OnInit {
    /**
   * The contract for which details are displayed
   */
    @Input() public contractGrid: any;

   
    
    
    public gridData: GridDataResult;
    public gridResult: Array<any>;
    public isLoading: boolean = true;
    public isLoaded: boolean = false;
    public sbData: Array<any> = [];
    public sbDataChildren: Array<any> = [];
    public CAN_VIEW_COST_TEST: boolean = this.contractDetailsService.chkDealRules('CAN_VIEW_COST_TEST', (<any>window).usrRole, null, null, null) || ((<any>window).usrRole === "GA" && (<any>window).isSuper); // Can view the pass/fail
    public CAN_VIEW_MEET_COMP: boolean = this.contractDetailsService.chkDealRules('CAN_VIEW_MEET_COMP', (<any>window).usrRole, null, null, null) && ((<any>window).usrRole !== "FSE"); // Can view meetcomp pass fail
    public skip = 0;
    public jumptoSummary = (<any>window).usrRole === "DA" ? "/summary" : "";
    public contractId : any;
    public state: State = {
        skip: 0,
        take: 10,
        group: [],
        // Initial filter descriptor
        filter: {
            logic: "and",
            filters: [],
        },
    };
    public pageSizes: PageSizeItem[] = [
        {
            text: "10",
            value: 10,
        },
        {
            text: "25",
            value: 25,
        },
        {
            text: "50",
            value: 50,
        },
        {
            text: "100",
            value: 100,
        },
    ];
    constructor(private contractDetailsService: ContractStatusBoardService) {
    }

    public ngOnInit(): void {
        this.getContractDataSource();
    }

    getContractDataSource() {

        this.contractDetailsService.readContractStatus(this.contractGrid.CNTRCT_OBJ_SID)
            .subscribe((response) => {

                this.contractId = this.contractGrid.CNTRCT_OBJ_SID;
                this.sbData = this.init(response);
                this.sbDataChildren = this.sbData["children"];
                this.gridData = process(this.sbDataChildren, this.state);
                this.isLoaded = true;
                this.isLoading = true;
            });
    }

    

    gotoContractManager(id) {
        let lnk: any = "/Contract#/manager/" + id;
        if ((<any>window).usrRole === "DA") {
            lnk = "/Contract#/manager/" + id + "/summary";
        }

        
        window.open(lnk, '_blank');
    }

    recurCalcData(data: Array<any>, defStage: string) {

        let ret = [];
        let next = "";
        for (let i = 0; i < data.length; i++) {
            //vaet next = "";r results = ["Pass", "Fail", "InComplete", "NA"];
            let titleCd = "TITLE";

            if (data[i]["dc_type"] === "CNTRCT") {
                next = "PRC_ST";
                defStage = "InComplete";
            }
            var stg = !data[i]["WF_STG_CD"] ? defStage : data[i]["WF_STG_CD"];
            ret.push({
                "id": data[i]["DC_ID"],
                "name": data[i][titleCd],
                "obj": this.getObjType(data[i]["dc_type"]),
                "type": data[i]["OBJ_SET_TYPE_CD"],
                "stage": stg,
                "valid": data[i]["PASSED_VALIDATION"],
                "mct": data[i]["MEETCOMP_TEST_RESULT"],
                "pct": data[i]["COST_TEST_RESULT"],
                "children": data[i][next] === undefined ? [] : this.recurCalcData(data[i][next], stg)
            });
        }

        return ret;
    }

    getObjType(obj: string): string {
        if (obj === "CNTRCT") return "Contract";
        if (obj === "PRC_ST") return "Pricing Strategy";
        if (obj === "PRC_TBL") return "Pricing Table";
        if (obj === "PRC_TBL_ROW") return "Pricing Table Product";
        if (obj === "WIP_DEAL") return "WIP Deal";
        return "";
    }

    init(responseData) {

        let data = this.recurCalcData(responseData, "InComplete")[0];

        if (data === undefined || data === null) {
            data = [];
        } else {
            this.refreshGrid(data);
        }
        return data;
    }

    refreshGrid(d) {
        let d1 = [];
        if (d.children !== undefined) {
            for (let i = 0; i < d.children.length; i++) {
                d1.push({
                    "id": d.children[i].id,
                    "name": d.children[i].name,
                    "obj": d.children[i].obj,
                    "type": d.children[i].type,
                    "stage": d.children[i].stage,
                    "valid": d.children[i].valid,
                    "pct": d.children[i].pct,
                    "mct": d.children[i].mct
                });
            }
        }

        return d1;
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.sbDataChildren, this.state);
    }
}

angular.module("app").directive(
    "contractStatusBoardAngular",
    downgradeComponent({
        component: contractStatusBoardComponent
    })
);
