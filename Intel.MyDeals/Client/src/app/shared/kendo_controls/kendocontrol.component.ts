import * as angular from "angular";
import {Observable} from "rxjs";
import {
  Component,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {downgradeComponent} from "@angular/upgrade/static";
import {SelectEvent} from "@progress/kendo-angular-layout";
import {MatDialog} from "@angular/material/dialog";
import {DialogOverviewExampleDialog} from "../../shared/modalPopUp/modal.component";
import {TooltipDirective} from "@progress/kendo-angular-tooltip";
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {saveAs} from "file-saver";
import { kendoControlService } from "./kendocontrol.service";

interface Item {
  text: string;
  value: number;
}

@Component({
    selector: "myKendoControl",
    templateUrl:
        "Client/src/app/shared/kendo_controls/kendocontrol.component.html",
    styleUrls: ["Client/src/app/shared/kendo_controls/kendocontrol.style.css"],
})
export class KendoControlComponent {
    constructor(
        protected dialog: MatDialog,
        protected kendoSVC: kendoControlService
    ) {
        $(
            'link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]'
        ).remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    private dateValue: Date;
    public listItems: Array<any> = [
        { text: "Small", value: 1 },
        { text: "Medium", value: 2 },
        { text: "Large", value: 3 },
        { text: "XLarge", value: 4 },
        { text: "XXLarge", value: 5 },
    ];
    public editValue = `<p>
    The Kendo UI Angular Editor allows your users to edit HTML in a familiar, user-friendly way.<br />
    In this version, the Editor provides the core HTML editing engine which includes basic text formatting, hyperlinks, and lists.
    The widget <strong>outputs identical HTML</strong> across all major browsers, follows
    accessibility standards, and provides API for content manipulation.
</p>
<div style="display: inline-block; width: 49%;">
    <p>Features include:</p>
    <ul>
        <li>Text formatting</li>
        <li>Bulleted and numbered lists</li>
        <li>Hyperlinks</li>
    </ul>
    </div>`;
    public selectedItems: Item[] = [this.listItems[1]];
    public selectedValue = 2;
    public opened = false;
    public autoList: Array<string> = [
        "Abhilash",
        "Arun",
        "Arjun",
        "Abhijith",
        "Abhishek",
    ];
    public autoData: Array<string>;
    public selAuto = "Abhilash";
    public selNumeric = 5;
    public isChecked = false;
    public isCollapsed = false;
    public obsObj = "Abhilash";
    public objObserv: Observable<string>;
    public gridData: any[] = [
        {
            ProductID: 1,
            ProductName: "Chai",
            UnitPrice: 18,
            Category: {
                CategoryID: 1,
                CategoryName: "Beverages",
            },
        },
        {
            ProductID: 2,
            ProductName: "Chang",
            UnitPrice: 19,
            Category: {
                CategoryID: 1,
                CategoryName: "Beverages",
            },
        },
        {
            ProductID: 3,
            ProductName: "Aniseed Syrup",
            UnitPrice: 10,
            Category: {
                CategoryID: 2,
                CategoryName: "Condiments",
            },
        },
    ];
    public windowWidth: any = 600;
    public windowHeight: any = 500;
    public windowOpened = false;
    public isTooltip = "none";
    public minSlide = 1;
    maxSlide = 4;
    stepSlide = 1;
    sliderValue = 2;
    @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
    @ViewChild("toolTip1") public toolElm1: ElementRef;
    @ViewChild("txtTool1", { static: false }) mytooltip1: NgbTooltip;
    @ViewChild("txtTool2", { static: false }) mytooltip2: NgbTooltip;
    //nested array
    public nestedArray: any = {
        id: "start",
        groups: [
            {
                id: "0",
                conditions: [{ name: "And", operator: "+,>" }],
                groups: [
                    { id: "0_0", conditions: [{ name: "And", operator: "+,>" }], groups: [] },
                ],
            },
            {
                id: "1",
                conditions: [{ name: "And", operator: "+,>" }],
                groups: [
                    {
                        id: "1_0",
                        conditions: [{ name: "And", operator: "+,>" }],
                        groups: [
                            {
                                id: "1_0_0",
                                conditions: [{ name: "And", operator: "+,>" }],
                                groups: [],
                            },
                        ],
                    },
                ],
            },
        ],
    };

    public filter: any = { "group": { "operator": "AND", "rules": [] } };
    public form: any = { 'isValid': false };
    public operators: Array<any> = [{ name: 'AND' }, { name: 'OR' }];
    public leftValues: Array<any> = [ 'Brand Name', 'External Name']
    public initial: any = {};

  public conditionArray = null;
  checkElement() {
    console.log("checkElement**************", this.conditionArray);
    }

    checkData() {
        console.log("Nested Grid Data: ", this.filter);
    }

  getElem(elem: any) {
    console.log("**************ID", elem);
    if (elem.id && elem.id == "start") {
      this.conditionArray = elem.item;
    } else {
      const i = 0;
      this.updateGroup(this.conditionArray.groups, elem, i);
    }
  }

  updateGroup(group: any, elem: any, i: any) {
    const count = elem.id.split("_");
    //identifying selectd group
    if (
      group[parseInt(count[i])].id &&
      group[parseInt(count[i])].id == elem.id
    ) {
      group[parseInt(count[i])] = elem.item;
    } else {
      this.updateGroup(group[parseInt(count[i])].groups, elem, i++);
    }
  }
  toggleTooltip1() {
    this.tooltipDir.toggle(this.toolElm1);
  }
  onTxt1ValueChange(e: any) {
    if (e.length > 0) {
      this.mytooltip1.close();
    } else {
      this.mytooltip1.open();
    }
  }
  onTxt2ValueChange(e: any) {
    if (e.length > 0) {
      this.mytooltip2.close();
    } else {
      this.mytooltip2.open();
    }
  }
  disableTooltip() {
    this.mytooltip1.close();
    this.mytooltip2.close();
  }
  enableTooltip() {
    this.mytooltip1.open();
    this.mytooltip2.open();
  }
  windowOpen() {
    this.windowOpened = true;
  }
  windowClose() {
    this.windowOpened = false;
  }
  dateClick() {
    console.log("selected Date ***********", this.dateValue);
  }
  comboClick() {
    console.log("selected combo ***********", this.selectedValue);
  }
  onTabSelect(e: SelectEvent) {
    console.log("onTabSelect  ***********", e);
  }
  open() {
    this.opened = true;
  }
  close() {
    this.opened = false;
  }
  autoClick() {
    console.log("autoClick ***********", this.selAuto);
    console.log("numClick ***********", this.selNumeric);
    console.log("checkClick ***********", this.isChecked);
  }
  openPopUp() {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: "250px",
      data: {name: "Name", animal: "Animal"},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed:: result::", result);
    });
  }
  observeClick() {
    const value = this.obsObj == "Abhilash" ? "Abhilash Keerampara" : "Abhilash";
    this.objObserv = new Observable(observer => {
      observer.next(value);
      console.log("observeClick******************");
    });
    this.objObserv.subscribe(val => {
      this.obsObj = val;
      console.log("subscribe observeClick ******************", val);
    });
  }
  handleFilter(value) {
    this.autoData = this.autoList.filter(
      s => s.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  downloadClick() {
    this.kendoSVC.downloadFile().subscribe(
      response => {
        const contentDisposition = response.headers.get("content-disposition");
        const filename = contentDisposition
          .split(";")[1]
          .split("filename")[1]
          .split("=")[1]
          .trim();
        saveAs(response.body, filename);
      },
      err => {
        console.error("downloadFile************************", err);
      }
    );
    // saveAs("https://file-examples-com.github.io/uploads/2017/10/file-sample_150kB.pdf", "sample.pdf");
  }
  ngOnInit() {
    this.autoData = this.autoList.slice();
    this.conditionArray = this.nestedArray;
  }
  ngOnDestroy() {
    //The style removed are adding back
    $("head").append(
      '<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">'
    );
    $("head").append(
      '<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">'
    );
  }
}

angular.module("app").directive(
  "myKendoControl",
  downgradeComponent({
    component: KendoControlComponent,
  })
);
