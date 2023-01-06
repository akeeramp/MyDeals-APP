import {  Component } from "@angular/core";
import { logger } from "../../shared/logger/logger";
 import * as _moment from "moment";
import { DataStateChangeEvent, GridDataResult, PageSizeItem } from "@progress/kendo-angular-grid";
import { State } from "@progress/kendo-data-query";
import { process, distinct } from "@progress/kendo-data-query";
import { adminlegalExceptionService } from "./admin.legalException.service";
import { adminexceptionDetailsComponent } from "./admin.exceptionDetails.component";
import { MatDialog } from "@angular/material/dialog";
import { adminamendmentExceptioncomponent } from "./admin.amendmentException.component";
import { admincompareExceptionscomponent } from "./admin.compareExceptions.component";
import { GridUtil } from "../../contract/grid.util";
import { DatePipe, formatDate } from '@angular/common';
import { adminDownloadExceptionscomponent } from "./admin.downloadExceptions.component"
import { adminviewDealListcomponent } from "./admin.viewDealList.component";

const moment = _moment;

@Component({
    selector: "admin-legal-exception",
    templateUrl: "Client/src/app/admin/legalException/admin.legalException.component.html",
    styleUrls: ['Client/src/app/admin/legalException/admin.legalException.component.css']
})

export class adminlegalExceptionComponent {
    public isVirtual = true;
    public gridData: GridDataResult;
    public data: unknown[];
    public mode = "virtual"; 
    private isLoading = true;
    private loadMessage = "Admin Customer Loading..";
    private type = "numeric";
    private info = true;
    private gridResult = [];
    public initExdetails: any; 
    public checkedExceptions = [];
    public dealList = "";
    private filterDataChildGrid: any = [];
    private childgridData: GridDataResult;
    private expandedDetailKeys: any[] = [];
    isHidden = false;
    childhidden = false;
    public editAccess: any;
    colexpand = 6;

    public state: State = {
        skip: 0,
        take: 25,
        sort: [],
        filter: {
            logic: "and",
            filters: [{
                logic: "and",
                filters: [{
                    field: "ACTV_IND",
                    operator: "eq",
                    value: true
                }],
            }],
        }
    };
    public childState: State = {
        skip: 0,
        take: 5,
        sort: [],
    };
     
    private pageSizes: PageSizeItem[] = [
        
        {
            text: "25",
            value: 25
        },
        {
            text: "50",
            value: 50
        },
        {
            text: "100",
            value: 100
        }
    ];

    constructor(private loggersvc: logger, private adminlegalExceptionSrv: adminlegalExceptionService,
         protected dialog: MatDialog,
        private datePipe: DatePipe) { }

