import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { adminRulesService } from "./admin.rules.service";
import { constantsService } from "../constants/admin.constants.service";
import { Component, ViewEncapsulation } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { ThemePalette } from "@angular/material/core";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";
import {
    GridDataResult,
    DataStateChangeEvent,
    PageSizeItem,
} from "@progress/kendo-angular-grid";
import {
    process,
    State,
    distinct,
} from "@progress/kendo-data-query";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { RulesSimulationModalComponent } from '../../admin/rules/admin.rulesSimulationModal.component';
import { RuleDetailsModalComponent } from '../../admin/rules/admin.ruleDetailsModal.component';

@Component({
    selector: "adminRules",
    templateUrl: "Client/src/app/admin/rules/admin.rules.component.html",
    styleUrls: ['Client/src/app/admin/rules/admin.rules.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class adminRulesComponent {
    constructor(private adminRulesSvc: adminRulesService, private loggerSvc: logger, private constantSvc: constantsService, public dialog: MatDialog) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $(
            'link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]'
        ).remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
        this.allData = this.allData.bind(this);
    }

    public rule = {};
    public Rules: Array<any> = [];
    //public rid = rid;
    public toolKitHidden = false;
    private isLoading = true;
    private dataSource: any;
    private gridOptions: any;
    private allowCustom = true;
    private color: ThemePalette = "primary";
    public gridResult: Array<any> = [];
    public type = "numeric";
    public info = true;
    public formGroup: FormGroup;
    public isFormChange = false;
    private editedRowIndex: number;
    public IsAutomationIncluded: false;
    public isDeletion = false;
    public isElligibleForApproval = false;
    public adminEmailIDs = "";
    public isExpand = true;
    public isExpandTitle = "Click me to Expand Cloumn";
    public isTextIncrease = true;
    public isTextFontTitle = "Click me to Decrease Text size";
    public rid = 0;
    public spinnerMessageDescription = "Please wait while we loading page";

    private deletionId: any;
    private excelColumns = {
        "Name": "Name",
        "RuleStageLabel": "Rule Stage",
        "RuleStatusLabel": "Rule Status",
        "RuleAutomationLabel": "Rule Type",
        "StartDate": "Start Date",
        "EndDate": "End Date",
        "OwnerName": "Owner Name",
        "ChangedBy": "Updated By",
        "ChangeDateTime": "Updated Date",
        "Notes": "Notes",
        "RuleDescription": "Rules Description"
    }
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

    }

    editHandler({ sender, rowIndex, dataItem }) {
        this.closeEditor(sender);

    }

    cancelHandler({ sender, rowIndex }) {
        this.closeEditor(sender, rowIndex);
    }

    saveHandler({ sender, rowIndex, formGroup, isNew }) {
        sender.closeRow(rowIndex);
    }
    loadRules() {
        if ((<any>window).usrRole != 'GA' && (<any>window).usrRole != 'DA' && (<any>window).usrRole != 'SA' && !(<any>window).isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        else {
            if ((<any>window).usrRole == 'DA' || (<any>window).usrRole == 'SA') {
                this.toolKitHidden = false;
            } else {
                this.toolKitHidden = true;
            }
            this.isLoading = true;
            this.adminRulesSvc.getPriceRules(0, "GET_RULES").subscribe(
                (result: Array<any>) => {
                    this.gridResult = result;
                    this.gridData = process(this.gridResult, this.state);
                    this.isLoading = false;
                },
                (error) => {
                    this.loggerSvc.error(
                        "Unable to get Price Rules.",
                        error,
                        error.statusText
                    );
                }
            );
        }
    }

    refreshGrid() {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadRules();
    }

    ngOnInit() {
        var webUrl = window.location.href;
        var lastLoc = webUrl.lastIndexOf('/');
        if (webUrl.length > lastLoc + 1) {
            var value = webUrl.substring(lastLoc + 1, webUrl.length);
            var valueIsNumber = Number.isNaN(Number(value));
            if (!valueIsNumber) {
                this.rid = parseInt(value);
                this.state.filter.filters = [{ field: "Id", operator: "eq", value: this.rid }];
            }
        }
        this.loadRules();
    }

    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }

    stageOneChar(RULE_STAGE) {
        if (RULE_STAGE === true) {
            return 'A';
        } else {
            return 'P';
        }
    }
    stageOneCharStatus(IsAutomationIncluded) {
        if (IsAutomationIncluded === true) {
            return 'intelicon-plus-solid clrBlue';
        } else {
            return 'intelicon-minus-solid clrRed';
        }
    }

    deleteRule(id) {
        this.isDeletion = true;
        this.deletionId = id;
    };

    cancelDeletion() {
        this.isDeletion = false;
    }

    deleteConfirmation() {
        this.isLoading = true;
        this.adminRulesSvc.deletePriceRule(this.deletionId).subscribe(
            (result: number) => {
                this.gridResult = this.gridResult.filter(x => x.Id != result);
                this.gridData = process(this.gridResult, this.state);
                this.isLoading = false;
            },
            (error) => {
                this.loggerSvc.error(
                    "Unable to delete Price Rule.",
                    error,
                    error.statusText
                );
            }
        );
    }

    getConstant() {
        // If user has closed the banner message he wont see it for the current session again.
        this.constantSvc.getConstantsByName("PRC_RULE_EMAIL").subscribe(
            (result: any) => {
                if (!!result.data) {
                    this.adminEmailIDs = result.data.CNST_VAL_TXT === "NA" ? "" : result.data.CNST_VAL_TXT;
                    this.isElligibleForApproval = this.adminEmailIDs.indexOf((<any>window).usrEmail) > -1;
                }
            },(err)=>{
                this.loggerSvc.error("Unable To Get Constant by Name","Error",err);
            });
        if ((<any>window).usrRole != 'DA' && (<any>window).usrRole != 'SA') {
            this.constantSvc.getConstantsByName("PRC_RULE_READ_ACCESS").subscribe(
                (result: any) => {
                    if (!!result.data) {
                        var prcAccess = result.data.CNST_VAL_TXT === "NA" ? "" : result.data.CNST_VAL_TXT;
                        this.toolKitHidden = prcAccess.indexOf((<any>window).usrRole) > -1;
                        if (this.toolKitHidden) {
                            this.ngOnInit();
                        } else {
                            document.location.href = "/Dashboard#/portal";
                        }

                    }
                },
                (error) => {
                    this.loggerSvc.error(
                        "Unable to get constant by name.",
                        error,
                        error.statusText
                    );
                });
        }

    }
    UpdateRuleIndicator(ruleId, isTrue, strActionName, isEnabled) {
        if (isEnabled && ruleId != null && ruleId > 0) {
            var priceRuleCriteria = {}
            switch (strActionName) {
                case "UPDATE_ACTV_IND": {
                    priceRuleCriteria = { Id: ruleId, IsActive: isTrue };
                } break;
                case "UPDATE_STAGE_IND": {
                    priceRuleCriteria = { Id: ruleId, RuleStage: isTrue, IsActive: isTrue };
                } break;
            }
            this.isLoading = true;
            this.adminRulesSvc.updatePriceRule(priceRuleCriteria, strActionName).subscribe((response) => {
                if (response.data.Id > 0) {
                    this.gridResult.filter(x => x.Id == response.data.Id)[0].ChangedBy = response.data.ChangedBy;
                    this.gridResult.filter(x => x.Id == response.data.Id)[0].ChangeDateTime = response.data.ChangeDateTime;
                    this.gridResult.filter(x => x.Id == response.data.Id)[0].ChangeDateTimeFormat = response.data.ChangeDateTimeFormat;
                    switch (strActionName) {
                        case "UPDATE_ACTV_IND": {
                            this.gridResult.filter(x => x.Id == response.data.Id)[0].IsActive = isTrue;
                            this.gridResult.filter(x => x.Id == response.data.Id)[0].RuleStatusLabel = isTrue ? "Active" : "Inactive";
                            this.loggerSvc.success("Rule has been updated successfully with the status '" + (isTrue ? "Active" : "Inactive") + "'");
                        } break;
                        case "UPDATE_STAGE_IND": {
                            this.gridResult.filter(x => x.Id == response.data.Id)[0].RuleStage = isTrue;
                            this.gridResult.filter(x => x.Id == response.data.Id)[0].RuleStageLabel = isTrue ? "Approved" : "Pending Approval";
                            this.gridResult.filter(x => x.Id == response.data.Id)[0].IsActive = isTrue;
                            this.gridResult.filter(x => x.Id == response.data.Id)[0].RuleStatusLabel = isTrue ? "Active" : "Inactive";
                            this.loggerSvc.success("Rule has been updated successfully with the stage '" + (isTrue ? "Approved" : "Pending") + "'");
                        } break;
                    }
                    this.isLoading = false;
                }
                else {
                    switch (strActionName) {
                        case "UPDATE_ACTV_IND": {
                            this.rule = { IsActive: !isTrue };
                        } break;
                        case "UPDATE_STAGE_IND": {
                            this.rule = { IsActive: !isTrue, RuleStage: !isTrue };
                        } break;
                    }
                    this.loggerSvc.error(
                        "Unable to update Price Rule.",
                        response,
                        response.statusText
                    );
                }
            }, (error) => {
                switch (strActionName) {
                    case "UPDATE_ACTV_IND": {
                        this.rule = { IsActive: !isTrue };
                    } break;
                    case "UPDATE_STAGE_IND": {
                        this.rule = { IsActive: !isTrue, RuleStage: !isTrue };
                    } break;
                }
                this.loggerSvc.error(
                    "Unable to update Price Rule.",
                    error,
                    error.statusText
                );
            });
        }
    }

    isExpandable() {
        if (this.isExpand) {
            this.isExpand = false;
            this.isExpandTitle = "Click me to remove Expand column";
        }
        else {
            this.isExpand = true;
            this.isExpandTitle = "Click me to Expand Cloumn";
        }
    }

    isFontSizeChange() {
        if (this.isTextIncrease) {
            this.isTextIncrease = false;
            this.isTextFontTitle = "Click me to Increase Text size";
        }
        else {
            this.isTextIncrease = true;
            this.isTextFontTitle = "Click me to Decrease Text size"
        }
    }

    public cellOptions = {
        textAlign: "left",
        wrap: true
    };

    public headerCellOptions = {
        textAlign: "center",
        background: "#0071C5",
        color: "#ffffff",
        wrap: true
    };

    public onExcelExport(e: ExcelExportEvent): void {
        e.workbook.sheets[0].title = "Users Export";
    }

    public allData(): ExcelExportData {
        const excelState: any = {};
        Object.assign(excelState, this.state)
        excelState.take = this.gridResult.length;

        var result: ExcelExportData = {
            data: process(this.gridResult, excelState).data,
        };
        return result;
    }

    returnZero() {
        return 0
    }

    openMessage({ dataItem }) {
        const dialogRef = this.dialog.open(RulesSimulationModalComponent, {
            width: "900px",
            data: dataItem
        });
        dialogRef.afterClosed().subscribe(() => {

        });
    }

    addNewRule() {
        //Call up Popup
        this.editRule(0, false);
    }

    editRule(dataItem, isCopy) {
        this.spinnerMessageDescription = "Please wait while we loading the rule..";
        //vm.GetRules(id, "GET_BY_RULE_ID"); 
        if (dataItem.id) {
            dataItem.isCopy = isCopy;
            this.openRuleDetailsModal(dataItem);
        } else {
            let tempDataItem = {
                "id": dataItem, "isCopy": isCopy
            };
            this.openRuleDetailsModal(tempDataItem);
        }
    }

    copyRule(id) {
        this.adminRulesSvc.copyPriceRule(id).subscribe(
            (response: any) => {
            if (response.data > 0) {
                this.editRule(response.data, true);
                this.loggerSvc.success("Rule has been copied");

            } else {
                this.loggerSvc.error("Unable to copy the rule", "");
            }
        }, (error) => {
                this.loggerSvc.error(
                    "Unable to copy the rule.",
                    error,
                    error.statusText
                );
            },
    )}

    openRuleDetailsModal(dataItem) {
        const dialogRef = this.dialog.open(RuleDetailsModalComponent, {
                width: "1800px",
                data: dataItem
            });
            dialogRef.afterClosed().subscribe(() => {
            });
    }

    GetRules(id, actionName) {
        this.spinnerMessageDescription = "Please wait while we loading the " + (actionName == "GET_BY_RULE_ID" ? "rule" : "rules") + "..";
        this.adminRulesSvc.getPriceRules(id, actionName).subscribe(
            (response: Array<any>) => {
            //this.Rules = response.data;
            this.dataSource.read();
            //adding filter
            if (this.rid != 0) {
                this.dataSource.filter({ field: "Id", value: this.rid });
                this.editRule(this.rid, false);
            }
        }, (error) => {
            this.loggerSvc.error(
                "Operation Failed.",
                error,
                error.statusText
            );
        }
    );
    };

    removeFilter() {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.rid = 0;
        var webUrl = window.location.href;
        var lastLoc = webUrl.lastIndexOf('/');
        if (webUrl.length > lastLoc + 1) {
            webUrl = webUrl.substring(0, lastLoc + 1);
            (window.location.href) = webUrl;
        }
        this.gridData = process(this.gridResult, this.state);
    }
}
angular
    .module("app")
    .directive(
        "adminRules",
        downgradeComponent({ component: adminRulesComponent })
    );
