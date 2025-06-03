/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ThemePalette } from "@angular/material/core";
import { indexOf, filter } from 'underscore';
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State, distinct } from "@progress/kendo-data-query";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";
import { Observable, Subject } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { takeUntil } from "rxjs/operators";

import { logger } from "../../shared/logger/logger";
import { DropdownService } from './admin.dropdowns.service';
import { UiDropdownItem } from "./admin.dropdowns.model";
import { PendingChangesGuard } from "../../shared/util/gaurdprotectionDeactivate";
import { DropdownBulkUploadDialogComponent } from "./dropdownBulkUploadDialog/admin.dropdowns.bulkUploadDialog.component";
import { FilterExpressBuilder } from "../../shared/util/filterExpressBuilder";

/**
 * WIP: IQR
 * =============================
 * Need to call IQR after updating dropdowns for following:
 *      CONSUMPTION_CUST_PLATFORM
 *      CONSUMPTION_CUST_RPT_GEO
 */

@Component({
    selector: "dropdowns",
    templateUrl: "Client/src/app/admin/dropdowns/admin.dropdowns.component.html",
    styleUrls: ['Client/src/app/admin/CustomerVendors/admin.customerVendors.component.css']
})
export class AdminDropdownsComponent implements PendingChangesGuard, OnInit, OnDestroy {

    constructor(private dropdownService: DropdownService,
                private loggerService: logger,
                private dialogService: MatDialog) {
        this.allData = this.allData.bind(this);
    }

    @ViewChild("dealtypeDropDown") private dealtypeDdl;
    @ViewChild("attributeDropDown") private atrbDdl;
    @ViewChild("custDropDown") private custDdl;

    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();

    //Private Varibales
    isDirty = false;
    private isLoading = true;
    private editedRowIndex: number;
    private deleteItem: string;
    private deleteATRB_CDItem: string;
    private deleteDROP_DOWNItem: string;
    private deleteDropdownData: any;
    private isModelValid = false;
    private errorMsg = "";
    private isDialogVisible = false;
    private selectedInheritanceGroup: string;
    private color: ThemePalette = "primary";

    //Public Variables
    public gridResult: Array<any>;
    public formGroup: FormGroup;
    public gridData: GridDataResult;
    public isFormChange = false;
    public DealTypeData: Array<any>;
    public allDealTypeData: Array<any>;
    public distinctSetTypeCd: Array<any>;
    public fullDistinctSetTypeCd: Array<any>;
    public distinctAtributeCd: Array<any>;
    public GroupData: Array<any>;
    public CustomerData: Array<any>;
    public distinctCustomerName: Array<any>;
    public nonCorpInheritableValues: Array<any> = [];
    public COMP_ATRB_SIDS: Array<any> = [];
    public checkRestrictionFlag: boolean = false;
    private isDeveloperFlag = false;
    public restrictedGroupList = [3456, 3457, 3458, 3454];
    private sortData = "";
    private filterData = "";
    private columnFilterDataList: Map<string, Array<string>> = new Map();
    private dataforfilter: object;
    //For header filter
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

    // Pagination
    public pageSizes: PageSizeItem[] = [
        { text: "25", value: 25 },
        { text: "50", value: 50 },
        { text: "100", value: 100 },
        { text: "250", value: 250 },
        { text: "1000", value: 1000 }
    ];

    async initialization() {
        //loading data
        try {
            await this.loadUiDropdown();
        } catch (ex) {
            //in catching any errors on loading
            this.loggerService.error('Something went wrong', 'Error');
            console.error('UI_DROPDOWNS::ngOnInit::', ex);
        }
    }

    //Functions
    public onExcelExport(e: ExcelExportEvent): void {
        e.workbook.sheets[0].title = "Users Export";
    }

    public allData(): ExcelExportData {
        const result: ExcelExportData = {
            data: this.gridResult
        };
        return result;
    }

