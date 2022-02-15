import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { workflowStagesService } from "./admin.workflowStages.service";
import { Component, ViewChild } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { Workflow_Stages_Map } from "./admin.workflowStages.model";
import { ThemePalette } from "@angular/material/core";
import * as _ from "underscore";
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
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
    selector: "adminWorkflowStages",
    templateUrl: "Client/src/app/admin/workflowStages/admin.workflowStages.component.html",
    //styleUrls: ['Client/src/app/admin/workflowStages/admin.workflowStages.component.css']
})
export class adminWorkflowStagesComponent {
    constructor(private workflowStageSvc: workflowStagesService, private loggerSvc: logger) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $(
            'link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]'
        ).remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }

    @ViewChild('roleTierDdlTooltip', { static: false }) roleTierDdlTooltip: NgbTooltip;
    @ViewChild('wfStgLocDdlTooltip', { static: false }) wfStgLocDdlTooltip: NgbTooltip;
    @ViewChild('WFSTG_NMTooltip', { static: false }) WFSTG_NMTooltip: NgbTooltip;
    @ViewChild('WFSTG_DESCTooltip', { static: false }) WFSTG_DESCTooltip: NgbTooltip;
    @ViewChild('WFSTG_ORDTooltip', { static: false }) WFSTG_ORDTooltip: NgbTooltip;

    private isLoading: boolean = true;
    private errorMsg: string = "";
    private dataSource: any;
    private gridOptions: any;
    private allowCustom: boolean = true;
    private color: ThemePalette = "primary";

    public gridResult: Array<any>;
    public type: string = "numeric";
    public info: boolean = true;
    public wkflwStg_map: any;
    public formGroup: FormGroup;
    public isFormChange: boolean = false;
    private editedRowIndex: number;
    private isDataValid: any;
    private isNew: boolean; rowIndex: number;
    isDialogVisible: boolean = false;
    public distinctRoleTierNm: Array<any>;
    public distinctWfStgLoc: Array<any>;

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

    loadWorkflowStages() {
        let vm = this;
        if (!((<any>window).isDeveloper)) {
            document.location.href = "/Dashboard#/portal";
        } else {
            vm.workflowStageSvc.GetWorkFlowStages().subscribe(
                (result: Array<any>) => {
                    vm.gridResult = result;
                    vm.gridData = process(vm.gridResult, this.state);
                    this.loadDDLValues();
                    vm.isLoading = false;
                },
                function (response) {
                    this.loggerSvc.error(
                        "Unable to get Work Flow Stages.",
                        response,
                        response.statusText
                    );
                }
            );
        }
    }

    //Master DropDown List populate method
    //Populate Role Tier & Location
    loadDDLValues() {
        this.workflowStageSvc.GetWFStgDDLValues()
            .subscribe((response: Array<any>) => {
                this.distinctRoleTierNm = response.filter(x => x.COL_NM == "ROLE_TIER_NM").map(item => item.Value);
                this.distinctWfStgLoc = response.filter(x => x.COL_NM == "WFSTG_LOC").map(item => item.Value);

            }, function (response) {
                this.loggerSvc.error("Unable to get Work Flow Stages.", response, response.statusText);
            });
    }
    loadDDLValuesss() {
        let vm = this;
        if (!((<any>window).isDeveloper)) {
            document.location.href = "/Dashboard#/portal";
        } else {
            vm.workflowStageSvc.GetWFStgDDLValues().subscribe(
                (result: Array<any>) => {
                    vm.gridResult = result;
                    vm.gridData = process(vm.gridResult, this.state);
                    vm.isLoading = false;
                },
                function (response) {
                    this.loggerSvc.error(
                        "Unable to get Work Flow Stages.",
                        response,
                        response.statusText
                    );
                }
            );
        }
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
            //WFSTG_MBR_SID: new FormControl(),
            WFSTG_NM: new FormControl("", Validators.required),
            WFSTG_DESC: new FormControl("", Validators.required),
            ROLE_TIER_NM: new FormControl("", Validators.required),
            WFSTG_LOC: new FormControl("", Validators.required),
            WFSTG_ORD: new FormControl("", Validators.required),
            ALLW_REDEAL: new FormControl()
        });
        //this.InitiateDropDowns(this.formGroup);
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
            WFSTG_MBR_SID: new FormControl(dataItem.WFSTG_MBR_SID),
            WFSTG_NM: new FormControl(dataItem.WFSTG_NM, Validators.required),
            WFSTG_DESC: new FormControl(dataItem.WFSTG_DESC, Validators.required),
            ROLE_TIER_NM: new FormControl(dataItem.ROLE_TIER_NM, Validators.required),
            WFSTG_LOC: new FormControl(dataItem.WFSTG_LOC, Validators.required),
            WFSTG_ORD: new FormControl(Number(dataItem.WFSTG_ORD), Validators.required),
            ALLW_REDEAL: new FormControl(dataItem.ALLW_REDEAL)
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
        this.errorMsg = "Are you sure you would like to Delete this WorkFlow Stage?";
        this.wkflwStg_map = dataItem;
    }

    cancelHandler({ sender, rowIndex }) {
        this.closeEditor(sender, rowIndex);
    }

    deleteOperation() {
        this.workflowStageSvc.DeleteWorkflowStages(this.wkflwStg_map).subscribe(
            result => {
                this.loadWorkflowStages();
                this.loggerSvc.success("Workflow Stage Deleted.");
            },
            error => {
                this.loggerSvc.error("Unable to delete Workflow Stage.", error.statusText);
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
        const wkflwStg_map: Workflow_Stages_Map = formGroup.value;
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
                this.workflowStageSvc.SetWorkflowStages(wkflwStg_map).subscribe(
                    result => {
                        this.gridResult.push(wkflwStg_map);
                        this.loadWorkflowStages();
                        this.loggerSvc.success("New Workflow Stage successfully added.");
                    },
                    error => {
                        this.errorMsg = error.error;
                        this.loggerSvc.error("Unable to insert Workflow Stage.", error.statusText);
                        this.isLoading = false;
                    }
                );
            } else {
                this.isLoading = true;
                this.workflowStageSvc.UpdateWorkflowStages(wkflwStg_map).subscribe(
                    result => {
                        this.gridResult[rowIndex] = wkflwStg_map;
                        this.gridResult.push(wkflwStg_map);
                        this.loadWorkflowStages();
                        this.loggerSvc.success("Workflow Stage successfully updated.");
                    },
                    error => {
                        this.errorMsg = error.error;
                        this.loggerSvc.error("Unable to update Workflow Stage.", error.statusText);
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
        this.loadWorkflowStages();
    }

    toolTipvalidationMsgs(data) {
        this.formGroup.markAllAsTouched();
        (data.WFSTG_NM.value == "") ? this.WFSTG_NMTooltip.open() : this.WFSTG_NMTooltip.close();
        (data.WFSTG_DESC.value == "") ? this.WFSTG_DESCTooltip.open() : this.WFSTG_DESCTooltip.close();
        (data.WFSTG_ORD.value < 1) ? this.WFSTG_ORDTooltip.open() : this.WFSTG_ORDTooltip.close();
        (data.ROLE_TIER_NM.value == "") ? this.roleTierDdlTooltip.open() : this.roleTierDdlTooltip.close();
        (data.WFSTG_LOC.value == "") ? this.wfStgLocDdlTooltip.open() : this.wfStgLocDdlTooltip.close();
    }

    ngOnInit() {
        this.loadWorkflowStages();
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
        "adminWorkflowStages",
        downgradeComponent({ component: adminWorkflowStagesComponent })
    );
