import { logger } from "../../shared/logger/logger";
import { workflowService } from "./admin.workFlow.service";
import { Work_Flow_Map } from "./admin.workflow.model";
import { Component, ViewChild,OnDestroy } from "@angular/core";
import { ThemePalette } from "@angular/material/core";
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import {
    GridDataResult,
    DataStateChangeEvent,
    PageSizeItem,
    GridComponent
} from "@progress/kendo-angular-grid";
import {
    process,
    State,
    distinct,
} from "@progress/kendo-data-query";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";
import { PendingChangesGuard } from "src/app/shared/util/gaurdprotectionDeactivate";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ExcelExportService } from "../../shared/services/excelExport.service";
@Component({
    selector: "admin-work-flow",
    templateUrl: "Client/src/app/admin/workFlow/admin.workFlow.component.html",
    styleUrls: ['Client/src/app/admin/workFlow/admin.workFlow.component.css']
})

export class adminWorkFlowComponent implements PendingChangesGuard, OnDestroy{
    constructor(private workflowSvc: workflowService, private loggerSvc: logger,
        private excelExportService: ExcelExportService
    ) {
        this.allData = this.allData.bind(this);
    }

    @ViewChild('ROLE_TIER_NM_DdlTooltip', { static: false }) ROLE_TIER_NM_DdlTooltip: NgbTooltip;
    @ViewChild('OBJ_TYPE_DdlTooltip', { static: false }) OBJ_TYPE_DdlTooltip: NgbTooltip;
    @ViewChild('WF_NMTooltip', { static: false }) WF_NMTooltip: NgbTooltip;
    @ViewChild('WFSTG_ACTN_NM_DdlTooltip', { static: false }) WFSTG_ACTN_NM_DdlTooltip: NgbTooltip;
    @ViewChild('WFSTG_CD_SRC_DdlTooltip', { static: false }) WFSTG_CD_SRC_DdlTooltip: NgbTooltip;
    @ViewChild('WFSTG_CD_DEST_DdlTooltip', { static: false }) WFSTG_CD_DEST_DdlTooltip: NgbTooltip;
    @ViewChild('workflow_grid') grid: GridComponent;
    isDirty = false;
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();
    private isLoading = true;
    private errorMsg = ""
    private color: ThemePalette = "primary";
    public gridResult: Array<any> = [];
    private editedRowIndex: number;
    public formGroup: FormGroup;
    public isFormChange = false;
    public distinctRoleTierNm: Array<any> = [];
    public distinctObjType: Array<any> = [];
    public distinctObjSetTypeCd: Array<any> = [];
    public distinctWFSTGActnNm: Array<any> = [];
    public distinctWFSTGCdSrc: Array<any> = [];
    public distinctWFSTGCdDest: Array<any> = [];
    public isDialogVisible = false;
    private isDataValid: any;
    public Work_Flow_Map: any;
    public state: State = {
        skip: 0,
        take: 25,
        group: [],
        // Initial filter descriptor
        filter: {
            logic: "and",
            filters: [],
        },
    };
    public pageSizes: PageSizeItem[] = [
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
        {
            text: "250",
            value: 250,
        },
        {
            text: "All",
            value: "all"
        }
    ];
    public gridData: GridDataResult;

    distinctPrimitive(fieldName: string): any {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }

    public onExcelExport(e: ExcelExportEvent): void {
        e.workbook.sheets[0].title = "Users Export";
    }

    public allData(): ExcelExportData {
        return this.excelExportService.allData(this.state, this.gridResult);
    }

    clearFilter() {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }

    loadWorkflow() {
            this.isLoading = true;
            this.workflowSvc.GetWorkFlowItems().pipe(takeUntil(this.destroy$)).subscribe(
                (result: Array<any>) => {
                    this.gridResult = result;
                    this.gridData = process(this.gridResult, this.state);
                    this.loadDDLValues();
                    this.isLoading = false;
                },
                function (response) {
                    this.loggerSvc.error(
                        "Unable to get Work Flow.",
                        response,
                        response.statusText
                    );
                }
            );
    }