    async getDealTypeDataSource() {
        this.DealTypeData = await this.dropdownService.getDealTypesDropdowns(true).toPromise().catch((error) => {
            this.loggerService.error("Unable to get Deal Type Dropdowns.", error, error.statusText);
        })
        this.fullDistinctSetTypeCd = this.distinctSetTypeCd = distinct(this.DealTypeData, "dropdownName").map(
            item => item.dropdownName
        );
        this.allDealTypeData = this.distinctSetTypeCd.filter(item => ["all deals", "all_deals"].includes(item.toLowerCase()));
    }

    async getGroupsDataSource() {
        //let checkRestrictionFlag = false;
        let response: any = await this.dropdownService.getDropdownGroups(true).toPromise().catch((error) => {
            this.loggerService.error("Unable to get Group Dropdowns.", error, error.statusText);
        })
        response = response.filter(ob => ob.dropdownName !== "SETTLEMENT_PARTNER");
        this.GroupData = response;
        //checkRestrictionFlag = this.checkRestrictions(result);
        //this to restrict SA users to have only restricted values
        if (this.checkRestrictionFlag) {
            this.distinctAtributeCd = distinct(this.GroupData, "dropdownName").map(
                item => item.dropdownName
            );
        } else {
            this.GroupData = filter(this.GroupData, (item) => {
                let id = (item.dropdownID === undefined) ? item.ATRB_SID : item.dropdownID;
                if (this.restrictedGroupList.includes(id)) return item
            });
            this.distinctAtributeCd = distinct(this.GroupData, "dropdownName").map(
                item => item.dropdownName
            );
        }
    }

    async getCustomersDataSource() {
        this.CustomerData = await this.dropdownService.getCustsDropdowns(true).toPromise().catch((error) => {
            this.loggerService.error("Unable to get Dropdown Customers.", error, error.statusText);
        })
        this.distinctCustomerName = distinct(this.CustomerData, "dropdownName").map(
            item => item.dropdownName
        );
    }

    loadUiDropdown() {
        this.COMP_ATRB_SIDS.push(3456, 3457, 3458, 3464, 3454); // Removed [] from this since it was making push value a single value of array
        this.selectedInheritanceGroup = "";
        //let checkRestrictionFlag = false;

        this.settingFilter();
        this.isLoading = true;

        this.dropdownService.getBasicDropdownsNew(this.dataforfilter).pipe(takeUntil(this.destroy$))
            .subscribe(result => {
                this.setNonCorpInheritableValues(result.Items);
                const items = result.Items.filter(ob => ob.ATRB_CD !== "SETTLEMENT_PARTNER");
                //checkRestrictionFlag = this.checkRestrictions(result);
                //this to restrict SA users to have only restricted values
                this.gridResult = items;
                const state: State = {
                    skip: 0,
                    take: this.state.take,
                    group: [],
                    filter: {
                        logic: "and",
                        filters: [],
                    }
                };
                if (this.checkRestrictionFlag) {
                    this.gridData = process(this.gridResult, state);
                    this.gridData.total = result.TotalRows;
                    this.isLoading = false;
                } else {
                    this.gridResult = filter(this.gridResult, (item) => {
                        let id = (item.dropdownID === undefined) ? item.ATRB_SID : item.dropdownID;
                        if (this.restrictedGroupList.includes(id)) return item
                    })
                    this.gridData = process(this.gridResult, state);
                    this.gridData.total = result.TotalRows;
                    this.isLoading = false;
                }
            });
    }

    settingFilter() {
        this.sortData = "";
        this.filterData = "";
        if (this.state.sort) {
            this.state.sort.forEach((value, ind) => {
                if (value.dir) {
                    this.sortData = ind == 0 ? `ORDER BY ${value.field} ${value.dir}` : `${this.sortData} , ${value.field} ${value.dir}`;
                }
            });
        }
        const filterExpression = FilterExpressBuilder.createSqlExpression(JSON.stringify(this.state.filter));
        this.filterData = filterExpression;
        this.dataforfilter = {
            InFilters: this.filterData,
            Sort: this.sortData,
            Skip: this.state.skip,
            Take: this.state.take
        };
    }

    GetColumnFilterData(fieldName: string): any {
        return this.columnFilterDataList.has(fieldName) ? this.columnFilterDataList.get(fieldName) : [];
    }

