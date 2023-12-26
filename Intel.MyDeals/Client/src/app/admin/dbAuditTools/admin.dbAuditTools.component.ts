import { Component, OnDestroy } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { GridDataResult, DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { orderBy, process, SortDescriptor, State } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";
import { MatDialog } from '@angular/material/dialog';
import { dbAuditToolsService } from "./admin.dbAuditTools.service";
import { constantsService } from "../constants/admin.constants.service";
import { DbAuditToolsViewModalComponent } from './admin.dbAuditToolsViewModal.component';
import { DbAuditToolsCompareModalComponent } from './admin.dbAuditToolsCompareModal.component';
import { forEach, uniq } from 'underscore';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "db-Audit-Tools",
    templateUrl: "Client/src/app/admin/dbAuditTools/admin.dbAuditTools.component.html",
    styleUrls: ['Client/src/app/admin/dbAuditTools/admin.dbAuditTools.component.css'],
})

export class dbAuditToolsComponent implements OnDestroy {
    constructor(
        private dbAuditToolsSVC: dbAuditToolsService,
        private loggerSvc: logger,
        private constantsService: constantsService,
        protected dialog: MatDialog
    ) { }
    private gridReturnsOrig = [];
    private gridReturns: GridDataResult;
    private dbAuditDataPacket = { TESTITEM: "This is a test", ENVIRONMENTS: [], DB_OBJECTS: [] };
    private dbAuditObjTextRequest = { ENV_NM: "", ENV_TAG: "", DB_TYPE: "", DB_OBJ: "", DB_DATA: "" };
    private dbAuditCompareRequest = [];

    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    // MIKES
    private envsDataFinal: any[] = []; // Final Envs list used in UI
    private selectedEnvValues: any[] = [];
    private objsData: any[] = [];
    private objsDataMapped: any[] = [];
    private objsDataFinal: any[] = []; // Final Objects list used in UI
    private selectedObjValues: any[] = [];
    public valueDepth = [1];
    public baseEnvName = "";

    public sort: SortDescriptor[] = [
        {
            field: "DB_OBJ",
            dir: "asc",
        }
    ];
    public parsedJson: any;  

    public ColumnHeader = [];
    public selectionIDs = [];
    public myGridData: GridDataResult;
    public state: State = {
        //skip: 0,
        //take: 25,
        //group: [],
        //filter: {
        //    logic: "and",
        //    filters: [
        //        {
        //            field: "ACTV_IND",
        //            operator: "eq",
        //            value: true
        //        },
        //    ],
        //}
    };

    accessAllowed = true; // Default to false to prevent unauthorized users

    checkPageAccess() {
        if (!(<any>window).isDeveloper) {
            this.accessAllowed = false;
        }
    }

    loadDBEnvs() {
        this.dbAuditToolsSVC.getDbEnvs().pipe(takeUntil(this.destroy$))
            .subscribe((result: Array<any>) => {
            let ReturnData = JSON.parse(result.toString());
            if (ReturnData.DATA != undefined) {
                this.envsDataFinal = ReturnData.DATA;
                this.baseEnvName = this.envsDataFinal.filter(x => x.IS_CURR_ENV === 1)[0].ENV_NM
            }
        }, (error) => {
            this.loggerSvc.error('Error in loading DB Audit Tools Environments Data', error);
        });
    }

    loadDBObjects() {
        this.dbAuditToolsSVC.getDbObjs().pipe(takeUntil(this.destroy$))
            .subscribe((result: Array<any>) => {
            let ReturnData = JSON.parse(result.toString());
            let ColumnData = ReturnData.DATA;
            if (ColumnData != undefined) {
                this.objsData = ColumnData.sort((a, b) => a.DB_OBJ.localeCompare(b.DB_OBJ));

                uniq(this.objsData.map(item => item.DB_TYPE)).sort().forEach(type => {
                    this.objsDataMapped.push({
                        categoryName: type,
                        subCategories: [...this.objsData.filter(item => item.DB_TYPE == type)]
                    })
                })

                this.objsDataFinal = this.objsDataMapped;
            }
        }, (error) => {
            this.loggerSvc.error('Error in loading DB Audit Tools Objects Data', error);
        });
    }

