import { logger } from "../../shared/logger/logger";
import { Component,  Inject,  Input,  ViewChild,  ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: "admin-exception-details",
    templateUrl: "Client/src/app/admin/legalException/admin.exceptionDetails.component.html",
    styleUrls: ['Client/src/app/admin/legalException/admin.legalException.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class adminexceptionDetailsComponent {

    @ViewChild('funFactTooltip', { static: false }) funFactTooltip: NgbTooltip;
    @ViewChild('headerTooltip', { static: false }) headerTooltip: NgbTooltip;
    @ViewChild('intelTooltip', { static: false }) intelTooltip: NgbTooltip;
    @ViewChild('scopeTooltip', { static: false }) scopeTooltip: NgbTooltip;
    @ViewChild('priceTooltip', { static: false }) priceTooltip: NgbTooltip;
    @ViewChild('costTooltip', { static: false }) costTooltip: NgbTooltip;
    @ViewChild('startDTooltip', { static: false }) startDTooltip: NgbTooltip;
    @ViewChild('endDTooltip', { static: false }) endDTooltip: NgbTooltip;
    @ViewChild('volTooltip', { static: false }) volTooltip: NgbTooltip;
    @ViewChild('cusTooltip', { static: false }) cusTooltip: NgbTooltip;
    @ViewChild('compTooltip', { static: false }) compTooltip: NgbTooltip;
    @ViewChild('meetcompooltip', { static: false }) meetcompooltip: NgbTooltip;
    @ViewChild('busobjTooltip', { static: false }) busobjTooltip: NgbTooltip;
    @ViewChild('marketTooltip', { static: false }) marketTooltip: NgbTooltip;
    @ViewChild('othersTooltip', { static: false }) othersTooltip: NgbTooltip;

    @ViewChild('pctTooltip', { static: false }) pctTooltip: NgbTooltip
    @ViewChild('reqclientTooltip', { static: false }) reqclientTooltip: NgbTooltip;
    @ViewChild('reqTooltip', { static: false }) reqTooltip: NgbTooltip;
    @ViewChild('restip', { static: false }) restip: NgbTooltip;
    @ViewChild('approvingTooltip', { static: false }) approvingTooltip: NgbTooltip;
    @ViewChild('dateApprovedTooltip', { static: false }) dateApprovedTooltip: NgbTooltip;
    
    constructor(private loggerSvc: logger, public dialogRef: MatDialogRef<adminexceptionDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
             $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
         
    } 

    public exdetails: any;
    public type: any;
    public dialogTitle: any;
    savebtn= false;
    updatebtn= false;
    viewbtn = false;
    
    initForm() {
        if (this.type == "save") {
            this.savebtn = true;
            this.viewbtn = true;
        }
        else if (this.type == "update") {
            this.updatebtn = true;
            this.viewbtn = true;
        }  
    }
     

    save() {
        this.toolTipvalidationMsgs(this.exdetails);
    }
    update() {
        this.toolTipvalidationMsgs(this.exdetails);
    }


    close() {
        this.dialogRef.close('close');
    }

    toolTipvalidationMsgs(data) {//these conditions are added because for the new record, we should not show tool tip error messages if user doesnt touch/make any changes to the input field
        //if this condition is not added tooltip messages will immediately show for the required fields even if other fields are not yet touched when user starts typing any one of the input.
        this.closeTooltip()
        if (data.PCT_EXCPT_NBR == "") {
            (data.PCT_EXCPT_NBR == "") ? this.funFactTooltip.open() : this.funFactTooltip.close();
        } else if (data.VER_NBR == "") {
            (data.VER_NBR == "") ? this.headerTooltip.open() : this.headerTooltip.close();
        } else if (data.INTEL_PRD == "") {
            (data.INTEL_PRD == "") ? this.intelTooltip.open() : this.intelTooltip.close();
        } else if (data.SCPE == "") {
            (data.SCPE == "") ? this.scopeTooltip.open() : this.scopeTooltip.close();
        } else if (data.PRC_RQST == "") {
            (data.PRC_RQST == "") ? this.priceTooltip.open() : this.priceTooltip.close();
        } else if (data.COST == "") {
            (data.COST == "") ? this.costTooltip.open() : this.costTooltip.close();
        } else if (data.PCT_LGL_EXCPT_STRT_DT == "" || data.PCT_LGL_EXCPT_STRT_DT == null) {
            (data.PCT_LGL_EXCPT_STRT_DT == "" || data.PCT_LGL_EXCPT_STRT_DT == null) ? this.startDTooltip.open() : this.startDTooltip.close();
        } else if (data.PCT_LGL_EXCPT_END_DT == "" || data.PCT_LGL_EXCPT_END_DT == null) {
            (data.PCT_LGL_EXCPT_END_DT == "" || data.PCT_LGL_EXCPT_END_DT == null) ? this.endDTooltip.open() : this.endDTooltip.close();
        } else if (data.FRCST_VOL_BYQTR == "") {
            (data.FRCST_VOL_BYQTR == "") ? this.volTooltip.open() : this.volTooltip.close();
        } else if (data.CUST_PRD == "") {
            (data.CUST_PRD == "") ? this.cusTooltip.open() : this.cusTooltip.close();
        } else if (data.MEET_COMP_PRD == "") {
            (data.MEET_COMP_PRD == "") ? this.compTooltip.open() : this.compTooltip.close();
        } else if (data.MEET_COMP_PRC == "") {
            (data.MEET_COMP_PRC == "") ? this.meetcompooltip.open() : this.meetcompooltip.close();
        } else if (data.BUSNS_OBJ == "") {
            (data.BUSNS_OBJ == "") ? this.busobjTooltip.open() : this.busobjTooltip.close();

        } else if (data.PTNTL_MKT_IMPCT == "") {
            (data.PTNTL_MKT_IMPCT == "") ? this.marketTooltip.open() : this.marketTooltip.close();
        } else if (data.OTHER == "") {
            (data.OTHER == "") ? this.othersTooltip.open() : this.othersTooltip.close();
        } else if (data.JSTFN_PCT_EXCPT == "") {
            (data.JSTFN_PCT_EXCPT == "") ? this.pctTooltip.open() : this.pctTooltip.close();
        } else if (data.EXCPT_RSTRIC_DURN == "") {
            (data.EXCPT_RSTRIC_DURN == "") ? this.restip.open() : this.restip.close();
        }else if (data.RQST_CLNT == "") {
            (data.RQST_CLNT == "") ? this.reqclientTooltip.open() : this.reqclientTooltip.close();
        } else if (data.RQST_ATRNY == "") {
            (data.RQST_ATRNY == "") ? this.reqTooltip.open() : this.reqTooltip.close();
        } else if (data.APRV_ATRNY == "") {
            (data.APRV_ATRNY == "") ? this.approvingTooltip.open() : this.approvingTooltip.close();
        } else if (data.DT_APRV == "" || data.DT_APRV == null) {
            (data.DT_APRV == "" || data.DT_APRV == null) ? this.dateApprovedTooltip.open() : this.dateApprovedTooltip.close();
        }
        else {
            this.dialogRef.close(this.exdetails);
        }
    }
        

    closeTooltip() {
        this.funFactTooltip.close();
        this.headerTooltip.close();
        this.intelTooltip.close();
        this.scopeTooltip.close();
        this.priceTooltip.close();
        this.costTooltip.close();
        this.startDTooltip.close();
        this.volTooltip.close();
        this.endDTooltip.close();
        this.cusTooltip.close();
        this.compTooltip.close();
        this.meetcompooltip.close();
        this.busobjTooltip.close();
        this.marketTooltip.close();
        this.othersTooltip.close();
        this.pctTooltip.close();
        this.reqclientTooltip.close();
        this.reqTooltip.close();
        this.approvingTooltip.close();
        this.restip.close();
    }
    ngOnInit() {
        this.exdetails = this.data.exdetails;
        this.type = this.data.type;
        this.dialogTitle = this.data.dialogTitle;
        this.initForm(); 
    }
}
