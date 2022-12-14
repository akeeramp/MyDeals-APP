
import { Component, Inject, ViewChild, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "admin-amendment-exception",
    templateUrl: "Client/src/app/admin/legalException/admin.amendmentException.component.html",
    styleUrls: ['Client/src/app/admin/legalException/admin.legalException.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class adminamendmentExceptioncomponent {
    constructor(public dialogRef: MatDialogRef<adminamendmentExceptioncomponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }

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
    @ViewChild('excpt_rstricTooltip', { static: false }) excpt_rstricTooltip: NgbTooltip;
    @ViewChild('reqclientTooltip', { static: false }) reqclientTooltip: NgbTooltip;
    @ViewChild('reqTooltip', { static: false }) reqTooltip: NgbTooltip;
    @ViewChild('approvingTooltip', { static: false }) approvingTooltip: NgbTooltip;
    @ViewChild('dateApprovedTooltip', { static: false }) dateApprovedTooltip: NgbTooltip;
    @ViewChild('intel_input') intel_input: any
    @ViewChild('scpe_input') scpe_input: any
    @ViewChild('price_input') price_input: any
    @ViewChild('cost_input') cost_input: any;
    @ViewChild('startdate_input') startdate_input: any
    @ViewChild('enddate_input') enddate_input: any
    @ViewChild('forecasted_input') forecasted_input: any
    @ViewChild('cus_input') cus_input: any
    @ViewChild('comp_input') comp_input: any
    @ViewChild('compprice_input') compprice_input: any
    @ViewChild('bussobj_input') bussobj_input: any
    @ViewChild('potential_input') potential_input: any
    @ViewChild('others_input') others_input: any
    @ViewChild('justification_input') justification_input: any
    @ViewChild('excp_input') excp_input: any
    @ViewChild('reqclient_input') reqclient_input: any
    @ViewChild('reqattr_input') reqattr_input: any
    @ViewChild('appattr_input') appattr_input: any
    @ViewChild('dateappr_input') dateappr_input: any
    
    public examendmentdetails: any;
    public dialogTitle: any;     

    save() {
        this.toolTipvalidationMsgs(this.examendmentdetails);

    }
    toolTipvalidationMsgs(data) {//these conditions are added because for the new record, we should not show tool tip error messages if user doesnt touch/make any changes to the input field
        //if this condition is not added tooltip messages will immediately show for the required fields even if other fields are not yet touched when user starts typing any one of the input.
        this.closeTooltip();
        if (data.INTEL_PRD == "") {
            this.intel_input.focus();
            (data.INTEL_PRD == "") ? this.intelTooltip.open() : this.intelTooltip.close();
        } else if (data.SCPE == "") {
            this.scpe_input.focus();
            (data.SCPE == "") ? this.scopeTooltip.open() : this.scopeTooltip.close();
        } else if (data.PRC_RQST == "") {
            this.price_input.focus();
            (data.PRC_RQST == "") ? this.priceTooltip.open() : this.priceTooltip.close();
        } else if (data.COST == "") {
            this.cost_input.focus();
            (data.COST == "") ? this.costTooltip.open() : this.costTooltip.close();
        } else if (data.PCT_LGL_EXCPT_STRT_DT == "" || data.PCT_LGL_EXCPT_STRT_DT == null) {
            this.startdate_input.focus();
            (data.PCT_LGL_EXCPT_STRT_DT == "" || data.PCT_LGL_EXCPT_STRT_DT == null) ? this.startDTooltip.open() : this.startDTooltip.close();
        } else if (data.PCT_LGL_EXCPT_END_DT == "" || data.PCT_LGL_EXCPT_END_DT == null) {
            this.enddate_input.focus();
            (data.PCT_LGL_EXCPT_END_DT == "" || data.PCT_LGL_EXCPT_END_DT == null) ? this.endDTooltip.open() : this.endDTooltip.close();
        } else if (data.FRCST_VOL_BYQTR == "") {
            this.forecasted_input.focus();
            (data.FRCST_VOL_BYQTR == "") ? this.volTooltip.open() : this.volTooltip.close();
        } else if (data.CUST_PRD == "") {
            this.cus_input.focus();
            (data.CUST_PRD == "") ? this.cusTooltip.open() : this.cusTooltip.close();
        } else if (data.MEET_COMP_PRD == "") {
            this.comp_input.focus();
            (data.MEET_COMP_PRD == "") ? this.compTooltip.open() : this.compTooltip.close();
        } else if (data.MEET_COMP_PRC == "") {
            this.compprice_input.focus();
            (data.MEET_COMP_PRC == "") ? this.meetcompooltip.open() : this.meetcompooltip.close();
        } else if (data.BUSNS_OBJ == "") {
            this.bussobj_input.focus();
            (data.BUSNS_OBJ == "") ? this.busobjTooltip.open() : this.busobjTooltip.close();
        } else if (data.PTNTL_MKT_IMPCT == "") {
            this.potential_input.focus();
            (data.PTNTL_MKT_IMPCT == "") ? this.marketTooltip.open() : this.marketTooltip.close();
        } else if (data.OTHER == "") {
            this.others_input.focus();
            (data.OTHER == "") ? this.othersTooltip.open() : this.othersTooltip.close();
        } else if (data.JSTFN_PCT_EXCPT == "") {
            this.justification_input.focus();
            (data.JSTFN_PCT_EXCPT == "") ? this.pctTooltip.open() : this.pctTooltip.close();
        }else if (data.EXCPT_RSTRIC_DURN == "") {
            this.excp_input.focus();
            (data.EXCPT_RSTRIC_DURN == "") ? this.excpt_rstricTooltip.open() : this.excpt_rstricTooltip.close();
        } else if (data.RQST_CLNT == "") {
            this.reqclient_input.focus();
            (data.RQST_CLNT == "") ? this.reqclientTooltip.open() : this.reqclientTooltip.close();
        } else if (data.RQST_ATRNY == "") {
            this.reqattr_input.focus();
            (data.RQST_ATRNY == "") ? this.reqTooltip.open() : this.reqTooltip.close();
        } else if (data.APRV_ATRNY == "") {
            this.appattr_input.focus();
            (data.APRV_ATRNY == "") ? this.approvingTooltip.open() : this.approvingTooltip.close();
        } else if (data.DT_APRV == "" || data.DT_APRV == null) {
            this.dateappr_input.focus();
            (data.DT_APRV == "" || data.DT_APRV == null) ? this.dateApprovedTooltip.open() : this.dateApprovedTooltip.close();
        } else {
            this.dialogRef.close(this.examendmentdetails);
        }
    }
    closeTooltip() {
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
        this.excpt_rstricTooltip.close();
        this.reqclientTooltip.close();
        this.reqTooltip.close();
        this.approvingTooltip.close();
    }

    close() {
        this.dialogRef.close();
    }


    ngOnInit() {
        this.examendmentdetails = this.data.examendmentdetails;
        this.dialogTitle = this.data.dialogTitle;
    }
}