    filterLoad(fieldName: string) {
        if (fieldName == 'ATRB_LKUP_DESC' || fieldName == 'ATRB_LKUP_TTIP' || fieldName == 'DROP_DOWN') {
            this.dropdownService.getBasicDropdownsFilterData(fieldName).subscribe(data => {
                this.columnFilterDataList.set(fieldName, data);
            });
        }
        else if (fieldName == 'OBJ_SET_TYPE_CD') {
            this.dropdownService.getDealTypesDropdowns(true).subscribe(data => {
                const dataValues: Array<any> = distinct(data, "dropdownName").map(
                    (item: any) => item.dropdownName
                );
                this.columnFilterDataList.set(fieldName, dataValues);
            });
        }
        else if (fieldName == 'CUST_NM') {
            this.dropdownService.getCustsDropdowns(true).subscribe(data => {
                const dataValues: Array<any> = distinct(data, "dropdownName").map(
                    (item: any) => item.dropdownName
                );
                this.columnFilterDataList.set(fieldName, dataValues);

            });
        }
        else if (fieldName == 'ATRB_CD') {
            this.dropdownService.getDropdownGroups(true).subscribe(data => {
                const dataValues: Array<any> = distinct(data, "dropdownName").map(
                    (item: any) => item.dropdownName
                );
                this.columnFilterDataList.set(fieldName, dataValues);

            });
        }
    }
    setNonCorpInheritableValues(data: Array<any>) {
        for (let i = 0; i <= data.length; i++) {
            if (data[i] != null && data[i].ATRB_CD == "MRKT_SEG_COMBINED") {
                this.nonCorpInheritableValues.push(data[i].DROP_DOWN);
            }
        }
    }

    checkModelValid(model: any, isNew: boolean) {
        const MATCHING_DROPDOWNS: Array<UiDropdownItem> = this.gridResult.filter((x: UiDropdownItem) =>
            x.OBJ_SET_TYPE_CD.toString().toUpperCase().trim() === model.OBJ_SET_TYPE_CD.toString().toUpperCase().trim() &&
                x.ATRB_CD.toString().toUpperCase().trim() === model.ATRB_CD.toString().toUpperCase().trim() &&
                x.DROP_DOWN.toString().toUpperCase().trim() === model.DROP_DOWN.toString().toUpperCase().trim() &&
                x.CUST_NM.toString().toUpperCase().trim() === model.CUST_NM.toString().toUpperCase().trim());

        if (model.DROP_DOWN.indexOf(',') > -1) {
            this.loggerService.warn(model.ATRB_CD + " values cannot have embedded commas (,).", "Validation Error");
            this.errorMsg = model.ATRB_CD + " values cannot have embedded commas (,).";
            return false;
        }

        if (this.COMP_ATRB_SIDS.indexOf(model.ATRB_SID) > -1) {
            if (model.DROP_DOWN.length > 40) {
                this.loggerService.warn(model.ATRB_CD + " values cannot be more than 40 characters long.", "Validation Error");
                this.errorMsg = model.ATRB_CD + " values cannot be more than 40 characters long.";
                return false;
            }
        }

        if (this.selectedInheritanceGroup == "MRKT_SEG_NON_CORP") {
            this.errorMsg = "MRKT_SEG_NON_CORP values must match an existing MRKT_SEG_COMBINED value.";
            this.loggerService.error("MRKT_SEG_NON_CORP values must match an existing MRKT_SEG_COMBINED value.", "Validation Error");

            if (this.nonCorpInheritableValues.indexOf(model.DROP_DOWN) === -1) {
                return false;
            }
        }

        if (isNew && MATCHING_DROPDOWNS.length > 0) {    // For inserting "new" values
            this.errorMsg = "This Combination of Customer, Group, DealType, and Dropdown already exists.";
            this.loggerService.error("This Combination of Customer, Group, DealType, and Dropdown already exists.", "Validation Error");
            return false;
        } else if (!isNew && MATCHING_DROPDOWNS.length > 0) {    // For updating existing values
            if (MATCHING_DROPDOWNS.filter(x => x.ACTV_IND === model.ACTV_IND).length === 1) {
                const IS_DESCRIPTION_EQUAL = MATCHING_DROPDOWNS.filter(x => x.ATRB_LKUP_DESC.trim() == model.ATRB_LKUP_DESC.trim()).length > 0;
                const IS_TOOLTIP_EQUAL = MATCHING_DROPDOWNS.filter(x => x.ATRB_LKUP_TTIP.trim() == model.ATRB_LKUP_TTIP.trim()).length > 0;

                if (IS_DESCRIPTION_EQUAL && IS_TOOLTIP_EQUAL) { // TWC3119-913 - Prevent issues when just modifying the description/toolip
                    this.errorMsg = "This Combination of [Customer, Group, DealType, Dropdown] already exists.";
                    this.loggerService.error("This Combination of [Customer, Group, DealType, Dropdown] already exists.", "Validation Error");
                    return false;
                }
            } else if (MATCHING_DROPDOWNS.filter(x => x.ACTV_IND != model.ACTV_IND && x.ATRB_LKUP_SID != model.ATRB_LKUP_SID).length == 1) {
                this.errorMsg = "This Combination of [Customer, Group, DealType, Dropdown] already exists.";
                this.loggerService.error("This Combination of [Customer, Group, DealType, Dropdown] already exists.", "Validation Error");
                return false;
            }
        } else {
            if (indexOf(this.distinctCustomerName, model.CUST_NM) === -1) {
                this.errorMsg = "Please Select Valid Customer Name.";
                this.loggerService.error("Please Select Valid Customer Name.", "Validation Error");
                return false;
            }

            if (indexOf(this.distinctAtributeCd, model.ATRB_CD) === -1) {
                this.errorMsg = "Please Select Valid Attribute Code";
                this.loggerService.error("Please Select Valid Attribute Code.", "Validation Error");
                return false;
            }

            if (indexOf(this.distinctSetTypeCd, model.OBJ_SET_TYPE_CD) === -1) {
                this.errorMsg = "Please Select Valid Deal Type";
                this.loggerService.error("Please Select Valid Deal Type.", "Validation Error");
                return false;
            }
        }

        return true;
    }
    //End of functions

