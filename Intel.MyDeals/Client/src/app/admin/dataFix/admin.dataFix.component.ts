import { logger } from "../../shared/logger/logger";
import { dataFixService } from "./admin.dataFix.service";
import { Component } from "@angular/core";
import { ThemePalette } from "@angular/material/core";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State, distinct } from "@progress/kendo-data-query";
import { forkJoin } from "rxjs";
import { DropDownFilterSettings } from "@progress/kendo-angular-dropdowns";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";

@Component({
    selector: 'admin-data-fix',
    templateUrl: 'Client/src/app/admin/dataFix/admin.dataFix.component.html',
    styleUrls: ['Client/src/app/admin/dataFix/admin.dataFix.component.css']
})
export class adminDataFixComponent {
    constructor(private dataFixSvc: dataFixService, 
        private loggerSvc: logger) {
        this.allData = this.allData.bind(this);
    }

    private isLoading = true;
    private color: ThemePalette = "primary";
    OpDataElements = [];
    MyCustomersInfo = [];
    AttributeSettings = [];
    Actions = [];
    public gridResult: Array<any> = [];
    IsAddMode = false; IsExpertMode = false;
    currentDataFix = { INCDN_NBR: "", DataFixAttributes: [], DataFixActions: [], Message: "" };
    disabled = false; JsonMessage = ""; isSuccess = false;
    private isAtrbSelected = true; isActnSelected = true; validationError = false;
    requiredFields = [];

