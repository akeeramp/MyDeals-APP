import { logger } from "../../shared/logger/logger";
import { AdminEnvironmentsService } from "./admin.environments.service";
import { Component, OnDestroy } from "@angular/core";
import { Const_Map, Envir_Map, Svr_Map } from './admin.environments.model';
import { ThemePalette } from "@angular/material/core";
import { GridDataResult, DataStateChangeEvent, PageSizeItem, AddEvent, EditEvent, RemoveEvent, CancelEvent, SaveEvent, GridComponent } from "@progress/kendo-angular-grid";
import { process, State, distinct } from "@progress/kendo-data-query";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";
import { PendingChangesGuard } from "src/app/shared/util/gaurdprotectionDeactivate";
import { Observable } from "rxjs";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: 'environments',
    templateUrl: 'Client/src/app/admin/environmentDetails/admin.environments.component.html',
    styleUrls: ['Client/src/app/admin/environmentDetails/admin.environments.component.css']
})
export class EnvironmentsComponent implements PendingChangesGuard, OnDestroy {
    constructor(private environmentsSvc: AdminEnvironmentsService, private loggerSvc: logger) {
        this.allData = this.allData.bind(this);
        this.svrallData = this.svrallData.bind(this);
    }

    public dropdownFieldsData = [];
    public SELECT_TYPE: any;
    private EnvGrid: boolean = true;
    private SvrGrid: boolean = false;
    private gridCaption: string;

    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    private isLoading = true;
    private allowCustom = true;
    private color: ThemePalette = "primary";


    // Start Environment
    isDirty = false;
    public gridResult: Array<Envir_Map>;
    public constData: Array<Envir_Map>;
    public formGroup: FormGroup;
    public isFormChange = false;
    public isCnstNmEditable = false;
    private editedRowIndex: number;
    private adminBannerMessage: string;
    private isDialogVisible = false;
    private isEdit = false;
    private deleteItem: Envir_Map;
    private isActionable = true;
    // End Environment


