import { Component, OnDestroy } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { orderBy, SortDescriptor } from "@progress/kendo-data-query";
import { MatDialog } from '@angular/material/dialog';
import { dbAuditToolsService } from "./admin.dbAuditTools.service";
import { constantsService } from "../constants/admin.constants.service";
import { DbAuditToolsViewModalComponent } from './admin.dbAuditToolsViewModal.component';
import { DbAuditToolsCompareModalComponent } from './admin.dbAuditToolsCompareModal.component';
import { uniq } from 'underscore';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DbAuditDataPacket, DbAuditObjTextRequest, DbObjs, EnvsDataMap, GridReturnsOrig, ObjsDataMap } from "./admin.dbAuditTools.model";

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
    private gridReturnsOrig: GridReturnsOrig[] = [];
    private gridReturns: GridDataResult;
    private dbAuditDataPacket: DbAuditDataPacket = { TESTITEM: "This is a test", ENVIRONMENTS: [], DB_OBJECTS: [] };
    private dbAuditObjTextRequest: DbAuditObjTextRequest = { ENV_NM: "", ENV_TAG: "", DB_TYPE: "", DB_OBJ: "", DB_DATA: "" };
    private dbAuditCompareRequest = [];

    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    // MIKES
    private envsDataFinal: EnvsDataMap[] = []; // Final Envs list used in UI
    private selectedEnvValues: EnvsDataMap[] = [];
    private objsData: DbObjs[] = [];
    private objsDataMapped: ObjsDataMap[] = [];
    private objsDataFinal: ObjsDataMap[] = []; // Final Objects list used in UI
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

    accessAllowed = true; // Default to false to prevent unauthorized users

    checkPageAccess(): void {
        if (!(<any>window).isDeveloper) {
            this.accessAllowed = false;
        }
    }

    loadDBEnvs(): void {
        this.dbAuditToolsSVC.getDbEnvs().pipe(takeUntil(this.destroy$))
            .subscribe((result: string) => {
            const ReturnData = JSON.parse(result.toString());
            if (ReturnData.DATA != undefined) {
                this.envsDataFinal = ReturnData.DATA;
                this.baseEnvName = this.envsDataFinal.filter(x => x.IS_CURR_ENV === 1)[0].ENV_NM
            }
        }, (error) => {
            this.loggerSvc.error('Error in loading DB Audit Tools Environments Data', error);
        });
    }

    loadDBObjects(): void {
        this.dbAuditToolsSVC.getDbObjs().pipe(takeUntil(this.destroy$))
            .subscribe((result: string) => {
            const ReturnData = JSON.parse(result.toString());
            const ColumnData = ReturnData.DATA;
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

    runDbAuditNow(): void {
        if (this.selectedEnvValues.length == 0) {
            alert("You need to select some environments.");
            return;
        }

        this.dbAuditDataPacket.ENVIRONMENTS = this.selectedEnvValues.map(d => { return { "ENV_NM": d.ENV_NM, "ENV_TAG": d.ENV_TAG, "ENV_ORD": d.ENV_ORD } });
        this.dbAuditDataPacket.DB_OBJECTS = this.selectedObjValues.filter(a => a.subCategories == undefined)

        this.dbAuditToolsSVC.GetAuditData(this.dbAuditDataPacket).pipe(takeUntil(this.destroy$))
            .subscribe((result: string) => {
            const ReturnData = JSON.parse(result.toString());

            let tempEnvsOrder = ["DB_OBJ", "DB_TYPE"];
            tempEnvsOrder = tempEnvsOrder.concat(this.envsDataFinal.map((envObj) => { return envObj.ENV_NM; }));

            const tempColumnHeader = Object.keys(ReturnData.DATA[0]);
            const finalVer = [];
            tempEnvsOrder.forEach(a => {
                if (tempColumnHeader.includes(a)) finalVer.push(a)
            });

            this.ColumnHeader = finalVer;
            const ColumnData = ReturnData.DATA;
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

    performComparison(ProcName: string): void {
        this.dbAuditCompareRequest = [];
        const selObj = this.selectedObjValues.findIndex(o => o.DB_OBJ === ProcName);
        this.selectedEnvValues.sort((a, b) => (a.ENV_ORD - b.ENV_ORD)).forEach(a => {
            const tempAuditObjTextRequest = { ENV_NM: "", ENV_TAG: "", DB_TYPE: "", DB_OBJ: "", DB_DATA: "" };

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

    GetBodyData(ProcName: string, env: string): void {
        const selEnv = this.selectedEnvValues.findIndex(e => e.ENV_NM === env);
        const selObj = this.selectedObjValues.findIndex(o => o.DB_OBJ === ProcName);
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

    ngOnInit(): void {
        this.checkPageAccess();
        this.loadDBEnvs();
        this.loadDBObjects();
    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}