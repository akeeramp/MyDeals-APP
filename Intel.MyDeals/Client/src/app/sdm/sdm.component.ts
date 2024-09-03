import { Component } from "@angular/core";
import { logger } from "../shared/logger/logger";
import { ExcelColumnsConfig } from "../admin/ExcelColumnsconfig.util";
import { MatDialog } from '@angular/material/dialog';
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { sdmService } from "./sdm.service";
import { Subject } from "rxjs";
import { FormGroup, FormControl, Validators, ValidationErrors } from "@angular/forms";
import { SdmMasterDataModalComponent } from "./sdmMasterDataModal/sdmMasterDataModal.component";
import { takeUntil } from "rxjs/operators";
import { GridUtil } from "../contract/grid.util";
import { MomentService } from "../shared/moment/moment.service";


@Component({
    selector: "sdm-dashboard",
    templateUrl: "Client/src/app/sdm/sdm.component.html",
    styleUrls: ["Client/src/app/sdm/sdm.component.css"]
})
export class SDMComponent {
    constructor(private loggerSvc: logger,
        private sdmService: sdmService,
        protected dialog: MatDialog,
        private momentService: MomentService) {        
    }

    private readonly destroy$ = new Subject();
    private files: any = [];
    public formGroup: FormGroup;
    private editedRowIndex: number;
    public isFormChange = false;
    public isDirty = false;
    public isDialogVisible = false;
    private isExportAllDialogVisible = false;
    public sdmDataRmv = [];
    public filter = {
        "CYCLE_NM": [],
        "CPU_VRT_NM": [],
        "CPU_PROCESSOR_NUMBER": [],
        "CPU_SKU_NM": [],
        "PCSR_NBR": [],
        "PRD_CAT_NM": [],
        "SKU_NM" : []
    };
    public slctedData = {
        "CYCLE_NM": undefined,
        "CPU_VRT_NM": undefined,
        "CPU_PROCESSOR_NUMBER": undefined,
        "CPU_SKU_NM": undefined,
        "STRT_DT": undefined,
        "END_DT": undefined
    }
    private isBusy = false;
    private gridData: GridDataResult;
    private gridResult: Array<any> = [];
    public totalRecs: number;
    private whereStgFilter = "all";
    public loaderMsg = 'Please wait while we fetch Retail Pull Dollar Data...';
    private orderByStg = ""   

    public state: State = {
        skip: 0,
        take: 25
    };

    private readonly pageSizes: PageSizeItem[] = [
        { text: "25", value: 25 },
        { text: "50", value: 50 },
        { text: "100", value: 100 },
        { text: "250", value: 250 },
        { text: "1000", value: 1000 }
    ];

    getColHeaders() {// for getting column headers from config file
        return ExcelColumnsConfig.SDMBulkCopyColHeaders;
    }

    getColumns() {// for getting column meta-data from config file
        return ExcelColumnsConfig.SDMBulkCopyColumns;
    }
    onFileUploadError() {
        this.files = [];
        this.loggerSvc.error("Unable to upload attachment.", "Upload failed");
    }

    //created for Angular loader
    validateData() {
        const element = document.getElementsByClassName('k-upload-selected') as HTMLCollectionOf<HTMLElement>;
        if (element && element.length > 0)
            element[0].click();
    }

    loadSdmRecords(pageChange = false,exportAll = false) {
        //if page change is true we will not be fetching total count 
        this.isBusy = true;
        const data = {
            take: exportAll ? this.totalRecs : this.state.take,//for export all use take - this.totalRecs
            skip: exportAll ? 0 : this.state.skip,
            whereStg: this.whereStgFilter,
            orderBy: this.orderByStg,
            pageChange: pageChange
        }
        this.sdmService.getSDMStageData(data).subscribe(
            (result: any) => {
                if (!exportAll) {
                    this.gridResult = result.Data;
                    const newState = {
                        take: this.state.take,
                        skip: 0
                    }
                    const data = process(this.gridResult, newState);
                    //total records stored so that on page change the page count is not fetched again
                    this.totalRecs = !pageChange ? result.TotalCount : this.totalRecs;
                    this.gridData = {
                        data: data.data,
                        total: this.totalRecs
                    };
                    this.isBusy = false;                    
                } else {
                    const timestamp = this.sdmService.getFormattedTimestamp();
                    const fileName = `RPD_Data_Export_All_${timestamp}.xlsx`;
                    GridUtil.dsToExcelSdm(result.Data, 'RPD_Data', fileName);
                    this.isBusy = false;
                }                
            },
            (err) => {
                this.isBusy = false;
                this.loggerSvc.error("Unable to get Retail Pull Dollar Master Data", err, err.statusText);
            }
        )
    }