    //Events called via html : Starts
    async addHandler({ sender }) {
        this.isDirty=true;
        this.closeEditor(sender);
        this.isLoading = true
        await this.getDealTypeDataSource();
        await this.getGroupsDataSource();
        await this.getCustomersDataSource();
        this.isLoading = false

        this.formGroup = new FormGroup({
            ACTV_IND: new FormControl(false, Validators.required),
            OBJ_SET_TYPE_CD: new FormControl(this.distinctSetTypeCd[0], Validators.required),
            OBJ_SET_TYPE_SID: new FormControl(),
            ATRB_CD: new FormControl(this.distinctAtributeCd[0], Validators.required),
            ATRB_SID: new FormControl(),
            CUST_NM: new FormControl(this.distinctCustomerName[0], Validators.required),
            CUST_MBR_SID: new FormControl(),
            CUST_MAP_ID: new FormControl(),
            DROP_DOWN: new FormControl("", Validators.required),
            ATRB_LKUP_DESC: new FormControl(""),
            ATRB_LKUP_TTIP: new FormControl(""),
            ORD: new FormControl()
        });
        this.distinctSetTypeCd = this.fullDistinctSetTypeCd;
        this.formGroup.valueChanges.subscribe(() => {
            this.isFormChange = true;
        });

        sender.addRow(this.formGroup);
    }