    loadDDLValues() {
        this.workflowSvc.GetDropDownValues()
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: Array<any>) => {
                this.distinctRoleTierNm = response.filter(x => x.COL_NM == "ROLE_TIER_NM");
                this.distinctObjType = response.filter(x => x.COL_NM == "OBJ_TYPE");
                this.distinctObjSetTypeCd = response.filter(x => x.COL_NM == "OBJ_SET_TYPE_CD");
                this.distinctWFSTGActnNm = response.filter(x => x.COL_NM == "WFSTG_ACTN_NM");
                this.distinctWFSTGCdSrc = response.filter(x => x.COL_NM == "WFSTG_CD_SRC_DEST");
                this.distinctWFSTGCdDest = response.filter(x => x.COL_NM == "WFSTG_CD_SRC_DEST");
            }, function (response) {
                this.loggerSvc.error("Unable to get Work Flow.", response, response.statusText);
            });
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    closeEditor(grid, rowIndex = this.editedRowIndex) {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
    }

    addHandler({ sender }) {
        this.isDirty=true;
        this.closeEditor(sender);
        this.formGroup = new FormGroup({
            WF_SID: new FormControl(),
            OBJ_TYPE_SID: new FormControl("", Validators.required),
            OBJ_SET_TYPE_SID: new FormControl(""),
            WFSTG_ACTN_SID: new FormControl("", Validators.required),
            WFSTG_MBR_SID: new FormControl("", Validators.required),
            WFSTG_DEST_MBR_SID: new FormControl("", Validators.required),
            WF_NM: new FormControl("", Validators.required),
            ROLE_TIER_NM: new FormControl("", Validators.required),
            OBJ_TYPE: new FormControl(""),
            OBJ_SET_TYPE_CD: new FormControl(""),
            WFSTG_ACTN_NM: new FormControl(""),
            WFSTG_CD_SRC: new FormControl(""),
            WFSTG_CD_DEST: new FormControl(""),
            TRKR_NBR_UPD: new FormControl(false)
        });
        this.formGroup.valueChanges.subscribe(() => {
            this.isFormChange = true;
            this.toolTipvalidationMsgs(this.formGroup.controls);
        });

        sender.addRow(this.formGroup);
    }

    editHandler({ sender, rowIndex, dataItem }) {
        this.isDirty=true;
        this.closeEditor(sender);
        this.isFormChange = false;
        this.formGroup = new FormGroup({
            WF_SID: new FormControl(dataItem.WF_SID),
            OBJ_TYPE_SID: new FormControl(dataItem.OBJ_TYPE_SID.toString(), Validators.required),
            OBJ_SET_TYPE_SID: new FormControl(dataItem.OBJ_SET_TYPE_SID.toString()),
            WFSTG_ACTN_SID: new FormControl(dataItem.WFSTG_ACTN_SID.toString(), Validators.required),
            WFSTG_MBR_SID: new FormControl(dataItem.WFSTG_MBR_SID.toString(), Validators.required),
            WFSTG_DEST_MBR_SID: new FormControl(dataItem.WFSTG_DEST_MBR_SID.toString(), Validators.required),
            WF_NM: new FormControl(dataItem.WF_NM, Validators.required),
            ROLE_TIER_NM: new FormControl(dataItem.ROLE_TIER_NM, Validators.required),
            OBJ_TYPE: new FormControl(dataItem.OBJ_TYPE),
            OBJ_SET_TYPE_CD: new FormControl(dataItem.OBJ_SET_TYPE_CD),
            WFSTG_ACTN_NM: new FormControl(dataItem.WFSTG_ACTN_NM),
            WFSTG_CD_SRC: new FormControl(dataItem.WFSTG_CD_SRC),
            WFSTG_CD_DEST: new FormControl(dataItem.WFSTG_CD_DEST),
            TRKR_NBR_UPD: new FormControl(dataItem.TRKR_NBR_UPD)
        });
        this.formGroup.valueChanges.subscribe(() => {
            this.isFormChange = true;
            this.toolTipvalidationMsgs(this.formGroup.controls);
        });
        this.editedRowIndex = rowIndex;
        sender.editRow(rowIndex, this.formGroup);
    }

    validateSetObjTypeDropdown(val) {
        this.formGroup.value.OBJ_TYPE_SID = (val == null ? "" : val);
    }

    removeHandler({ dataItem }) {
        this.isDialogVisible = true;
        this.errorMsg = "Are you sure you would like to Delete this WorkFlow?";
        this.Work_Flow_Map = dataItem;
    }

    cancelHandler({ sender, rowIndex }) {
        this.closeEditor(sender, rowIndex);
    }

    deleteOperation() {
        this.workflowSvc.DeleteWorkflow(this.Work_Flow_Map).pipe(takeUntil(this.destroy$)).subscribe(
            () => {
                this.loadWorkflow();
                this.loggerSvc.success("Workflow Deleted.");
            },
            error => {
                this.loggerSvc.error("Unable to delete Workflow.", error.statusText);
                this.isLoading = false;
            }
        );
    }

    deleteConfirmation() {
        this.isDialogVisible = false;
        this.deleteOperation();
    }

    saveCancel() {
        this.isDialogVisible = false;
    }

    saveHandler({ sender, rowIndex, formGroup, isNew }) {
        if (formGroup.value.OBJ_TYPE_SID.toString() == "1" || formGroup.value.OBJ_TYPE_SID.toString() == "2" || formGroup.value.OBJ_TYPE_SID.toString() == "3") {
            formGroup.value.OBJ_SET_TYPE_SID = "";
        }
        const Work_Flow_Map: Work_Flow_Map = formGroup.value;
        this.errorMsg = "";
        this.isDialogVisible = false;

        this.isDataValid = this.formGroup.valid;
        if (!this.isDataValid) {
            this.toolTipvalidationMsgs(this.formGroup.controls);
        }
        //check the Form Change
        else if (this.isFormChange) {
            this.isDirty=false;
            this.isDialogVisible = false;

            if (isNew) {
                this.isLoading = true;
                this.workflowSvc.SetWorkFlows(Work_Flow_Map).pipe(takeUntil(this.destroy$)).subscribe(
                    () => {
                        this.gridResult.push(Work_Flow_Map);
                        this.loadWorkflow();
                        this.loggerSvc.success("New Workflow successfully added.");
                    },
                    error => {
                        this.errorMsg = error.error;
                        this.loggerSvc.error("Unable to insert Workflow.", error.statusText);
                        this.isLoading = false;
                    }
                );
            } else {
                this.isLoading = true;
                this.workflowSvc.UpdateWorkflow(Work_Flow_Map).pipe(takeUntil(this.destroy$)).subscribe(
                    () => {
                        this.gridResult[rowIndex] = Work_Flow_Map;
                        this.gridResult.push(Work_Flow_Map);
                        this.loadWorkflow();
                        this.loggerSvc.success("Workflow successfully updated.");
                    },
                    error => {
                        this.errorMsg = error.error;
                        this.loggerSvc.error("Unable to update Workflow.", error.statusText);
                        this.isLoading = false;
                    }
                );
            }
        }
        sender.closeRow(rowIndex);
    }


    refreshGrid() {
        this.grid.closeRow();
        if (this.editedRowIndex != undefined)
            this.grid.closeRow(this.editedRowIndex);
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadWorkflow();
    }

    toolTipvalidationMsgs(data) {
        this.formGroup.markAllAsTouched();
        (data.WF_NM.value == "" || data.WF_NM.value == null) ? this.WF_NMTooltip.open() : this.WF_NMTooltip.close();
        (data.ROLE_TIER_NM.value == "" || data.ROLE_TIER_NM.value == null) ? this.ROLE_TIER_NM_DdlTooltip.open() : this.ROLE_TIER_NM_DdlTooltip.close();
        (data.OBJ_TYPE_SID.value == "" || data.OBJ_TYPE_SID.value == null) ? this.OBJ_TYPE_DdlTooltip.open() : this.OBJ_TYPE_DdlTooltip.close();
        (data.WFSTG_ACTN_SID.value == "" || data.WFSTG_ACTN_SID.value == null) ? this.WFSTG_ACTN_NM_DdlTooltip.open() : this.WFSTG_ACTN_NM_DdlTooltip.close();
        (data.WFSTG_MBR_SID.value == "" || data.WFSTG_MBR_SID.value == null) ? this.WFSTG_CD_SRC_DdlTooltip.open() : this.WFSTG_CD_SRC_DdlTooltip.close();
        (data.WFSTG_DEST_MBR_SID.value == "" || data.WFSTG_DEST_MBR_SID.value == null) ? this.WFSTG_CD_DEST_DdlTooltip.open() : this.WFSTG_CD_DEST_DdlTooltip.close();
    } 
    
    canDeactivate(): Observable<boolean> | boolean {
        return !this.isDirty;
    }

    ngOnInit() {
        this.loadWorkflow();
    }
    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}