    loadlegalException() {
         if ((<any>window).usrRole != 'SA' && !(<any>window).isDeveloper &&  (<any>window).usrRole != 'Legal' ) {
            document.location.href = "/Dashboard#/portal";
        }
        this.editAccess = ((<any>window).usrRole == "Legal" || (<any>window).isDeveloper) ? true : false;
         
            this.adminlegalExceptionSrv.getLegalExceptions().subscribe((result: Array<any>) => {
                this.isLoading = false;
                if (result.length > 0) {
                    for (let i = 0; i < result.length; i++) {
                        result[i]["IS_SELECTED"] = false;
                    }
                     
                }
                this.gridResult = result;
                this.viewExceptionDetails(result[0]);
                   this.gridData = process(result, this.state);
            }, (error) => {
                this.loggersvc.error('error in loading leagal exception service', error);
            });
         
    }
    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }
    childDataStateChange(state: DataStateChangeEvent): void {
        this.childState = state;
        this.childgridData = process(this.filterDataChildGrid, this.childState);
    }
    clearFilter() {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }
    refreshGrid() {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadlegalException();
    }

    parentdistinctPrimitive(fieldName: string) {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }

    Hideshow() {
        if (this.isHidden == true) {
            this.isHidden = false;
            this.childhidden = false;
            this.colexpand = 6;
            return false;
        }
        if (this.isHidden == false) {
            this.isHidden = true;
            this.childhidden = true;
            this.colexpand = 12;
            return true;
        }
    }

    closeViewException() {
       this.Hideshow();
    }

    distinctPrimitive(fieldName: string) {
        return distinct(this.filterDataChildGrid, fieldName).map(item => item[fieldName]);
    }
  
    public openCreateExceptionDialog(): void {
        const creacteExceptionobj = this.intializeformdata();
        const dialogRef = this.dialog.open(adminexceptionDetailsComponent, {
            width: "1800px",
            maxWidth:"100vw",
            data: {
                dialogTitle: "Add New Exception Record",
                exdetails: creacteExceptionobj,
                type:"save",
            },
            panelClass: 'custom-dialog-container',
        });

        dialogRef.afterClosed().subscribe((returnVal) => {

            if (returnVal != undefined && returnVal != "close") {
                 this.savedateformate(returnVal);
                this.adminlegalExceptionSrv.createLegalException(returnVal).subscribe((result: any) => { 
                    this.gridResult.push(result);
                    this.gridData = process(this.gridResult, this.state);
                    this.loggersvc.success('Legal Exception added.');
                }, (error) => {
                    this.loggersvc.error('Unable to add new Legal exceptions', error);
                });
            }
           
        }); 
    }


    public openEditExceptionDialog(item): void {
        if (item.DEALS_USED_IN_EXCPT == '')
        {  
            this.changedateformat(item);
            const dialogRef = this.dialog.open(adminexceptionDetailsComponent, {
                width: "1800px",
                maxWidth: "100vw",
                data: {
                    dialogTitle: "Edit Exception Record",
                    exdetails: item,
                    type: "update",
                },
                panelClass: 'custom-dialog-container',
            });

            dialogRef.afterClosed().subscribe((returnVal) => {


                if (returnVal != undefined && returnVal != "close") {
                    this.adminlegalExceptionSrv.updateLegalException(returnVal).subscribe((result: Array<any>) => {
                        this.loggersvc.success("Legal Exception was successfully updated.");
                    }, (error) => {
                        this.loggersvc.error('Unable to update Legal exception.', error);
                    });
                }
               
            }); 
             
        } else {
            this.loggersvc.warn("Exception that has been applied to a Deal cannot be Edited.", "");
        }
    }

    viewExceptionDetails(item) {
        this.changedateformat(item);
        this.initExdetails = item;
        if (this.isHidden == true) {
           this.Hideshow();
        } 
    }

    public openCreateAmendmentExceptionDialog(): void {

        const selectedlist = this.gridData.data.filter(element => {
            return element.IS_SELECTED == true;
        });
        let selectedchildlist = [];

        if (this.childgridData != undefined) {
             selectedchildlist = this.childgridData.data.filter(element => {
                return element.IS_SELECTED == true;
            });
        }
        if (selectedchildlist.length == 0) {
            if (selectedlist.length != 0) {
                if (selectedlist.length == 1) {
                    this.changedateformat(selectedlist[0]);
                    if (selectedlist[0].USED_IN_DL == 'Y') {

                        const dialogRef = this.dialog.open(adminamendmentExceptioncomponent, {
                            width: "1800px",
                            maxWidth: "100vw",
                            data: {
                                dialogTitle: "Add Amendment Exception Record",
                                examendmentdetails: selectedlist[0],
                                type: "save",
                            },
                            panelClass: 'custom-dialog-container',
                        });

                        dialogRef.afterClosed().subscribe((returnVal) => {
                            if (returnVal != undefined && returnVal != "close") {
                                const today = new Date();
                                returnVal.VER_NBR = returnVal.VER_NBR + 1;
                                returnVal.VER_CRE_DTM = moment(today).format("l");
                                this.adminlegalExceptionSrv.updateLegalException(returnVal).subscribe((result: Array<any>) => {
                                    this.loggersvc.success('Legal Exception added.');
                                }, (error) => {
                                    this.loggersvc.error('Unable to update Legal exception.', error);
                                });
                            }

                        });
                    } else {

                        this.loggersvc.warn("Exceptions without deals must be edited not amended", "");
                    }
                }
                else {
                    this.loggersvc.warn("Please select only one Exception to add an amendment", "");
                } 


            } else {
                this.loggersvc.warn("Please select an Exception to add an amendment", "");
            }

        } else {
            this.loggersvc.warn("Please select the current version of the exception to add an amendment", "");
        }
    }

    public openCompareExceptionDialog(): void {
 
        let selectedlist = this.gridData.data.filter(element => {
            return element.IS_SELECTED == true;
        });

        let selectedchildlist = [];
        let flag = "";
        if (this.childgridData != undefined) {
            selectedchildlist = this.childgridData.data.filter(element => {
                return element.IS_SELECTED == true;
            });
        }

            if (selectedchildlist.length == 1 && selectedlist.length == 1) {
                if (selectedlist[0].MYDL_PCT_LGL_EXCPT_SID == selectedchildlist[0].MYDL_PCT_LGL_EXCPT_SID) {
                    flag = "false";
                    selectedlist = selectedlist.concat(selectedchildlist);
                }
                else {
                    flag = "true";
                }
            }

            if (flag != "true") {

                if ((selectedlist.length == 2 && selectedchildlist.length == 0) || (selectedlist.length == 0 && selectedchildlist.length == 2) || flag == "false") {
                    let compareobj1 = {};
                    let comareobj2 = {};
                    if (selectedlist.length == 2) {
                        compareobj1 = selectedlist[0];
                        comareobj2 = selectedlist[1]
                    }
                    if (selectedchildlist.length == 2) {
                        compareobj1 = selectedchildlist[0];
                        comareobj2 = selectedchildlist[1]
                    }
                    this.changedateformat(compareobj1);
                    this.changedateformat(comareobj2);

                    const dialogRef = this.dialog.open(admincompareExceptionscomponent, {
                        width: "1800px",
                        maxWidth: "100vw",
                        data: {
                            dialogTitle: "Compare Exceptions",
                            exdetails1: compareobj1,
                            exdetails2: comareobj2,
                        },
                         panelClass: 'custom-dialog-container',
                    });

                    dialogRef.afterClosed().subscribe();
                } else {
                    this.loggersvc.warn("Please Select 2 Exception to Compare", "");
                }

            } else {
                this.loggersvc.warn("Previous version cannot be compared against other Exceptions", "");
            }
        
    }


    public openDealListExceptionDialog(item): void {
         
        if (item.DEALS_USED_IN_EXCPT != "") {
            const dialogRef = this.dialog.open(adminviewDealListcomponent, {
                width: "700px",
                data: {
                    dialogTitle: "Deal List",
                    dealList: item.DEALS_USED_IN_EXCPT,
                    pctException: item.PCT_EXCPT_NBR,
                    type: "dealList",
                },
                panelClass: 'custom-dialog-container',
            });
            dialogRef.afterClosed().subscribe((returnVal) => {

            }); 
        } else {
            this.loggersvc.warn("Exception has not been applied to a Deal.", "");
        }
    }

    public DeleteException(item,index): void {
        if (item.DEALS_USED_IN_EXCPT == "") {
            const dialogRef = this.dialog.open(adminviewDealListcomponent, {
                width: "600px",
                data: {
                    dialogTitle: "Delete confirmation",
                    type: "delete",
                },
                panelClass: 'custom-dialog-container',
            });
             
            dialogRef.afterClosed().subscribe((returnVal) => {
                if (returnVal == "delete") {
                    this.savedateformate(item);
                    this.adminlegalExceptionSrv.deleteLegalException(item).subscribe((result: Array<any>) => { 
                        this.gridResult.splice(index, 1);
                        this.gridData =   process(this.gridResult, this.state);
                        this.loggersvc.success("Legal Exception Deleted.");
                    }, (error) => {
                        this.loggersvc.error('Unable to delete Legal Exception.', error);
                    });
                    
                  }
            });  
            
        } else {
            this.loggersvc.warn("Exception that has been applied to a Deal cannot be Deleted.", "");
        }

         
    }

    checkeditems(item) {
        if (item.IS_SELECTED) {
            item.IS_SELECTED = false;
        }else
        item.IS_SELECTED = true;
    }

    allExceptionsSelected = false;
    selectAllExceptionsChange(e): void {
         if (e.target.checked) {
            this.allExceptionsSelected = true;
            for (let i = 0; i < this.gridData.data.length; i++) {
                this.gridData.data[i].IS_SELECTED = true;
            }
        } else {
            this.allExceptionsSelected = false;
            for (let i = 0; i < this.gridData.data.length; i++) {
                this.gridData.data[i].IS_SELECTED = false;
            }
        }
    }

    changedateformat(item: any) {
        if (item != undefined) {
            item.DT_APRV = item.DT_APRVDT_APRV !=undefined ? new Date(item.DT_APRVDT_APRV) : new Date();
            item.CHG_DTM = new Date(item.CHG_DTM);
            item.PCT_LGL_EXCPT_STRT_DT = new Date(item.PCT_LGL_EXCPT_STRT_DT);
            item.PCT_LGL_EXCPT_END_DT = new Date(item.PCT_LGL_EXCPT_END_DT);
            item.VER_CRE_DTM = new Date(item.VER_CRE_DTM);
        }
    }

    savedateformate(item: any) {
        if (item != undefined) {
            item.DT_APRV = moment(item.DT_APRV).format("l");
            item.CHG_DTM = moment(item.CHG_DTM).format("l");
            item.PCT_LGL_EXCPT_STRT_DT = moment(item.PCT_LGL_EXCPT_STRT_DT).format("l");
            item.PCT_LGL_EXCPT_END_DT = moment(item.PCT_LGL_EXCPT_END_DT).format("l");
            item.VER_CRE_DTM = moment(item.VER_CRE_DTM).format("l");
        }
    }

    detailExpand(e) {
        const dataItem = e.dataItem;
        this.childGrid(dataItem);
    }

    public expandDetailsBy = (dataItem: any): number => {
        if (this.expandedDetailKeys.includes(dataItem.MYDL_PCT_LGL_EXCPT_SID))
            return dataItem.MYDL_PCT_LGL_EXCPT_SID;
    };

    childGrid(dataitem) {
        this.adminlegalExceptionSrv.getVersionDetailsPCTExceptions(dataitem.MYDL_PCT_LGL_EXCPT_SID, 1).subscribe((result: any) => {
            this.expandedDetailKeys = [dataitem.MYDL_PCT_LGL_EXCPT_SID];
            if (result && result.length > 0) {
                this.filterDataChildGrid = result;
             } else {
                this.filterDataChildGrid = [];
            }
            this.childgridData = process(this.filterDataChildGrid, this.childState);

        }, (error) => {
            this.loggersvc.error('error in getting version details of PCT Excpetion service', error);
        });  
    }

    stripMilliseconds(chgDtm) {
        return this.datePipe.transform(new Date(GridUtil.stripMilliseconds(chgDtm)), 'M/d/yyyy');
    }

    selectItemChildGrid(event, dataItem) {
        if (event.target.checked) {
            for (let i = 0; i < this.filterDataChildGrid.length; i++) {
                if (this.filterDataChildGrid[i].VER_NBR == dataItem.VER_NBR) {
                    this.filterDataChildGrid[i].IS_SELECTED = true;
                    this.filterDataChildGrid[i].IS_ChildGrid = true;
                    this.filterDataChildGrid[i].PCT_LGL_EXCPT_STRT_DT = moment(dataItem.PCT_LGL_EXCPT_STRT_DT).format("l");
                    this.filterDataChildGrid[i].PCT_LGL_EXCPT_END_DT = moment(dataItem.PCT_LGL_EXCPT_END_DT).format("l");
                    this.filterDataChildGrid[i].DT_APRV = moment(dataItem.DT_APRV).format("l");
                    this.filterDataChildGrid[i].CHG_DTM = moment(dataItem.CHG_DTM).format("l");
                }
            }
        }
        else {
            for (let i = 0; i < this.filterDataChildGrid.length; i++) {
                if (this.filterDataChildGrid[i].VER_NBR == dataItem.VER_NBR) {
                    this.filterDataChildGrid[i].IS_SELECTED = false;
                    this.filterDataChildGrid[i].IS_ChildGrid = false;
                }
            }
        }
    }

    download() {
        const selectedlist = this.gridData.data.filter(element => {
            return element.IS_SELECTED == true;
        });
        if (selectedlist && selectedlist.length > 0) {
            const data = {
                "dataItem": selectedlist,
            }
            const dialogRef = this.dialog.open(adminDownloadExceptionscomponent, {
                width: "600px",
                panelClass: 'legal-download-custom',
                data: data,
            });
        }
        else {
            this.loggersvc.warn("Please select a current version exception to Download.","");
        }
    }

    intializeformdata() {
        return {
            ACTV_IND: true,
            IS_DSBL: '',
            VER_NBR: 1,
            VER_CRE_DTM: new Date(),
            CRE_DTM: new Date(), 
            PCT_EXCPT_NBR: '',
            INTEL_PRD: '',
            SCPE: '',
            PRC_RQST: '',
            COST: '',
            PCT_LGL_EXCPT_STRT_DT: new Date(),
            PCT_LGL_EXCPT_END_DT: new Date(),
            FRCST_VOL_BYQTR: '',
            CUST_PRD: '',
            MEET_COMP_PRD: '',
            MEET_COMP_PRC: '',
            BUSNS_OBJ: '',
            PTNTL_MKT_IMPCT: '',
            OTHER: '',
            JSTFN_PCT_EXCPT: '',
            EXCPT_RSTRIC_DURN: '',
            RQST_CLNT: '',
            RQST_ATRNY: '',
            APRV_ATRNY: '',
            DT_APRV: new Date(),
            CHG_EMP_NAME: (<any>window).usrName,
            CHG_DTM: new Date(),
        };
    }

    ngOnInit() {
        this.initExdetails = this. intializeformdata();
        this.loadlegalException();
    }  
}