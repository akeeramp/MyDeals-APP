import { Component, Inject,  ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { contractManagerservice } from "../contractManager.service";
import { logger } from "../../../shared/logger/logger";
import { DropDownFilterSettings } from "@progress/kendo-angular-dropdowns";

@Component({
    selector: "email-dialog",
    templateUrl: "Client/src/app/contract/contractManager/emailModal/emailModal.component.html",
    styleUrls: ['Client/src/app/contract/contractManager/emailModal/emailModal.component.css'],
    //Added the below line to remove extra padding which is present for the default mat dialog container
    //To override the default css for the mat dialog and remove the extra padding then encapsulation should be set to none 
    encapsulation: ViewEncapsulation.None
})

export class emailModal {
    allEmployeeProfiles: any;
    emailBody: any;
    emailSubject: any;
    headerInfo: any;
    constructor(public dialogRef: MatDialogRef<emailModal>, @Inject(MAT_DIALOG_DATA) public data, private contractManagerSvc: contractManagerservice, private loggerSvc: logger) {
    }
        public dataItem ;
        public roles = ["FSE", "GA", "DA", "ALL"];
        public roleFilter = "ALL";

        applyRoleClass(item) {
            return this.roleFilter === item;
        } 
        selectRole(item) {
            this.roleFilter = item;
            if (this.roleFilter === "ALL") {
                this.selectOptions =this.allEmployeeProfiles ;
            } else {
                this.selectOptions = this.allEmployeeProfiles.filter(x=>x.ROLE_NM == this.roleFilter);
            }
        }   
        getUserProfileData(role){
            this.contractManagerSvc.getEmployeeProfile().subscribe((result: any) => {
                this.allEmployeeProfiles = result;
                this.applyRoleClass(role);
                this.selectRole(role);
                this.selectedIds = this.dataItem.to;
            }, (error) => {
                this.loggerSvc.error('getProfile service', error);
            });
        }
        disableEmailButton() {
            return (this.dataItem.to.length === 0 || this.dataItem.subject === "" || this.dataItem.body === "");
        }
        public selectOptions: any;
        public selectedIds = [];
        public filterSettings: DropDownFilterSettings = {
            caseSensitive: false,
            operator: "contains",
          };
        ngOnInit() {
            if (this.data.cellCurrValues !== "" && this.data.cellCurrValues !== undefined) {
                this.dataItem = this.data.cellCurrValues;
            }
            if ((<any>window).usrRole === "FSE") {this.roleFilter = "GA";}
            if ((<any>window).usrRole === "GA"){this.roleFilter = "DA";} 
            this.emailBody =this.dataItem.body;
            this.emailSubject = this.dataItem.subject;
            this.getUserProfileData(this.roleFilter);
        }
        ok(){
            this.sendEmail();
            this.dialogRef.close('success');
        }
        sendEmail() {
            let to = [];
            for (var e = 0; e < this.dataItem.to.length; e++) to.push(this.dataItem.to[e].EMAIL_ADDR);
    
            let dataItemBody = {
                Subject: this.emailSubject,
                Body: this.emailBody,
                From: this.dataItem.from,
                To: to
            };
            this.contractManagerSvc.emailNotification(dataItemBody).subscribe((response: any) => {
                this.dialogRef.close();
            }, (error) => {
                //while subscribing its returning httpResponse.So, for now checking response with succuss code. (server side code changes needed in future)
                if (error.status == 200) this.dialogRef.close();
                else this.loggerSvc.error('Failed to send Email', '');
            });
        }
        close(){
            this.dialogRef.close();
        }
}