    getDropValues(filter: string, type: string) {
        if (filter && filter.length >= 2) {
            let data;
            //for getting the dropdown values in add record combobox
            if (type == 'PRD_CAT_NM' || type == 'PCSR_NBR' || type == 'SKU_NM') {
                const addlFilter = type == 'PCSR_NBR' ? `PCSR.CPU_VRT_NM = '${this.formGroup.getRawValue()['CPU_VRT_NM']}'` : type == 'SKU_NM' ? `PCSR.CPU_VRT_NM = '${this.formGroup.getRawValue()['CPU_VRT_NM']}' AND PCSR.CPU_PROCESSOR_NUMBER = '${this.formGroup.getRawValue()['CPU_PROCESSOR_NUMBER']}'` : '';
                data = {
                    filter: filter,
                    colNm: type == 'PRD_CAT_NM' ? 'CPU_VRT_NM' : type == 'PCSR_NBR' ? 'CPU_PROCESSOR_NUMBER' : "CPU_SKU_NM",
                    tblNm: 'dimTbl',
                    addlFilter: addlFilter,
                    addRow: true
                }
            } else {
                //for getting dropdown data in filter combobox
                data = {
                    filter: filter,
                    colNm: type,
                    tblNm: 'StgTbl',
                    addlFilter: '',
                    addRow: false
                }

            }
            this.sdmService.getSdmDropValues(data).subscribe(res => {
                this.filter[type] = res;
                if (type == 'SKU_NM') {
                    this.formGroup.get('CPU_SKU_NM').enable();
                    this.formGroup.get('CPU_SKU_NM').setValue(this.filter[type][0]);
                }

            });
        }
    }

    //constructs the where condition dynamically
    filterSdmGrid() {
        this.loaderMsg = 'Please wait while we fetch Retail Pull Dollar Data...';
        let whereStg = 'WHERE ';
        Object.keys(this.slctedData).forEach(key => {
            if (key == 'STRT_DT') {
                if (this.slctedData[key])
                    whereStg = whereStg == 'WHERE ' ? whereStg + "CHG_DTM >= '" + this.momentService.moment(this.slctedData[key]).format("MM/DD/YYYY") + "'" : whereStg + " AND " + "CHG_DTM >= '" + this.momentService.moment(this.slctedData[key]).format("MM/DD/YYYY") + "'"
            }else if (key == 'END_DT') {
                if (this.slctedData[key])
                    whereStg = whereStg == 'WHERE ' ? whereStg + "CHG_DTM <= '" + this.momentService.moment(this.slctedData[key]).format("MM/DD/YYYY") + "'" : whereStg + " AND " + "CHG_DTM <= '" + this.momentService.moment(this.slctedData[key]).format("MM/DD/YYYY") + "'"
            } else {
                if (this.slctedData[key])
                    whereStg = whereStg == 'WHERE ' ? whereStg + key + " = '" + this.slctedData[key] + "'" : whereStg + " AND " + key + " = '" + this.slctedData[key] + "'"
            }
           
        });
        whereStg = whereStg == 'WHERE ' ? 'all' : whereStg;

        this.whereStgFilter = whereStg;
        this.state.skip = 0;
        this.applySorting();
    }

    applySorting() {
        this.orderByStg = '';
        let orderBy = '';
        if (this.state.sort && this.state.sort.length) {
            orderBy = this.state.sort.map(s => `${s.field} ${s.dir}`).join(', ');
        } else {
            orderBy = 'CHG_DTM DESC, CYCLE_NM DESC'; // Default sort field if no sorting is applied
        }
        //Apply Default sorting condition
        this.orderByStg = `ORDER BY ${orderBy}`;
        this.loadSdmRecords();
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.loaderMsg = 'Please wait while we fetch Retail Pull Dollar Data...';
        const isPageChange = this.state.skip !== state.skip || this.state.take !== state.take;
        this.state = state;
        if (isPageChange) {
            this.loadSdmRecords(true);
        } else {
            this.applySorting();
        }
    }

    closeEditor(grid, rowIndex = this.editedRowIndex) {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
    }

