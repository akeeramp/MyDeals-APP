import { logger } from "../../shared/logger/logger";
import { adminRulesService } from "./admin.rules.service";
import { constantsService } from "../constants/admin.constants.service";
import { Component, ViewEncapsulation, OnDestroy } from "@angular/core";
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
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { RulesSimulationModalComponent } from '../../admin/rules/admin.rulesSimulationModal.component';
import { RuleDetailsModalComponent } from '../../admin/rules/admin.ruleDetailsModal.component';
import { List } from "linqts";
import { ActivatedRoute, Router } from "@angular/router";
import { PendingChangesGuard } from "src/app/shared/util/gaurdprotectionDeactivate";
import { Observable } from "rxjs";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "admin-rules",
    templateUrl: "Client/src/app/admin/rules/admin.rules.component.html",
    styleUrls: ['Client/src/app/admin/rules/admin.rules.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class adminRulesComponent implements PendingChangesGuard, OnDestroy{
    childGridResult: any;
    childGridData: any;
    RuleConfig: any;

    constructor(private adminRulesSvc: adminRulesService, private loggerSvc: logger, private constantSvc: constantsService, public dialog: MatDialog,
        private router: Router, private route: ActivatedRoute) { 
        this.allData = this.allData.bind(this);
    }
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    isDirty = false;
    public rule = {};
    public Rules: Array<any> = [];
    //public rid = rid;
    public toolKitHidden = false;
    private isLoading = true;
    //private dataSource: any;
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
    public initialLoad: boolean;

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
    private childState: State = {
        skip: 0,
        take: 10,
        group: [],
        filter: {
            logic: "and",
            filters: [],
        }
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
        {
            text: "All",
            value: "all",
        }
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
    async loadRules() {
        if ((<any>window).usrRole == 'DA' || (<any>window).usrRole == 'SA') {
            this.toolKitHidden = false;
        } else {
            this.toolKitHidden = true;
        }
        this.isLoading = true;
        this.gridResult = await this.adminRulesSvc.getPriceRules(0, "GET_RULES").toPromise().catch((error) => {
            this.loggerSvc.error(
                "Unable to get Price Rules.",
                error,
                error.statusText
            );
        }
        );
        this.gridResult.forEach((row) => {
            Object.assign(row, { isElligibleForApproval: this.isElligibleForApproval })
        })
        this.gridData = process(this.gridResult, this.state);
        this.isLoading = false;
    }

    convertToChildGridArray(parentDataItem) {
        const priceRuleObj = new List<any>(this.gridResult);
        this.childGridResult = priceRuleObj
            .Where(function (x) {
                return (
                    x.Id == parentDataItem.Id &&
                    x.ChangedBy == parentDataItem.ChangedBy
                );
            }).ToArray();
        this.childGridData = process(this.childGridResult, this.childState);
        return this.childGridData;
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
        this.initialLoad = true;
        this.rid = parseInt(this.route.snapshot.paramMap.get('rid'));
        if (!isNaN(this.rid) && this.rid > 0)
            this.state.filter.filters = [{ field: "Id", operator: "eq", value: this.rid }];
        else
            this.rid = 0;
        this.getConstant();
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
        this.isDeletion = false;
        this.isLoading = true;
        this.adminRulesSvc.deletePriceRule(this.deletionId).pipe(takeUntil(this.destroy$))
            .subscribe(
            (result: number) => {
                this.gridResult = this.gridResult.filter(x => x.Id != result);
                this.gridData = process(this.gridResult, this.state);
                this.isLoading = false;
                this.loggerSvc.success("Rule has been deleted");
            },
            (error) => {
                this.isLoading = false;
                this.loggerSvc.error(
                    "Unable to delete Price Rule.",
                    error,
                    error.statusText
                );
            }
        );
    }

    async getConstant() {
        // If user has closed the banner message he wont see it for the current session again.
        let result: any = await this.constantSvc.getConstantsByName("PRC_RULE_EMAIL").toPromise().catch((err) => {
            this.loggerSvc.error("Unable To Get Constant by Name", "Error", err);
        });
        if (!!result) {
            this.adminEmailIDs = result.CNST_VAL_TXT === "NA" ? "" : result.CNST_VAL_TXT;
            this.isElligibleForApproval = this.adminEmailIDs.indexOf((<any>window).usrEmail) > -1;
            if (this.rid != 0) this.editRule(this.rid, false);
        }
        if ((<any>window).usrRole != 'DA' && (<any>window).usrRole != 'SA') {
            this.constantSvc.getConstantsByName("PRC_RULE_READ_ACCESS").pipe(takeUntil(this.destroy$))
                .subscribe(
                (result: any) => {
                    if (!!result.data) {
                        const prcAccess = result.data.CNST_VAL_TXT === "NA" ? "" : result.data.CNST_VAL_TXT;
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
        if (this.initialLoad) {
            this.initialLoad = false;
            await this.loadRules();
            if ((<any>window).usrRole == 'DA' || (<any>window).usrRole == 'SA') {
                this.RuleConfig = await this.adminRulesSvc.getPriceRulesConfig().toPromise().catch((err) => {
                    this.loggerSvc.error("Operation failed", '');
                });
                await this.GetRules(0, "GET_RULES");
            }
        }
    }
    UpdateRuleIndicator(ruleId, isTrue, strActionName, isEnabled) {
        if (isEnabled && ruleId != null && ruleId > 0) {
            let priceRuleCriteria = {}
            switch (strActionName) {
                case "UPDATE_ACTV_IND": {
                    priceRuleCriteria = { Id: ruleId, IsActive: isTrue };
                } break;
                case "UPDATE_STAGE_IND": {
                    priceRuleCriteria = { Id: ruleId, RuleStage: isTrue, IsActive: isTrue };
                } break;
            }
            this.isLoading = true;
            this.adminRulesSvc.updatePriceRule(priceRuleCriteria, strActionName).pipe(takeUntil(this.destroy$))
                .subscribe((response) => {
                if (response.Id > 0) {
                    this.gridResult.filter(x => x.Id == response.Id)[0].ChangedBy = response.ChangedBy;
                    this.gridResult.filter(x => x.Id == response.Id)[0].ChangeDateTime = response.ChangeDateTime;
                    this.gridResult.filter(x => x.Id == response.Id)[0].ChangeDateTimeFormat = response.ChangeDateTimeFormat;
                    switch (strActionName) {
                        case "UPDATE_ACTV_IND": {
                            this.gridResult.filter(x => x.Id == response.Id)[0].IsActive = isTrue;
                            this.gridResult.filter(x => x.Id == response.Id)[0].RuleStatusLabel = isTrue ? "Active" : "Inactive";
                            this.loggerSvc.success("Rule has been updated successfully with the status '" + (isTrue ? "Active" : "Inactive") + "'");
                        } break;
                        case "UPDATE_STAGE_IND": {
                            this.gridResult.filter(x => x.Id == response.Id)[0].RuleStage = isTrue;
                            this.gridResult.filter(x => x.Id == response.Id)[0].RuleStageLabel = isTrue ? "Approved" : "Pending Approval";
                            this.gridResult.filter(x => x.Id == response.Id)[0].IsActive = isTrue;
                            this.gridResult.filter(x => x.Id == response.Id)[0].RuleStatusLabel = isTrue ? "Active" : "Inactive";
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

        const result: ExcelExportData = {
            data: process(this.gridResult, excelState).data,
        };
        return result;
    }

    returnZero() {
        return 0
    }

    openMessage({ dataItem }) {
        this.isDirty=true;
        const dialogRef = this.dialog.open(RulesSimulationModalComponent, {
            width: "900px",
            panelClass: 'admin-simulate-style',
            data: dataItem
        });
        dialogRef.afterClosed().subscribe(() => {

        });
    }

    addNewRule() {
        //Call up Popup
        this.editRule(0, false);
    }

    editRule(dataItem: number, isCopy: boolean) {
        this.spinnerMessageDescription = "Please wait while we loading the rule..";
        let tempDataItem = {
            "Id": dataItem, "isCopy": isCopy, "isEligible": this.isElligibleForApproval
        };
        this.openRuleDetailsModal(tempDataItem);
    }

    copyRule(id) {
        this.adminRulesSvc.copyPriceRule(id).pipe(takeUntil(this.destroy$))
            .subscribe(
            (response: any) => {
                if (response > 0) {
                    this.editRule(response, true);
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
        this.isDirty=true;
        const dialogRef = this.dialog.open(RuleDetailsModalComponent, {
            width: "1800px",
            panelClass: 'rule-details-model-style',
            data: dataItem
        });
        dialogRef.afterClosed().subscribe(() => {
            this.refreshGrid();
        });
    }

    async GetRules(id, actionName) {
        this.spinnerMessageDescription = "Please wait while we loading the " + (actionName == "GET_BY_RULE_ID" ? "rule" : "rules") + "..";
        this.Rules = this.gridResult;
        //adding filter
        if (id != 0) {
            this.editRule(id, false);
        }
    }


    isApprove(dataItem) {
        if (dataItem.isElligibleForApproval && !dataItem.IsActive && dataItem.IsAutomationIncluded && !dataItem.RuleStage)
            return true;
        else return false;
    }
    removeFilter() {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/rules']);
        this.gridData = process(this.gridResult, this.state);
    }
    canDeactivate(): Observable<boolean> | boolean {
        return !this.isDirty;
    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}