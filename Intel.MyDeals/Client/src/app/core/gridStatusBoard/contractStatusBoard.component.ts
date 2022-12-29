import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { ContractStatusBoardService } from "./contractStatusBoard.service";
import { logger } from "../../shared/logger/logger";

@Component({
    selector: "contract-status-board-angular",
    providers: [ContractStatusBoardService],
    templateUrl: "Client/src/app/core/gridStatusBoard/contractStatusBoard.component.html"
})

export class contractStatusBoardComponent implements OnInit {
    
    // The contract for which details are displayed
    @Input() public contractObjSid: any;
     //To load angular Contract Manager from deal desk change value to false, will be removed once contract manager migration is done
    @Input() angularEnabled:boolean=false;
    @Output() public isCntrctDtlLoaded :EventEmitter<boolean> = new EventEmitter();

    private gridData: GridDataResult;
    private gridResult: Array<any>;
    private isLoaded = false;
    private sbData: Array<any> = [];
    private sbDataChildren: Array<any> = [];
    private CAN_VIEW_COST_TEST: boolean = this.contractDetailsService.chkDealRules('CAN_VIEW_COST_TEST', (<any>window).usrRole, null, null, null) || ((<any>window).usrRole === "GA" && (<any>window).isSuper); // Can view the pass/fail
    private CAN_VIEW_MEET_COMP: boolean = this.contractDetailsService.chkDealRules('CAN_VIEW_MEET_COMP', (<any>window).usrRole, null, null, null) && ((<any>window).usrRole !== "FSE"); // Can view meetcomp pass fail
    private skip = 0;
    //DA - allowing to access contract/Tender manager screen
    //private jumptoSummary = (<any>window).usrRole === "DA" ? "/summary" : "";
    private contractId : any;
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
    constructor(private contractDetailsService: ContractStatusBoardService,private loggerSvc:logger) {
    }

    
    getContractDataSource() {
        this.isLoaded = false;
        this.isCntrctDtlLoaded.emit(false);
        this.contractDetailsService.readContractStatus(this.contractObjSid)
            .subscribe((response) => {

                this.contractId = this.contractObjSid;
                this.sbData = this.init(response);
                this.sbDataChildren = this.sbData["children"];
                this.gridData = process(this.sbDataChildren, this.state);
                this.isLoaded = true;
                this.isCntrctDtlLoaded.emit(true);
            },(err)=>{
                this.loggerSvc.error("Unable to get contract data", "Error",err);
            });
    }

    recurCalcData(data: Array<any>, defStage: string) {
        const ret = [];
        let next = "";
        for (let i = 0; i < data.length; i++) {
            const titleCd = "TITLE";
            if (data[i]["dc_type"] === "CNTRCT") {
                next = "PRC_ST";
                defStage = "InComplete";
            }
            const stg = !data[i]["WF_STG_CD"] ? defStage : data[i]["WF_STG_CD"];
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
        const d1 = [];
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
    public ngOnInit(): void {
        this.getContractDataSource();
    }
}