    dateValidator(date) {
        return (group: FormGroup): ValidationErrors | null => {
            const startDate = (date == 'CURR_STRT_DT') ? this.momentService.moment(group.value).format("MM/DD/YYYY") : this.formGroup ? this.momentService.moment(this.formGroup.get('CURR_STRT_DT').value).format("MM/DD/YYYY") : null;
            const endDate = (date == 'CURR_END_DT') ? this.momentService.moment(group.value).format("MM/DD/YYYY") : this.formGroup ? this.momentService.moment(this.formGroup.get('CURR_END_DT').value).format("MM/DD/YYYY") : null;
            const currDate = this.momentService.moment().format("MM/DD/YYYY");
            if (date == 'CURR_STRT_DT') {
                return startDate && startDate != "Invalid Date" && (startDate < currDate) ? {
                    val: "Start date cannot be less than the current date."
                } : (endDate && endDate != "Invalid Date" && startDate > endDate) ? {
                    val: "Start date must be less than than End date"
                } : null;
            }
            else {
                return startDate && endDate && endDate != "Invalid Date" && startDate > endDate ? {
                    val: "End date must be greater than Start date"
                } : null;
            }
        }                
}

    addHandler({ sender }) {
        this.isDirty = true;
        this.closeEditor(sender);
        this.formGroup = new FormGroup({
            CYCLE_NM: new FormControl('', Validators.required),
            CURR_STRT_DT: new FormControl('', [Validators.required, this.dateValidator('CURR_STRT_DT')]),
            CURR_END_DT: new FormControl('', [Validators.required, this.dateValidator('CURR_END_DT')]),
            CPU_VRT_NM: new FormControl('', Validators.required),
            CPU_SKU_NM: new FormControl({ value: '', disabled: true }, Validators.required),
            CPU_PROCESSOR_NUMBER: new FormControl({ value: '', disabled: true }, Validators.required), //Initially disabled
            CPU_FLR: new FormControl(),
            APAC_PD: new FormControl(),
            IJKK_PD: new FormControl(),
            PRC_PD: new FormControl(),
            EMEA_PD: new FormControl(),
            ASMO_PD: new FormControl(),
            IS_DELETE: new FormControl('N')
        });
        //cpu prcsr number will be only enabled after cpu vrt name is selected
        this.formGroup.get('CPU_VRT_NM').valueChanges.subscribe((selectedVrtNm) => {
            if (selectedVrtNm) {
                this.formGroup.get('CPU_PROCESSOR_NUMBER').enable();
            } else {
                this.formGroup.get('CPU_PROCESSOR_NUMBER').setValue('');
                this.filter.PCSR_NBR = [];
                this.formGroup.get('CPU_PROCESSOR_NUMBER').disable();
            }
        });
        //cpu sku name will be only enabled after cpu prcsr number is selected
        this.formGroup.get('CPU_PROCESSOR_NUMBER').valueChanges.subscribe((selectedPcsrNm) => {
            if (selectedPcsrNm) {
                this.getDropValues(selectedPcsrNm, 'SKU_NM');
            } else {
                this.formGroup.get('CPU_SKU_NM').setValue('');
                this.filter.SKU_NM = [];
                this.formGroup.get('CPU_SKU_NM').disable();
            }
        });
        this.formGroup.valueChanges.subscribe(() => {
            this.isFormChange = true;
        });

        sender.addRow(this.formGroup);
    }