    // Start Server
    serverisDirty = false;
    public servergridResult: Array<Svr_Map>;
    public serverconstData: Array<Svr_Map>;
    public serverformGroup: FormGroup;
    public serverisFormChange = false;
    public serverisCnstNmEditable = false;
    private servereditedRowIndex: number;
    private serveradminBannerMessage: string;
    private serverisDialogVisible = false;
    private serverisEdit = false;
    private serverdeleteItem: Svr_Map;
    // End Server


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
            value: 250
        },
        {
            text: "All",
            value: "all",
        }
    ];

    // Start Environments

    public ddlchangeselecttype($even) {
        if (this.SELECT_TYPE.DROP_DOWN_TEXT === "Environment") {
            this.gridCaption = "Environment";
            this.EnvGrid = true;
            this.SvrGrid = false;
            this.loadEnvDetails()
        }
        if (this.SELECT_TYPE.DROP_DOWN_TEXT === "Linked Server Details") {
            this.gridCaption = "Linked Server";
            this.SvrGrid = true;
            this.EnvGrid = false;
            this.loadsvrDetails();
        }
    }

    public gridData: GridDataResult;
    distinctPrimitive(fieldName: string, gridName: string): Array<string> {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }

    public allData(): ExcelExportData {
        const excelState: State = {};
        Object.assign(excelState, this.state)
        excelState.take = this.gridResult.length;

        const result: ExcelExportData = {
            data: process(this.gridResult, excelState).data,
        };

        return result;
    }




    public onEnvExcelExport(e: ExcelExportEvent): void {
        e.workbook.sheets[0].title = "Users Export";
    }

    EnvclearFilter(): void {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }

    loadEnvDetails(): void {
        this.environmentsSvc.getEnvironments()
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (result: Array<Envir_Map>) => {
                    this.gridResult = result;
                    this.constData = result;
                    this.gridData = process(this.gridResult, this.state);
                    this.isLoading = false;
                },
                function (response) {
                    this.loggerSvc.error(
                        "Unable to get Environment Data.",
                        response,
                        response.statusText
                    );
                }
            )
    }

    updateEnvBannerMessage(constant: Envir_Map): void {
        if (constant.ENVT_NM == 'ADMIN_MESSAGE') {
            this.adminBannerMessage = constant.DB_ENVT_NM == 'NA'
                ? "" : constant.DB_ENVT_NM;
        }
    }

    dataEnvStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    EnvcloseEditor(grid: GridComponent, rowIndex = this.editedRowIndex): void {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
    }

    EnvaddHandler({ sender }: AddEvent): void {
        this.isDirty = true;
        this.EnvcloseEditor(sender);
        this.isCnstNmEditable = true;
        this.formGroup = new FormGroup({
            ENVT_SID: new FormControl(),
            ENVT_NM: new FormControl("", Validators.required),
            DB_ENVT_NM: new FormControl("", Validators.required),
            DB_VANITY_CONN_STR: new FormControl("", Validators.required),
            DB_SRVR_DTL: new FormControl("", Validators.required),
            GRAFANA_DASHBOARD_LINK: new FormControl("", Validators.required),
            MANAGED_OWNERS: new FormControl("", Validators.required),
            WEBISTE_LINK: new FormControl("", Validators.required),
            APP_SERVER: new FormControl("", Validators.required),
            WIN_JOBS_HOSTED_MCHN: new FormControl("", Validators.required),
            SSIS_SRVR_CONN_STR: new FormControl("", Validators.required),
            SSIS_CATALOGUE_FOLDER: new FormControl("", Validators.required),
            SSIS_CATALOGUE_SRVR_DTL: new FormControl("", Validators.required),
            ACTV_IND: new FormControl(false, Validators.required),
        });
        this.formGroup.valueChanges.subscribe(() => {
            this.isFormChange = true;
        });

        sender.addRow(this.formGroup);
    }

    EnveditHandler({ sender, rowIndex, dataItem }: EditEvent): void {
        this.isDirty = true;
        this.EnvcloseEditor(sender);
        this.isFormChange = false;
        this.formGroup = new FormGroup({
            ENVT_SID: new FormControl({ value: dataItem.ENVT_SID }),
            ENVT_NM: new FormControl(dataItem.ENVT_NM, Validators.required),
            DB_ENVT_NM: new FormControl(dataItem.DB_ENVT_NM, Validators.required),
            DB_VANITY_CONN_STR: new FormControl(dataItem.DB_VANITY_CONN_STR, Validators.required),
            DB_SRVR_DTL: new FormControl(dataItem.DB_SRVR_DTL, Validators.required),
            GRAFANA_DASHBOARD_LINK: new FormControl(dataItem.GRAFANA_DASHBOARD_LINK, Validators.required),
            MANAGED_OWNERS: new FormControl(dataItem.MANAGED_OWNERS, Validators.required),
            WEBISTE_LINK: new FormControl(dataItem.WEBISTE_LINK, Validators.required),
            APP_SERVER: new FormControl(dataItem.APP_SERVER, Validators.required),
            WIN_JOBS_HOSTED_MCHN: new FormControl(dataItem.WIN_JOBS_HOSTED_MCHN, Validators.required),
            SSIS_SRVR_CONN_STR: new FormControl(dataItem.SSIS_SRVR_CONN_STR, Validators.required),
            SSIS_CATALOGUE_FOLDER: new FormControl(dataItem.SSIS_CATALOGUE_FOLDER, Validators.required),
            SSIS_CATALOGUE_SRVR_DTL: new FormControl(dataItem.SSIS_CATALOGUE_SRVR_DTL, Validators.required),
            ACTV_IND: new FormControl(dataItem.ACTV_IND, Validators.required),
        });
        this.formGroup.valueChanges.subscribe(() => {
            this.isFormChange = true;
        });
        this.editedRowIndex = rowIndex;
        sender.editRow(rowIndex, this.formGroup);
    }

    EnvremoveHandler({ dataItem }: RemoveEvent): void {
        this.deleteItem = dataItem;
        this.isDialogVisible = true;
    }

    Envclose(): void {
        this.isDialogVisible = false;
    }

    EnvcancelHandler({ sender, rowIndex }: CancelEvent): void {
        this.EnvcloseEditor(sender, rowIndex);
        this.isCnstNmEditable = false;
    }

    EnvsaveHandler({ sender, rowIndex, formGroup, isNew, dataItem }: SaveEvent): void {
        this.isCnstNmEditable = false;
        const Envir_Map: Envir_Map = formGroup.value;
        if (!isNew) {
            formGroup.value.ENVT_NM = dataItem.ENVT_NM;
        }

        const filteredCnst = this.gridResult.filter(x => x.ENVT_NM === Envir_Map.ENVT_NM);
        if (filteredCnst.length > 0) {
            Envir_Map.ENVT_SID = filteredCnst[0].ENVT_SID;
        }
        if (this.isFormChange) {
            this.isDirty = false;
            if (isNew) {
                this.isLoading = true;
                this.environmentsSvc.insertEnvironments(Envir_Map).pipe(takeUntil(this.destroy$))
                    .subscribe(() => {
                        this.gridResult.push(Envir_Map);
                        this.updateEnvBannerMessage(Envir_Map);
                        this.loadEnvDetails();
                        this.loggerSvc.success("New Environment added.");
                    },
                        error => {
                            this.loggerSvc.error("Unable to save environment data.", error);
                            this.isLoading = false;
                        }
                    );
            }
            else {
                this.isLoading = true;
                this.isEdit = true;
                this.environmentsSvc.updateEnvironments(Envir_Map).pipe(takeUntil(this.destroy$))
                    .subscribe(() => {
                        this.gridResult[rowIndex] = Envir_Map;
                        this.gridResult.push(Envir_Map);
                        this.loadEnvDetails();
                        this.updateEnvBannerMessage(Envir_Map);
                        this.loggerSvc.success("Environment Updated.");
                    },
                        error => {
                            this.loggerSvc.error("Unable to update environment data.", error);
                            this.isLoading = false;
                        }
                    );
            }
        }
        sender.closeRow(rowIndex);
    }

    EnvrefreshGrid(): void {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadEnvDetails()
    }

    EnvdeleteRecord(): void {
        this.isDialogVisible = false;
        this.environmentsSvc.deleteEnvironments(this.deleteItem)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.EnvrefreshGrid();
                this.loggerSvc.success("Environment Deleted.");
            },
                function (response) {
                    this.loggerSvc.error(
                        "Unable to delete row Data.",
                        response,
                        response.statusText
                    );
                }
            )
    }

    // End Environments


    // Start Server

    public servergridData: GridDataResult;
    svrdistinctPrimitive(fieldName: string): Array<string> {
        return distinct(this.servergridResult, fieldName).map(item => item[fieldName]);
    }

    public svrallData(): ExcelExportData {
        const excelState: State = {};
        Object.assign(excelState, this.state)
        excelState.take = this.servergridResult.length;

        const result: ExcelExportData = {
            data: process(this.servergridResult, excelState).data,
        };

        return result;
    }

    public onsvrExcelExport(e: ExcelExportEvent): void {
        e.workbook.sheets[0].title = "Users Export";
    }

    svrclearFilter(): void {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.servergridData = process(this.servergridResult, this.state);
    }

    loadsvrDetails(): void {
        this.environmentsSvc.getSvrDetails()
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (result: Array<Svr_Map>) => {
                    this.servergridResult = result;
                    this.serverconstData = result;
                    this.servergridData = process(this.servergridResult, this.state);
                    this.isLoading = false;
                },
                function (response) {
                    this.loggerSvc.error(
                        "Unable to get server Data.",
                        response,
                        response.statusText
                    );
                }
            )
    }

    updatesvrBannerMessage(constant: Svr_Map): void {
        if (constant.LNKD_SRVR_NM == 'ADMIN_MESSAGE') {
            this.adminBannerMessage = constant.ENVT == 'NA'
                ? "" : constant.ENVT;
        }
    }

    datasvrStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.servergridData = process(this.servergridResult, this.state);
    }

    svrcloseEditor(grid: GridComponent, rowIndex = this.servereditedRowIndex): void {
        grid.closeRow(rowIndex);
        this.servereditedRowIndex = undefined;
        this.serverformGroup = undefined;
    }

    svraddHandler({ sender }: AddEvent): void {
        this.serverisDirty = true;
        this.EnvcloseEditor(sender);
        this.serverisCnstNmEditable = true;
        this.serverformGroup = new FormGroup({
            LNKD_SRVR_NM: new FormControl("", Validators.required),
            ENVT: new FormControl("", Validators.required),
            LNKD_SRVR_CONN_DTL: new FormControl("", Validators.required),
            CHK_QUERY: new FormControl("", Validators.required),
            LST_CHCKD_DTM: new FormControl("", Validators.required),
            LS_ERR_TXT: new FormControl("", Validators.required),
            ACTV_IND: new FormControl(false, Validators.required),
        });
        this.serverformGroup.valueChanges.subscribe(() => {
            this.serverisFormChange = true;
        });

        sender.addRow(this.serverformGroup);
    }

    svreditHandler({ sender, rowIndex, dataItem }: EditEvent): void {
        this.serverisDirty = true;
        this.svrcloseEditor(sender);
        this.serverisFormChange = false;
        this.serverformGroup = new FormGroup({
            LNKD_SRVR_NM: new FormControl(dataItem.LNKD_SRVR_NM, Validators.required),
            ENVT: new FormControl(dataItem.ENVT, Validators.required),
            LNKD_SRVR_CONN_DTL: new FormControl(dataItem.LNKD_SRVR_CONN_DTL, Validators.required),
            CHK_QUERY: new FormControl(dataItem.CHK_QUERY, Validators.required),
            LST_CHCKD_DTM: new FormControl(dataItem.LST_CHCKD_DTM),
            LS_ERR_TXT: new FormControl(dataItem.LS_ERR_TXT),
            ACTV_IND: new FormControl(dataItem.ACTV_IND, Validators.required),
        });
        this.serverformGroup.valueChanges.subscribe(() => {
            this.serverisFormChange = true;
        });
        this.servereditedRowIndex = rowIndex;
        sender.editRow(rowIndex, this.serverformGroup);
    }

    svrremoveHandler({ dataItem }: RemoveEvent): void {
        this.serverdeleteItem = dataItem;
        this.serverisDialogVisible = true;
    }

    svrclose(): void {
        this.serverisDialogVisible = false;
    }

    svrdeleteRecord(): void {
        this.serverisDialogVisible = false;
        this.environmentsSvc.deleteSvrDetails(this.serverdeleteItem)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.svrrefreshGrid();
                this.loggerSvc.success("Server Deleted.");
            },
                function (response) {
                    this.loggerSvc.error(
                        "Unable to delete row Data.",
                        response,
                        response.statusText
                    );
                }
            )
    }

    svrcancelHandler({ sender, rowIndex }: CancelEvent): void {
        this.svrcloseEditor(sender, rowIndex);
        this.serverisCnstNmEditable = false;
    }

    svrsaveHandler({ sender, rowIndex, formGroup, isNew, dataItem }: SaveEvent): void {
        this.serverisCnstNmEditable = false;
        const Svr_Map: Svr_Map = formGroup.value;
        if (!isNew) {
            formGroup.value.LNKD_SRVR_NM = dataItem.LNKD_SRVR_NM;
        }

        const filteredCnst = this.servergridResult.filter(x => x.LNKD_SRVR_NM === Svr_Map.LNKD_SRVR_NM);
        if (filteredCnst.length > 0) {
            Svr_Map.LNKD_SRVR_NM = filteredCnst[0].LNKD_SRVR_NM;
        }
        if (this.serverisFormChange) {
            this.serverisDirty = false;
            if (isNew) {
                this.isLoading = true;
                this.environmentsSvc.insertSvrDetails(Svr_Map).pipe(takeUntil(this.destroy$))
                    .subscribe(() => {
                        this.servergridResult.push(Svr_Map);
                        this.updatesvrBannerMessage(Svr_Map);
                        this.loadsvrDetails();
                        this.loggerSvc.success("New server added.");
                    },
                        error => {
                            this.loggerSvc.error("Unable to save server data.", error);
                            this.isLoading = false;
                        }
                    );
            }
            else {
                this.isLoading = true;
                this.serverisEdit = true;
                this.environmentsSvc.updateSvrDetails(Svr_Map).pipe(takeUntil(this.destroy$))
                    .subscribe(() => {
                        this.servergridResult[rowIndex] = Svr_Map;
                        this.servergridResult.push(Svr_Map);
                        this.loadsvrDetails();
                        this.updatesvrBannerMessage(Svr_Map);
                        this.loggerSvc.success("Server Updated.");
                    },
                        error => {
                            this.loggerSvc.error("Unable to update server data.", error);
                            this.isLoading = false;
                        }
                    );
            }
        }
        sender.closeRow(rowIndex);
    }

    svrrefreshGrid(): void {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadsvrDetails()
    }


    // End Server


    canDeactivate(): Observable<boolean> | boolean {
        return !this.isDirty;
    }

    ngOnInit(): void {
        this.getConstantDtl();
        this.gridCaption = "Environment";
        this.dropdownFieldsData = [
            {
                "DROP_DOWN_TEXT": "Environment",
                "DROP_DOWN_VALUE": "1"
            },
            {
                "DROP_DOWN_TEXT": "Linked Server Details",
                "DROP_DOWN_VALUE": "2"
            }
        ]
        this.SELECT_TYPE = this.dropdownFieldsData[0];
        this.loadEnvDetails()
    }

    getUserWwid(): string {
        return (<any>window).usrWwid;
    }

    getConstantDtl(): void {
        this.environmentsSvc.getConstantDtl()
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (result: Array<Const_Map>) => {
                    this.isActionable = result["CNST_VAL_TXT"].indexOf(this.getUserWwid()) > -1 ? false : true; 
                },
                function (response) {
                    this.loggerSvc.error(
                        "Unable to get Environment Data.",
                        response,
                        response.statusText
                    );
                }
            )
    }

    

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}