    editHandler({ sender, rowIndex, dataItem }) {
            this.isDirty = true;
            this.closeEditor(sender);
            this.isFormChange = false;
            this.distinctSetTypeCd = [dataItem.OBJ_SET_TYPE_CD];
            this.distinctAtributeCd = [dataItem.ATRB_CD];
            this.distinctCustomerName = [dataItem.CUST_NM];
            this.formGroup = new FormGroup({
                ACTV_IND: new FormControl(dataItem.ACTV_IND),
                OBJ_SET_TYPE_CD: new FormControl({ value: dataItem.OBJ_SET_TYPE_CD, disabled: true }),
                OBJ_SET_TYPE_SID: new FormControl(dataItem.OBJ_SET_TYPE_SID),
                ATRB_CD: new FormControl({ value: dataItem.ATRB_CD, disabled: true }),
                ATRB_SID: new FormControl(dataItem.ATRB_SID),
                CUST_NM: new FormControl({ value: dataItem.CUST_NM, disabled: true }),
                CUST_MBR_SID: new FormControl(dataItem.CUST_MBR_SID),
                CUST_MAP_ID: new FormControl(dataItem.CUST_MAP_ID),
                DROP_DOWN: new FormControl({ value: dataItem.DROP_DOWN, disabled: true }),
                ATRB_LKUP_DESC: new FormControl(dataItem.ATRB_LKUP_DESC),
                ATRB_LKUP_TTIP: new FormControl(dataItem.ATRB_LKUP_TTIP),
                ORD: new FormControl(dataItem.ORD)
            });
        //Unused cnsmptn edit for Account SA,Account SA-D & SA-D only
        if ((<any>window).usrRole == "SA" && ((<any>window).isCustomerAdmin || (<any>window).isDeveloper)) {
            //for Account SA-D & SA-D, only restrictedGroupList can edit value field
            for (let i = 0; i < this.restrictedGroupList.length; i++) {
                if (this.restrictedGroupList[i] === dataItem.ATRB_SID) {
                    //if CHK_VALUE is 1, Value column will be readonly
                    if (dataItem.CHK_VALUE == 1) {
                        this.formGroup.get('DROP_DOWN')?.disable();
                        this.loggerService.warn("Readonly, there is an existing deal with this value.", "Warning");
                    }
                    //if CHK_VALUE is 0, Value column will be editable, user can update new value
                    else {
                        this.formGroup.get('DROP_DOWN')?.enable();
                    }
                }
            }
        }
            this.formGroup.valueChanges.subscribe(() => {
                this.isFormChange = true;
            });
            this.editedRowIndex = rowIndex;
            sender.editRow(rowIndex, this.formGroup);
        }
    

    cancelHandler({ sender, rowIndex }) {
        this.closeEditor(sender, rowIndex);
    }

    saveHandler({ sender, rowIndex, formGroup, isNew, dataItem }) {
        let newUiDropdown: UiDropdownItem = formGroup.getRawValue();
        //for disabled formgroup, using the dropdown datasource to get the ID value as in dataItem the value coming as null
        const FILTERED_DROPDOWN = this.gridResult.filter(x => x.OBJ_SET_TYPE_CD === newUiDropdown.OBJ_SET_TYPE_CD);
        if (FILTERED_DROPDOWN.length > 0) {
            newUiDropdown.OBJ_SET_TYPE_SID = FILTERED_DROPDOWN[0].OBJ_SET_TYPE_SID;
        }

        if (isNew) {
            const GroupSID = this.GroupData.filter(x => x.dropdownName == newUiDropdown.ATRB_CD)
            if (GroupSID.length > 0) {
                newUiDropdown.ATRB_SID = GroupSID[0]["dropdownID"];
            }
            const customerSID = this.CustomerData.filter(x => x.dropdownName == newUiDropdown.CUST_NM)
            if (customerSID.length > 0) {
                newUiDropdown.CUST_MBR_SID = customerSID[0]["dropdownID"];
            }
        }

        if (!isNew) {
            newUiDropdown.ATRB_LKUP_SID = dataItem.ATRB_LKUP_SID;
        }

        //check the combination exists
        if (this.isFormChange) {
            this.isModelValid = this.checkModelValid(newUiDropdown, isNew);
            if (this.isModelValid) {
                if (isNew) {
                    this.isLoading = true;
                    this.dropdownService.insertBasicDropdowns(newUiDropdown).pipe(takeUntil(this.destroy$)).subscribe((result) => {
                        this.selectedInheritanceGroup = "";
                        if (result.ATRB_CD == "MRKT_SEG_COMBINED") {
                            this.nonCorpInheritableValues.push(result);
                        }
                        this.gridResult.push(newUiDropdown);
                        this.loadUiDropdown();
                        this.loggerService.success("New Dropdown Added.")
                    }, (error) => {
                        this.loggerService.error("Unable to insert Dropdown.", error);
                        this.isLoading = false;
                    });
                } else {
                    this.isLoading = true;
                    this.dropdownService.updateBasicDropdowns(newUiDropdown).pipe(takeUntil(this.destroy$)).subscribe((response) => {
                        this.gridResult[rowIndex] = newUiDropdown;
                        this.gridResult.push(newUiDropdown);
                        this.loadUiDropdown();
                        //check if the value is existing or not while clicking on savehandler
                        if (response.CHK_VALUE == 1) {
                            this.loggerService.warn("Unable to update as deal with this value is existing", "Warning");
                        }
                        else {
                            this.loggerService.success("Updated Successfully", "Success");
                        }
                    }, (error) => {
                        this.loggerService.error("Unable to update UI dropdown data.", error);
                        this.isLoading = false;
                    });
                }
            }
            this.isDirty = false;
        }

        sender.closeRow(rowIndex);
    }