    runDbAuditNow() {
        if (this.selectedEnvValues.length == 0) {
            alert("You need to select some environments.");
            return;
        }

        this.dbAuditDataPacket.ENVIRONMENTS = this.selectedEnvValues.map(d => { return { "ENV_NM": d.ENV_NM, "ENV_TAG": d.ENV_TAG, "ENV_ORD": d.ENV_ORD } });
        this.dbAuditDataPacket.DB_OBJECTS = this.selectedObjValues.filter(a => a.subCategories == undefined)

        this.dbAuditToolsSVC.GetAuditData(this.dbAuditDataPacket).pipe(takeUntil(this.destroy$))
            .subscribe((result: Array<any>) => {
            let ReturnData = JSON.parse(result.toString());

            let tempEnvsOrder = ["DB_OBJ", "DB_TYPE"];
            tempEnvsOrder = tempEnvsOrder.concat(this.envsDataFinal.map((envObj) => { return envObj.ENV_NM; }));

            let tempColumnHeader = Object.keys(ReturnData.DATA[0]);
            let finalVer = [];
            tempEnvsOrder.forEach(a => {
                if (tempColumnHeader.includes(a)) finalVer.push(a)
            });

            this.ColumnHeader = finalVer;
            let ColumnData = ReturnData.DATA;
            if (ColumnData != undefined) {
                this.gridReturnsOrig = ColumnData;
                this.gridReturns = { data: orderBy(this.gridReturnsOrig, this.sort), total: this.gridReturnsOrig.length };
            }
            else {
                this.gridReturnsOrig = this.gridReturns = null; // Unsets Grid data
            }
        }, (error) => {
            this.loggerSvc.error('Error in returning DB Audit Report Data', error);
        });
    }

    performComparison(ProcName) {
        this.dbAuditCompareRequest = [];
        let selObj = this.selectedObjValues.findIndex(o => o.DB_OBJ === ProcName);
        this.selectedEnvValues.sort((a, b) => (a.ENV_ORD - b.ENV_ORD)).forEach(a => {
            let tempAuditObjTextRequest = { ENV_NM: "", ENV_TAG: "", DB_TYPE: "", DB_OBJ: "", DB_DATA: "" };

            tempAuditObjTextRequest.ENV_NM = a.ENV_NM;
            tempAuditObjTextRequest.ENV_TAG = a.ENV_TAG;
            tempAuditObjTextRequest.DB_TYPE = this.selectedObjValues[selObj].DB_TYPE;
            tempAuditObjTextRequest.DB_OBJ = this.selectedObjValues[selObj].DB_OBJ;
            tempAuditObjTextRequest.DB_DATA = this.selectedObjValues[selObj].DB_DATA;

            this.dbAuditCompareRequest.push(tempAuditObjTextRequest);
        });

        const dialogCompareRef = this.dialog.open(DbAuditToolsCompareModalComponent, {
            width: '75%',
            disableClose: false,
            data: { selectedProcName: ProcName, selectedDataInfoJson: this.dbAuditCompareRequest },
            panelClass: 'dbAuditTool-custom'
        });
        dialogCompareRef.afterClosed().subscribe(() => {
        });
    }

    GetBodyData(ProcName, env) {
        let selEnv = this.selectedEnvValues.findIndex(e => e.ENV_NM === env);
        let selObj = this.selectedObjValues.findIndex(o => o.DB_OBJ === ProcName);
        this.dbAuditObjTextRequest.ENV_NM = this.selectedEnvValues[selEnv].ENV_NM;
        this.dbAuditObjTextRequest.ENV_TAG = this.selectedEnvValues[selEnv].ENV_TAG;
        this.dbAuditObjTextRequest.DB_TYPE = this.selectedObjValues[selObj].DB_TYPE;
        this.dbAuditObjTextRequest.DB_OBJ = this.selectedObjValues[selObj].DB_OBJ;
        this.dbAuditObjTextRequest.DB_DATA = this.selectedObjValues[selObj].DB_DATA;

        const dialogRef = this.dialog.open(DbAuditToolsViewModalComponent, {
            width: '75%',
            disableClose: false,
            data: { selectedProcName: ProcName, selectedEnvName: env, selectedDataInfoJson: this.dbAuditObjTextRequest },
            panelClass: 'dbAuditTool-custom'
        });
        dialogRef.afterClosed().subscribe(() => {
        });
    }

    ngOnInit() {
        this.checkPageAccess();
        this.loadDBEnvs();
        this.loadDBObjects();
    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}