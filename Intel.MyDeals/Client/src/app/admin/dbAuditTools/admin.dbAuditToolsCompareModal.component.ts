import { logger } from "../../shared/logger/logger";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject, ViewEncapsulation, OnDestroy } from "@angular/core"
import { GridDataResult, DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { ExcelColumnsConfig } from '../ExcelColumnsconfig.util';
import { dbAuditToolsService } from "./admin.dbAuditTools.service";
import { forEach } from 'underscore';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

//export class IButton {
//    ENV_NM: string;
//    ENV_TAG: string;
//    DB_TYPE: string;
//    DB_OBJ: string;
//    DB_DATA: string;
//    selected: boolean = false;
//}
export class IButton  {
    text: string;
    data: string;
    selected: boolean;
}

@Component({
    selector: "dbAuditToolsCompareModal",
    templateUrl: "Client/src/app/admin/dbAuditTools/admin.dbAuditToolsCompareModal.component.html",
    styleUrls: ['Client/src/app/admin/dbAuditTools/admin.dbAuditTools.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class DbAuditToolsCompareModalComponent implements OnDestroy {
    private jsonData = this.data.selectedDataInfoJson;
    private procName = this.data.selectedProcName;
    private myTextareaLeft = "";
    private myTextareaRight = "";
    private myLeftLabel = "";
    private myRightLabel = "";
    private myTextareaSingle = "";
    private isSideBySide = true;
    private numEnvs = 0;
    private buttonEnvs: IButton[] = [];
    private editorOptions = { theme: 'vs-dark', language: 'sql' };
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();

    constructor(
        private dbAuditToolsSVC: dbAuditToolsService,
        @Inject(MAT_DIALOG_DATA) public data,
        private loggerSvc: logger,
        public dialogRef: MatDialogRef<DbAuditToolsCompareModalComponent>) {
        dialogRef.disableClose = true;// prevents pop up from closing when user clicks outside of the MATDIALOG
    }

    close(): void {
        this.dialogRef.close();
    }

    public changeInline(e: boolean): void {
        this.isSideBySide = !e;
    }

    singleTextViewOnly(): void {
        const singleAuditObjTextRequest = this.jsonData[0];
        this.dbAuditToolsSVC.GetObjText(singleAuditObjTextRequest).pipe(takeUntil(this.destroy$))
            .subscribe((result: string) => {
            const ReturnData = JSON.parse(result.toString()).DATA.sort((a, b) => (a.LineNbr - b.LineNbr));
            let tempTextareaData = "";
            for (let LineNbr in ReturnData) {
                tempTextareaData = tempTextareaData.concat(ReturnData[LineNbr].LineText);
            }

            this.myTextareaSingle = tempTextareaData;
        }, (error) => {
            this.loggerSvc.error('Error in retreiving DB Object Text for ' + this.procName + ' single comparison mode', error);
        });
    }

    public selectedChange(e: boolean, btn: IButton): void {
        //btn.selected = !btn.selected;
        btn.selected = e;
        if (this.myTextareaLeft != "" || this.myTextareaRight != "") {
            this.myTextareaLeft = "";
            this.myTextareaRight = "";
            this.myLeftLabel = "";
            this.myRightLabel = "";
        }
    }

    fetchData = function () {
        const selectedItems = this.buttonEnvs.filter(a => a.selected == true);

        if (selectedItems.length != 2) {
            alert("You need to select 2 environments.");
        }
        else {
            const leftAuditObjTextRequest = selectedItems[0].data;
            this.myLeftLabel = selectedItems[0].text;
            this.dbAuditToolsSVC.GetObjText(leftAuditObjTextRequest).pipe(takeUntil(this.destroy$))
                .subscribe((result: string) => {
                const ReturnData = JSON.parse(result.toString()).DATA.sort((a, b) => (a.LineNbr - b.LineNbr));
                let tempTextareaData = "";
                for (let LineNbr in ReturnData) {
                    tempTextareaData = tempTextareaData.concat(ReturnData[LineNbr].LineText);
                }

                this.myTextareaLeft = tempTextareaData;
            }, (error) => {
                this.loggerSvc.error('Error in retreiving DB Object Text for ' + this.procName + ' left comparison mode', error);
            });

            const rightAuditObjTextRequest = selectedItems[1].data;
            this.myRightLabel = selectedItems[1].text;
            this.dbAuditToolsSVC.GetObjText(rightAuditObjTextRequest).pipe(takeUntil(this.destroy$))
                .subscribe((result: Array<any>) => {
                const ReturnData = JSON.parse(result.toString()).DATA.sort((a, b) => (a.LineNbr - b.LineNbr));
                let tempTextareaData = "";
                for (let LineNbr in ReturnData) {
                    tempTextareaData = tempTextareaData.concat(ReturnData[LineNbr].LineText);
                }

                this.myTextareaRight = tempTextareaData;
            }, (error) => {
                this.loggerSvc.error('Error in retreiving DB Object Text for ' + this.procName + ' right comparison mode', error);
            });
        }
    }

    ngOnInit(): void {
        this.numEnvs = this.jsonData.length;
        if (this.numEnvs == 1) {
            this.singleTextViewOnly();
        }

        //this.jsonData.forEach(obj => {
        //    this.buttonEnvs.push(obj)
        //});

        //this.jsonData.forEach(obj => {
        //    let x = '{ text: ' + obj.ENV_NM + ', data: ' + obj + ', selected: false }';
        //    this.buttonEnvs.push(x);
        //});
        this.buttonEnvs = this.jsonData.map(o => {
            return { text: o.ENV_NM, data: o, selected: false };
        });

        if (this.numEnvs == 2) { //alert("Running auto-comparisons"); }
            if (this.numEnvs > 2) {
                //alert("Must pick");
            }

            //this.dbAuditToolsSVC.GetObjText(this.jsonData).subscribe((result: Array<any>) => {
            //    let ReturnData = JSON.parse(result.toString()).DATA.sort((a, b) => (a.LineNbr - b.LineNbr));
            //    //let SortedReturnData = ReturnData.DATA.sort((a, b) => (a.LineNbr - b.LineNbr));
            //    let tempTextareaData = "";
            //    for (let LineNbr in ReturnData) {
            //        tempTextareaData = tempTextareaData.concat(ReturnData[LineNbr].LineText);
            //    }

            //    this.myTextarea = tempTextareaData;

            //}, (error) => {
            //    this.loggerSvc.error('Error in retreiving DB Object Text for ' + this.procName + ' - ' + this.envName, error);
            //});
        }
    }
    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}