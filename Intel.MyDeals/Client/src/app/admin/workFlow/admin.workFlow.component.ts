import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { workflowService } from "./admin.workFlow.service";
import { Work_Flow_Map } from "./admin.workflow.model";
import { Component, ViewChild } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { ThemePalette } from "@angular/material/core";
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import * as _ from "underscore";
import {
    GridDataResult,
    PageChangeEvent,
    DataStateChangeEvent,
    PageSizeItem,
} from "@progress/kendo-angular-grid";
import {
    process,
    State,
    GroupDescriptor,
    CompositeFilterDescriptor,
    distinct,
    filterBy,
} from "@progress/kendo-data-query";
import { FormGroup, FormControl, Validators } from "@angular/forms";
@Component({
    selector: "workFlow",
    templateUrl: "Client/src/app/admin/workFlow/admin.workFlow.component.html",
    //styleUrls: ['Client/src/app/admin/productAlias/admin.productAlias.component.css']
})

export class adminWorkFlowComponent {
    constructor(private workflowSvc: workflowService, private loggerSvc: logger) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $(
            'link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]'
        ).remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }

    @ViewChild('ROLE_TIER_NM_DdlTooltip', { static: false }) ROLE_TIER_NM_DdlTooltip: NgbTooltip;
    @ViewChild('OBJ_TYPE_DdlTooltip', { static: false }) OBJ_TYPE_DdlTooltip: NgbTooltip;
    @ViewChild('WF_NMTooltip', { static: false }) WF_NMTooltip: NgbTooltip;
    @ViewChild('WFSTG_ACTN_NM_DdlTooltip', { static: false }) WFSTG_ACTN_NM_DdlTooltip: NgbTooltip;
    @ViewChild('WFSTG_CD_SRC_DdlTooltip', { static: false }) WFSTG_CD_SRC_DdlTooltip: NgbTooltip;
    @ViewChild('WFSTG_CD_DEST_DdlTooltip', { static: false }) WFSTG_CD_DEST_DdlTooltip: NgbTooltip;


    private isLoading: boolean = true;
    private errorMsg: string = ""
    private color: ThemePalette = "primary";
    public gridResult: Array<any>;
    private editedRowIndex: number;
    public formGroup: FormGroup;
    public isFormChange: boolean = false;
    public distinctRoleTierNm: Array<any>;
    public distinctObjType: Array<any>;
    public distinctObjSetTypeCd: Array<any>;
    public distinctWFSTGActnNm: Array<any>;
    public distinctWFSTGCdSrc: Array<any>;
    public distinctWFSTGCdDest: Array<any>;
    public isDialogVisible: boolean = false;
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
    public gridData: GridDataResult;

    distinctPrimitive(fieldName: string): any {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }

    clearFilter() {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }

    loadWorkflow() {
        let vm = this;
        if (!((<any>window).isDeveloper)) {
            document.location.href = "/Dashboard#/portal";
        } else {
            vm.workflowSvc.GetWorkFlowItems().subscribe(
                (result: Array<any>) => {
                    vm.gridResult = result;
                    vm.gridData = process(vm.gridResult, this.state);
                    this.loadDDLValues();
                    vm.isLoading = false;
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
    }

    loadDDLValues() {
        this.workflowSvc.GetDropDownValues()
            .subscribe((response: Array<any>) => {
                this.distinctRoleTierNm = response.filter(x => x.COL_NM == "ROLE_TIER_NM").map(item => item.Value);
                this.distinctObjType = response.filter(x => x.COL_NM == "OBJ_TYPE").map(item => item.Value);
                this.distinctObjSetTypeCd = response.filter(x => x.COL_NM == "OBJ_SET_TYPE_CD").map(item => item.Value);
                this.distinctWFSTGActnNm = response.filter(x => x.COL_NM == "WFSTG_ACTN_NM").map(item => item.Value);
                this.distinctWFSTGCdSrc = response.filter(x => x.COL_NM == "WFSTG_CD_SRC_DEST").map(item => item.Value);
                this.distinctWFSTGCdDest = response.filter(x => x.COL_NM == "WFSTG_CD_SRC_DEST").map(item => item.Value);
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
        this.closeEditor(sender);
        this.formGroup = new FormGroup({
            //WF_SID: new FormControl(),
            //OBJ_TYPE_SID: new FormControl(),
            //OBJ_SET_TYPE_SID: new FormControl(),
            //WFSTG_ACTN_SID: new FormControl(),
            //WFSTG_MBR_SID: new FormControl(),
            //WFSTG_DEST_MBR_SID: new FormControl(),
            WF_NM: new FormControl("", Validators.required),
            ROLE_TIER_NM: new FormControl("", Validators.required),            
            OBJ_TYPE: new FormControl("", Validators.required),           
            OBJ_SET_TYPE_CD: new FormControl(),
            WFSTG_ACTN_NM: new FormControl("", Validators.required),
            WFSTG_CD_SRC: new FormControl("", Validators.required),
            WFSTG_CD_DEST: new FormControl("", Validators.required),
            TRKR_NBR_UPD: new FormControl()
        });
        this.formGroup.valueChanges.subscribe(x => {
            this.isFormChange = true;
            this.toolTipvalidationMsgs(this.formGroup.controls);
        });

        sender.addRow(this.formGroup);
    }

    editHandler({ sender, rowIndex, dataItem }) {
        this.closeEditor(sender);
        this.isFormChange = false;
        this.formGroup = new FormGroup({
            WF_NM: new FormControl(dataItem.WF_NM, Validators.required),
            ROLE_TIER_NM: new FormControl(dataItem.ROLE_TIER_NM, Validators.required),
            OBJ_TYPE: new FormControl(dataItem.OBJ_TYPE, Validators.required),
            OBJ_SET_TYPE_CD: new FormControl(dataItem.OBJ_SET_TYPE_CD),
            WFSTG_ACTN_NM: new FormControl(dataItem.WFSTG_ACTN_NM, Validators.required),
            WFSTG_CD_SRC: new FormControl(dataItem.WFSTG_CD_SRC, Validators.required),
            WFSTG_CD_DEST: new FormControl(dataItem.WFSTG_CD_DEST, Validators.required),
            TRKR_NBR_UPD: new FormControl(dataItem.TRKR_NBR_UPD)
        });
        this.formGroup.valueChanges.subscribe(x => {
            this.isFormChange = true;
            this.toolTipvalidationMsgs(this.formGroup.controls);
        });
        this.editedRowIndex = rowIndex;
        sender.editRow(rowIndex, this.formGroup);
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
        this.workflowSvc.DeleteWorkflow(this.Work_Flow_Map).subscribe(
            result => {
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
        const Work_Flow_Map: Work_Flow_Map = formGroup.value;
        this.errorMsg = "";
        this.isDialogVisible = false;

        this.isDataValid = this.formGroup.valid;
        if (!this.isDataValid) {
            this.toolTipvalidationMsgs(this.formGroup.controls);
        }
        //check the Form Change
        else if (this.isFormChange) {
            this.isDialogVisible = false;

            if (isNew) {
                this.isLoading = true;
                this.workflowSvc.SetWorkFlows(Work_Flow_Map).subscribe(
                    result => {
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
                this.workflowSvc.UpdateWorkflow(Work_Flow_Map).subscribe(
                    result => {
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
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadWorkflow();
    }

    toolTipvalidationMsgs(data) {
        this.formGroup.markAllAsTouched();
        (data.WF_NM.value == "") ? this.WF_NMTooltip.open() : this.WF_NMTooltip.close();
        (data.ROLE_TIER_NM.value == "") ? this.ROLE_TIER_NM_DdlTooltip.open() : this.ROLE_TIER_NM_DdlTooltip.close();
        (data.OBJ_TYPE.value == "") ? this.OBJ_TYPE_DdlTooltip.open() : this.OBJ_TYPE_DdlTooltip.close();
        (data.WFSTG_ACTN_NM.value == "") ? this.WFSTG_ACTN_NM_DdlTooltip.open() : this.WFSTG_ACTN_NM_DdlTooltip.close();
        (data.WFSTG_CD_SRC.value == "") ? this.WFSTG_CD_SRC_DdlTooltip.open() : this.WFSTG_CD_SRC_DdlTooltip.close();
        (data.WFSTG_CD_DEST.value == "") ? this.WFSTG_CD_DEST_DdlTooltip.open() : this.WFSTG_CD_DEST_DdlTooltip.close();
    }

    ngOnInit() {
        this.loadWorkflow();
    }

    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }
}

angular
    .module("app")
    .directive(
        "adminWorkFlow",
        downgradeComponent({ component: adminWorkFlowComponent })
    );