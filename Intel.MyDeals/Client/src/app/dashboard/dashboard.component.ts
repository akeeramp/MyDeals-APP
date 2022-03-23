import * as angular from "angular";
import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, ViewEncapsulation} from '@angular/core';
import {DisplayGrid, GridsterConfig, GridsterItem, GridType,CompactType} from 'angular-gridster2';
import { downgradeComponent } from "@angular/upgrade/static";
import {MatDialog} from '@angular/material/dialog';
import { addWidgetComponent } from "./addWidget/addWidget.component";
import { widgetConfig } from "./widget.config";
import * as _ from "underscore";

@Component({
  selector: 'app-dashboard',
  templateUrl: 'Client/src/app/dashboard/dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  constructor(protected dialog: MatDialog){

  }
  options: GridsterConfig;
  dashboard: GridsterItem[];
  resizeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  addItem(): void {
    this.dashboard.push({x: 0, y: 0, cols: 1, rows: 1});
  }
  removeItem($event: MouseEvent | TouchEvent, item:any): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }
  openPopUp(){
    let vm=this;
      let widgets = this.dashboard;
    const dialogRef = this.dialog.open(addWidgetComponent, {
        width: '600px',
        data: { name: "Add a Widget",widgets:widgets},
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The widget was closed:: result::',result);
      if(result){
        let widget=_.findWhere(widgetConfig,{type:result});
        vm.dashboard.push({cols:widget.position.col,rows:widget.position.row,y:widget.size.y,x:widget.size.x,type:widget.type,canRefresh:widget.canRefresh,canSetting:widget.canChangeSettings,isAdded:widget.isAdded});
        vm.options.api.optionsChanged();
      }
    });
  }
  ngOnInit(): void {
    // this.options = {
    //   gridType: GridType.Fit,
    //   displayGrid: DisplayGrid.Always,
    //   disableWindowResize: false,
    //   scrollToNewItems: false,
    //   disableWarnings: false,
    //   ignoreMarginInRow: false,
    //   itemResizeCallback: (item) => {
    //     // update DB with new size
    //     // send the update to widgets
    //     this.resizeEvent.emit(item);
    //   }
    // };
    let dashboardItems=[];
    _.each(widgetConfig, item=>{
      dashboardItems.push({cols:item.position.col,rows:item.position.row,y:item.size.y,x:item.size.x,type:item.type,canRefresh:item.canRefresh,canSetting:item.canChangeSettings,isAdded:item.isAdded});
    });

    this.dashboard=dashboardItems;

    this.options = {
      gridType: GridType.Fit,
      compactType: CompactType.CompactLeftAndUp,
      displayGrid: DisplayGrid.Always,
      pushItems: false,
      swap: true,
      swapWhileDragging: false,
      draggable: {
        enabled: true
      },
      resizable: {
        enabled: true
      },
      itemResizeCallback: (item) => {
        // update DB with new size
        // send the update to widgets
        console.log('itemResizeCallback*************',item);
        this.resizeEvent.emit(item);
      }
    };
  }
}

angular.module("app").directive(
  "appDashboard",
  downgradeComponent({
      component: DashboardComponent,
  })
);
