import { Component, Input,OnInit } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import * as angular from "angular";
import { colorDictionary } from "../../angular.constants"

@Component({
    selector: "icon-mct-pct-angular",
    templateUrl: "Client/src/app/core/gridCell/iconMctPct/iconMctPct.component.html"
})

export class iconMctPctComponent implements OnInit {

    @Input() public dataValue: string;
    @Input() public iconClass: string;
    @Input() public overrideValue: any;
    @Input() public canView: boolean;
    @Input() public canEdit: boolean;
    @Input() public iconStyle: string;
    @Input() public notRunMsg: string;

    ngOnInit(): void {
        if (this.canEdit === undefined) this.canEdit = false;
        if (!this.canView) this.canView = true;
        if (!this.notRunMsg) this.notRunMsg = "Not Run Yet";
    }
   
    upperCase(str: string): string {
        return str.toUpperCase();
    }

    titleCase(str: string): string {
        const firstLetterRx = /(^|\s)[a-z]/g;
        return str.toLowerCase().replace(firstLetterRx, this.upperCase);
    }

    showTitle(): string {
        const postMsg = this.canEdit ? "\nCtrl-Click to open in a new tab" : "";
        return this.dataValue === "Not Run Yet" ? this.notRunMsg : this.dataValue + postMsg;
    }

    getIconClass(): string {
        if (this.dataValue === undefined) { return "intelicon-help-solid" }
        const c = this.titleCase(this.dataValue);
        if (c.toUpperCase() === "PASS") return "intelicon-passed-completed-solid";
        if (c.toUpperCase() === "FAIL") return "intelicon-alert-solid";
        if (c.toUpperCase() === "NA") return "intelicon-information-solid";
        if (c.toUpperCase() === "INCOMPLETE") return "intelicon-help-solid";
        return "intelicon-help-solid";
    }

    getColor(k: string, c: string, colorDictionary): string {
        if (c === undefined) { return "#aaaaaa" }
        c = this.titleCase(c);
        if (c === "Incomplete") c = "InComplete"; // It should all be upper case now, but, just in case...
        if (c === "Na") c = "NA"; // It should all be upper case now, but, just in case...
        if (colorDictionary[k] !== undefined && colorDictionary[k][c] !== undefined) {
            return colorDictionary[k][c];
        }
        return "#aaaaaa";
    }

    getColorStyle() {
        return { color: this.getColorPct(this.dataValue) };
    }

    getColorPct(d: string): string{
        if (!d) { d = "InComplete"; }
        return this.getColor('pct', d, colorDictionary);
    }

    getColorMct(d: string): string{
        if (!d) { d = "InComplete"; }
        return this.getColor('mct', d, colorDictionary);
    }
}
angular
    .module('app')
    .directive("iconMctPctAngular", downgradeComponent({
        component: iconMctPctComponent,
        inputs: ['dataValue', 'iconClass', 'overrideValue', 'canView', 'canEdit', 'iconStyle','notRunMsg']
    }));



