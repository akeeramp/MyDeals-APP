import * as angular from "angular";
import { logger } from "../../../shared/logger/logger";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, ViewEncapsulation, Inject } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";

@Component({
    selector: "system-price-point",
    templateUrl: "Client/src/app/contract/ptModals/dealEditorModals/systemPricePointModal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class systemPricePointModalComponent {
    constructor(private loggerSvc: logger, public dialogRef: MatDialogRef<systemPricePointModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
        dialogRef.disableClose = true;// prevents pop up from closing when user clicks outside of the MATDIALOG
    }
    private operators = [{ id: 1, name: '<=' }];
    private operator: any;
    private price: any;
    private label: any;
    cancel() {
        this.dialogRef.close();
    }
    onKeyDown(event) {
        if (event.keyCode == 13) {
            if (parseFloat(this.price) <= 0.00) {
                this.price = 0.01;
            }
        }
    }
    ok() {
        var returnVal = "";
        if ((this.price != null && this.price !== "") && (this.operator.name !== undefined && this.operator !== "")) {
            if (this.price == 0) {
                this.price = "0.01";
            }
            returnVal = this.operator.name + "$" + this.price;
        }
        this.dialogRef.close(returnVal);
    }
    ngOnInit() {
        this.operator = { id: 1, name: '<=' };
        if (this.data.cellCurrValues !== "" && this.data.cellCurrValues !== undefined) {
            var splitValue = this.data.cellCurrValues.split("$");
            this.operator = this.operators.find(element => element.name == splitValue[0]);
            this.price = parseFloat(splitValue[1]);
        }
        this.label = this.data.label;
    }
}

angular
    .module("app")
    .directive(
        "systemPricePoint",
        downgradeComponent({ component: systemPricePointModalComponent })
    );