    MDX = [{ Text: "Modify", Value: "M" }, { Text: "Delete", Value: "D" }, { Text: "Create", Value: "X" }];
    public filterSettings: DropDownFilterSettings = {
        caseSensitive: false,
        operator: "contains",
    };

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
        { text: "25", value: 25, },
        { text: "50", value: 50, },
        { text: "100", value: 100, },
        { text: "250", value: 250, },
        { text: "1000", value: 1000, }
    ];

    public gridData: GridDataResult;

    accessAllowed = true;

    distinctPrimitive(fieldName: string) {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

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

    loadDataFix() {
        if (!((<any>window).isDeveloper)) {
            document.location.href = "/Dashboard#/portal";
        } else {
            this.isLoading = true;
            this.dataFixSvc.getDataFixes().subscribe( (result: Array<any>) => {
                    this.gridResult = result;
                    this.gridData = process(this.gridResult, this.state);
                    this.isLoading = false;
            }, error=> {
                    this.loggerSvc.error( "Unable to get Data Fixes.",error );
                }
            );
        }
    }

    addNewFix() {
        this.currentDataFix = {
            INCDN_NBR: "", DataFixAttributes: [{
                OBJ_TYPE_SID: "",
                ATRB_SID: "",
                ATRB_RVS_NBR: 0,
                ATRB_MTX_SID: 0,
                OBJ_SID: 0,
                ATRB_VAL: "",
                ATRB_VAL_MAX: "",
                MDX_CD: "",
                CUST_MBR_SID: "",
                BTCH_ID: ""
            }], DataFixActions: [{
                OBJ_TYPE_SID: "",
                ACTN_NM: "",
                ACTN_VAL_LIST: "",
                BTCH_ID: 0
            }], Message: ""
        };
        this.IsAddMode = true;
        this.IsExpertMode = false;
    }

    addNewFixExpert() {
        this.currentDataFix = { INCDN_NBR: "", DataFixAttributes: [], DataFixActions: [], Message: "" };
        this.IsAddMode = true;
        this.IsExpertMode = true;
    }

    okDataFix() {
        this.isAtrbSelected = true;
        this.isActnSelected = true;
        this.IsAddMode = false;
        this.IsExpertMode = false;
        this.disabled = false;
    }

    cancelExpert() {
        this.JsonMessage = "";
        this.IsAddMode = false;
        this.disabled = false;
    }

    IsValidJSONString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    saveNewDataFix(data, isExecute) {
        this.dataFixSvc.updateDataFix(data, isExecute).subscribe(
            (result) => {
                if (result.RESULT == "1") {
                    this.isSuccess = true;
                    this.loggerSvc.success("Data fix has been updated successfully!");
                    this.loadDataFix();
                } else {
                    this.loggerSvc.error("Unable to update data fix","");
                }
            }, (error) => {
                this.loggerSvc.error("Unable to update data fix", error);
            });
    }

    SaveFix(isExecute, isExpert) {
        if (isExpert) {
            this.disabled = true;
            if (this.IsValidJSONString(this.JsonMessage)) {
                this.saveNewDataFix(JSON.parse(this.JsonMessage), isExecute);
            } else {
                alert("String is not valid JSON");
            }

        } else {
            this.currentDataFix.INCDN_NBR = this.currentDataFix.INCDN_NBR.trim();
            this.currentDataFix.Message = this.currentDataFix.Message.trim();
            this.currentDataFix.DataFixAttributes.map((x, index) => {
                Object.entries(x).forEach(([key, value]) => {
                    if (typeof value == "string") {
                        this.currentDataFix.DataFixAttributes[index][key] = value.toString().trim();
                    }
                });
            });
            this.currentDataFix.DataFixActions.map((x, index) => {
                Object.entries(x).forEach(([key, value]) => {
                    if (typeof value == "string") {
                        this.currentDataFix.DataFixActions[index][key] = value.toString().trim();
                    }
                });
            });
            if (this.currentDataFix.INCDN_NBR === "")
                this.requiredFields.push("Incident Number");
            if (this.isAtrbSelected && isExecute && this.currentDataFix.DataFixAttributes.filter(x => x.OBJ_TYPE_SID === "" || x.OBJ_SID == null || x.OBJ_SID == "0" || x.MDX_CD === "" || x.CUST_MBR_SID === "" || x.ATRB_RVS_NBR == null || x.BTCH_ID == "" || x.ATRB_VAL == "" || x.ATRB_SID=="").length > 0)
                this.requiredFields.push("Mandatory data in attributes section cannot be empty");
            if (this.isAtrbSelected && isExecute && this.currentDataFix.DataFixAttributes.filter(x=> x.OBJ_SID == null || x.OBJ_SID == "0" ).length > 0)
                this.requiredFields.push("Object Id Value in attributes section cannot be set empty or 0");
            if (this.isActnSelected && isExecute && this.currentDataFix.DataFixActions.filter(x => x.OBJ_TYPE_SID === "" || x.ACTN_NM === "").length > 0)
                this.requiredFields.push("Mandatory data in actions section cannot be empty");
            const regExpForObjectIds = /[0-9,]+$/;
            if (this.currentDataFix.DataFixActions.filter(x => x.ACTN_VAL_LIST !== "" && !regExpForObjectIds.exec(x.ACTN_VAL_LIST)).length > 0)
                this.requiredFields.push("Target object IDs in actions has illegal characters!");
            if (this.requiredFields.length > 0) {
                this.validationError = true;
            } else {
                this.disabled = true;
                this.validationError = false;
                this.saveNewDataFix(this.currentDataFix, isExecute);
            }
        }
    }

    refreshGrid() {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadDataFix();
    }

    close() {
        this.validationError = false;
        this.requiredFields = [];
    }

    ngOnInit() {
        if (!(<any>window).isDeveloper) {
            // Kick not valid users out of the page 
            this.accessAllowed = false;
            document.location.href = "/Dashboard#/portal";
        } else {
            this.loadDataFix();
            forkJoin({
                MyCustomersInfo: this.dataFixSvc.getMyCustomersNameInfo(),
                OpDataElements: this.dataFixSvc.getOpDataElements(),
                AttributeSettings: this.dataFixSvc.getDataFixActions(),
                Actions: this.dataFixSvc.getDataFixActions()
            }).subscribe(({ MyCustomersInfo, OpDataElements, AttributeSettings, Actions }) => {
                this.MyCustomersInfo = MyCustomersInfo;
                this.OpDataElements = OpDataElements;
                this.AttributeSettings = AttributeSettings.filter((x) => x.DdlType === 'ATRB_LIST');
                this.Actions = Actions.filter(x => x.DdlType === "ACTN_LIST");

            }
                , error => {
                    this.loggerSvc.error("Unable to getVendorDropDown.", error);
                });
        }
    }

    addRow(dataFixBuilder, index) {
        if (index > -1) {
            if (dataFixBuilder == "ActnBuilder") {
                this.currentDataFix.DataFixActions.splice(index + 1, 0, {
                    OBJ_TYPE_SID: "",
                    ACTN_NM: "",
                    ACTN_VAL_LIST: "",
                    BTCH_ID: 0
                });
            }
            else {
                this.currentDataFix.DataFixAttributes.splice(index + 1, 0, {
                    OBJ_TYPE_SID: "",
                    ATRB_SID: 0,
                    ATRB_RVS_NBR: 0,
                    ATRB_MTX_SID: 0,
                    OBJ_SID: 0,
                    ATRB_VAL: "",
                    ATRB_VAL_MAX: "",
                    MDX_CD: "",
                    CUST_MBR_SID: "",
                    BTCH_ID: ""
                });
            }
        }
    }

    removeRow(dataFixBuilder, index) {
        if (index > -1) {
            if (dataFixBuilder == "ActnBuilder") this.currentDataFix.DataFixActions.splice(index, 1);
            else this.currentDataFix.DataFixAttributes.splice(index, 1);

        }
    }
}