    editHandler({ sender, rowIndex, dataItem }) {
        this.isDirty = true;
        this.closeEditor(sender);
        this.isFormChange = false;
        this.filter.PCSR_NBR = [];
        this.filter.PRD_CAT_NM = [];
        this.filter.PCSR_NBR.push(dataItem.CPU_PROCESSOR_NUMBER);
        this.filter.PRD_CAT_NM.push(dataItem.CPU_VRT_NM);
        this.filter.SKU_NM.push(dataItem.CPU_SKU_NM);
        this.formGroup = new FormGroup({
            CYCLE_NM: new FormControl({ value: dataItem.CYCLE_NM, disabled: true }),
            CURR_STRT_DT: new FormControl({ value: new Date(dataItem.CURR_STRT_DT), disabled: true }),
            CURR_END_DT: new FormControl({ value: new Date(dataItem.CURR_END_DT), disabled: true }),
            CPU_VRT_NM: new FormControl({ value: dataItem.CPU_VRT_NM, disabled: true }),
            CPU_SKU_NM: new FormControl({ value: dataItem.CPU_SKU_NM, disabled: true }),
            CPU_PROCESSOR_NUMBER: new FormControl({ value: dataItem.CPU_PROCESSOR_NUMBER, disabled: true }),
            CPU_FLR: new FormControl(dataItem.CPU_FLR),
            APAC_PD: new FormControl(dataItem.APAC_PD),
            IJKK_PD: new FormControl(dataItem.IJKK_PD),
            PRC_PD: new FormControl(dataItem.PRC_PD),
            EMEA_PD: new FormControl(dataItem.EMEA_PD),
            ASMO_PD: new FormControl(dataItem.ASMO_PD),
            IS_DELETE: new FormControl('N')
        });
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.isFormChange = true;
        });
        this.editedRowIndex = rowIndex;
        sender.editRow(rowIndex, this.formGroup);
    }

    cancelHandler({ sender, rowIndex }) {
        this.closeEditor(sender, rowIndex);
    }

    saveHandler({ sender, rowIndex, formGroup }) {
        const sdmData = [];
        sdmData.push(formGroup.getRawValue());
        sdmData[0].CURR_STRT_DT = this.momentService.moment(sdmData[0].CURR_STRT_DT).format("MM/DD/YYYY");
        sdmData[0].CURR_END_DT = this.momentService.moment(sdmData[0].CURR_END_DT).format("MM/DD/YYYY");
        //check the combination exists
        if (this.isFormChange) {
            if (!rowIndex)
                this.updateHandler('update', sdmData);
            else
                this.updateHandler('create', sdmData);

        }
        sender.closeRow(rowIndex);
    }

    removeHandler({ dataItem }) {
        this.sdmDataRmv = [];
        this.sdmDataRmv.push(dataItem);
        this.sdmDataRmv[0].IS_DELETE = 'Y';
        this.isDialogVisible = true;
    }

    updateHandler(process, sdmData) {
        this.loaderMsg = 'Please wait while we ' + process + ' Retail Pull Dollar Data...'
        this.sdmService.updtSdmData(sdmData).pipe(takeUntil(this.destroy$)).subscribe(
            (response) => {
                if (response) {
                    if (response == 'SUCCESS') {
                        this.loggerSvc.success("Retail Pull Dollar Data " + process + "d successfully.");
                        this.loadSdmRecords();
                    } else {
                        this.loggerSvc.error("Unable to " + process + " Retail Pull Dollar Data.", "The Data Combination is incorrect...");
                    }
                }
            },
            err => {
                this.loggerSvc.error("Unable to update Retail Pull Dollar Data", err.statusText);
            }
        );
    }

    deleteRecord() {
        this.isDialogVisible = false;
        this.updateHandler('delete', this.sdmDataRmv);
    }

    close() {
        this.isDialogVisible = false;
    }

    refreshGrid() {
        this.state = {
            skip: 0,
            take: 25
        };
        this.filterSdmGrid();
    }

    clearFilter() {
        this.state = {
            skip: 0,
            take: 25
        };
        this.whereStgFilter = "";
        this.slctedData = {
            "CYCLE_NM": undefined,
            "CPU_VRT_NM": undefined,
            "CPU_PROCESSOR_NUMBER": undefined,
            "CPU_SKU_NM": undefined,
            "STRT_DT": undefined,
            "END_DT": undefined
        }
        this.filterSdmGrid();
    }


    redirectToSdmBulkUpload() {
        document.location.href = "RPD#/RpdBulkupload";
    }

    openMasterDataModal() {
        this.dialog.open(SdmMasterDataModalComponent, {
            width: "1350px",
            panelClass: "sdmMasterDataModal"
        });
    }
    
    excelSelection(event): void {
        const timestamp = this.sdmService.getFormattedTimestamp();
        const fileName = `RPD_Data_Export_View_${timestamp}.xlsx`;
        this.isExportAllDialogVisible = event.item.text === "Export All Data, Complete Records" ? true : false;
        if (event.item.text === "Export Current View")      
            GridUtil.dsToExcelSdm(this.gridResult, 'RPD_Data', fileName);
        
    }

    downloadAllExcelRecords() {
        this.isExportAllDialogVisible = false;  
        this.loaderMsg = 'Please wait while we export Retail Pull Dollar Data...'
        this.loadSdmRecords(true, true);        
    }

    closeExcelDialog() {
        this.isExportAllDialogVisible = false;
    }
    
    ngOnInit() {
        this.filterSdmGrid();
    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}