    removeHandler({ dataItem }) {
        this.deleteDropdownData = dataItem;
        this.deleteItem = dataItem.ATRB_LKUP_SID;
        this.deleteATRB_CDItem = dataItem.ATRB_CD;
        this.deleteDROP_DOWNItem = dataItem.DROP_DOWN;
        this.isDialogVisible = true;
    }

    //UI button click : Starts
    clearFilter() {
        this.state.skip = 0;
        this.state.take = 25;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadUiDropdown();
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.loadUiDropdown();
    }

    refreshGrid() {
        this.isLoading = true;
        this.state.skip = 0;
        this.state.take = 25;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadUiDropdown();
    }

    closeEditor(grid, rowIndex = this.editedRowIndex) {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
    }

    close() {
        this.isDialogVisible = false;
    }

    canDeactivate(): Observable<boolean> | boolean {
        return !this.isDirty;
    }

    deleteRecord() {
        this.isDialogVisible = false;
        this.dropdownService.deleteBasicDropdowns(this.deleteDropdownData).pipe(takeUntil(this.destroy$)).subscribe(() => {
            if (this.deleteATRB_CDItem == "MRKT_SEG_COMBINED") {
                const indx = this.nonCorpInheritableValues.indexOf(this.deleteDROP_DOWNItem);
                if (indx > -1) {
                    this.nonCorpInheritableValues.splice(indx, 1);
                }
            }
            this.refreshGrid();
            this.loggerService.success("UI Dropdown successfully deleted or deactivated.")
        }, (errorResponse) => {
            this.loggerService.error(
                "Unable to delete row Data.",
                errorResponse,
                errorResponse.statusText
            );
        });
    }
    // UI button click ends

    async openBulkUploadDialog() {
        this.isLoading = true;
        await this.getDealTypeDataSource();
        await this.getGroupsDataSource();
        await this.getCustomersDataSource();
        this.isLoading = false;
        const DIALOG_REF = this.dialogService.open(DropdownBulkUploadDialogComponent, {
            width: '80%',
            disableClose: true,
            panelClass: 'upload-modal',
            data: {
                dealTypeDropdownData: this.distinctSetTypeCd,
                dealTypeData: this.DealTypeData,
                groupDropdownData: this.distinctAtributeCd,
                groupData: this.GroupData,
                customerDropdownData: this.distinctCustomerName,
                customerData: this.CustomerData
            }
        });

        DIALOG_REF.afterClosed().subscribe(() => {
            this.refreshGrid();
        });
    }

    ngOnInit() {
        this.checkRestrictionFlag = ((<any>window).usrRole === 'SA' && !(<any>window).isDeveloper) === false ? true : false;
        this.isDeveloperFlag = (<any>window).isDeveloper;
        this.initialization();
    }

    // destroy the subject so in this case all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

}