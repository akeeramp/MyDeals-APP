import * as angular from "angular";
import {Component,ViewChild, ViewContainerRef } from "@angular/core";
import {logger} from "../shared/logger/logger";
import {downgradeComponent} from "@angular/upgrade/static";
import {reportingService} from "./reporting.service";
import {List} from "linqts";

@Component({
  selector: "reportingDashboard",
    templateUrl: "Client/src/app/reporting/reporting.component.html",
    styleUrls: ['Client/src/app/reporting/reporting.component.css']
})
export class ReportingComponent {
    constructor(private reportingSvc: reportingService,private loggerSvc:logger) {
       //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
       $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
       $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();

  }
  //created for Angular loader
  public isLoading: string = 'true';
  public loadMessage: string = "Report is Loading ...";
  public moduleName:string ="Report Dashboard";

//*******************for chart purpose***************************//
 public chartPieeSeriesObj:any=null;
 public chartPieSeriesObj:any=null;
 public chartSeriesObj:any=null;

  private chartPieeObj:any ={
    title: {
        position: "bottom",
        text: "Report Usage by Count"
    },
    legend: {
        visible: false
    },
    chartArea: {
        background: "",
        margin:10,
        height:300
    },
    seriesDefaults: {
        type: "pie",
        startAngle: 150
    },
    tooltip: {
        visible: true,
        template: "#= category # : #= value #%"
    }
  }
  private chartPieObj: any = {
    title: {
      text: 'Report Usage by Total Time',
      position: "bottom"
    },
    legend: {
      visible: false
    },
    chartArea: {
      background: "",
        margin:10,
        height:300
    },
    seriesDefaults: {
      type: 'pie',
      startAngle: 150
    },
    tooltip: {
      visible: true,
      template: '#= category # : #= value #%'
    }
  };
  private chartObj:any={
    seriesLabels: {
        visible:true,
        padding: 3,
        font: 'bold 16px Arial, sans-serif'
    },
    title: {
        text: "Report Usage Time Log",
        position: "bottom"
    },
    legend: {
        position: "bottom",
        orientation:"vertical"
    },
    chartArea: {
      background: "",
      margin:10,
      height:300
    },
    seriesDefaults: {
        type: "line",
        style: "smooth"
    },
    valueAxis: {
        labels: {
            format: "{0}%",
            rotation: "auto"
        },
        line: {
            visible: false
        },
        axisCrossingValue: -10
    },
    categoryAxis: {
        categories: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
        majorGridLines: {
            visible: false
        },
        labels: {
            rotation: "auto",
            visible:true,
            padding: 3,
            font: 'bold 16px Arial, sans-serif'
        }
    },
    tooltip: {
        visible: true,
        format: "{0}%"
    }
  };
  @ViewChild("chartkendo", { read: ViewContainerRef, static: true })
  public chartContainer: ViewContainerRef;
  @ViewChild("piekendo", { read: ViewContainerRef, static: true })
  public pieContainer: ViewContainerRef;
  @ViewChild("pieekendo", { read: ViewContainerRef, static: true })
  public pieeContainer: ViewContainerRef;

  public orderOption :any={
    color: "rgba(255, 0, 0, 0.8)",
    dashType: 'dash',
    width: 2
  }
  //*******************for chart purpose***************************//
  private totalDealCount: number = 1;
  dealCountTooltip: any;
  productUsed: any;
  cutomerServiced: any;
  totalDollarAmount: any;
  searchDealTime: any;
  searchDetailsTime: any;
  queryStudioTime: any;
  dealSheetTime: any;
  dealApprovedTime: any;
  totalReportTime: any;
  chartDataBAR: any;
  reportCounterPie: any;
  reportCounterTotal: any;
  totalReportCount: any;
  sumMaxCounter: any;
  sumMinCounter: any;
  SUM_AMOUNT:any;
  private reportLogView: boolean = true;
  private numberOfRecrods: number = 10;
  private masterData: any;
  private ReportDealType :Array<any>=[]; ReportName:Array<any>=[];ReportSummary:Array<any>=[];ReportDashboardData:Array<any>=[];ReportLogDeatils:Array<any>=[];
  private loadMoreRecords: any;
  private btnText: string = "Show more ";
  private isRecordAvailable: boolean = false;
  private getReportCatagory: any;
  getReportSubCatagory: any;
  //Creating Color Code Dictionary
  private colorNameDict = {
    "Search Report Deal": "ng-fluscnt",
    "Approved After Start Date": "ng-teal",
    "Sheet Report": "ng-green",
    "Search Report Details": "ng-yellow",
    "Query Studio": "ng-red",
    others: "ng-blue",
  };
  private colorCodeDict = {
    "Search Report Deal": "#C4D600",
    "Approved After Start Date": "#288DAB",
    "Sheet Report": "#2BA703",
    "Search Report Details": "#F9CC04",
    "Query Studio": "#DD4B39",
    others: "#00C0EF",
  };

  getColor(RPT_NM, mode) {
    if (this.colorNameDict.hasOwnProperty(RPT_NM)) {
      // Remove item
      if (mode === "chart") {
        return this.colorCodeDict[RPT_NM];
      } else {
        return this.colorNameDict[RPT_NM];
      }
    } else {
      if (mode === "chart") {
        return this.colorCodeDict["others"];
      } else {
        return this.colorNameDict["others"];
      }
    }
  }
  getWidthDT(dealcount:any){
    return (dealcount *100/ this.totalDealCount).toFixed(2).toString() +"%";
  }
  getWidthDB(totalTime:any,reportTime:any){
    return (totalTime *100/ reportTime).toFixed(2).toString() +"%";
  }
  showAll(recordCnt) {
    if (recordCnt == 10 && this.masterData["ReportLogDeatils"].length > 10) {
      this.btnText = "Show less ";
      this.numberOfRecrods = this.masterData["ReportLogDeatils"].length;
    } else {
      this.btnText = "Show more ";
      this.numberOfRecrods = 10;
    }
  }
  loadReportDashboard() {
    let vm = this;
    this.reportingSvc.getReportData().subscribe(response => {
        //loader stops
        vm.isLoading = 'false';
        //variable assignment
        vm.masterData = response; 
        //vm.masterData =reportingResponse.response1; // changing to see all values
        vm.ReportDealType=vm.masterData["ReportDealType"];
        vm.ReportName=vm.masterData["ReportName"]
        vm.ReportSummary = vm.masterData["ReportSummary"]
        vm.ReportDashboardData=vm.masterData["ReportDashboardData"]
        vm.ReportLogDeatils= vm.masterData["ReportLogDeatils"]
        vm.SUM_AMOUNT=vm.ReportSummary[0].SUM_AMOUNT;

        if (vm.ReportLogDeatils.length > 0) {
          vm.isRecordAvailable = true;
        }
        vm.totalDealCount = 0;
        vm.dealCountTooltip = "";
        vm.productUsed = vm.ReportDealType[0]
          ? vm.ReportDealType[0].Product_Count
          : 0;
        vm.cutomerServiced = vm.ReportDealType[0]
          ? vm.ReportDealType[0].Distinct_Customer
          : 0;
        vm.totalDollarAmount = 0;
        vm.searchDealTime = 0;
        vm.searchDetailsTime = 0;
        vm.queryStudioTime = 0;
        vm.dealSheetTime = 0;
        vm.dealApprovedTime = 0;
        //Only RA will have access to Unified Customer Management Report
        if (
          (<any>window).usrRole != "RA" &&
          !((<any>window).isSuper || (<any>window).isDeveloper)
        ) {
          vm.ReportName = vm.ReportName.filter(
            x => x.RPT_UNIQ_NM != "Unified Customer Management Report"
          );
        }

        let reportName = new List<any>(vm.ReportName);
        //Report Name Group
        vm.getReportCatagory = reportName
          .Select(x => ({CTGR_NM: x.CTGR_NM}))
          .Distinct()
          .ToArray();

        //Report SUb Catagory
        vm.getReportSubCatagory = reportName
          .Select(x => ({CTGR_NM: x.CTGR_NM, SUB_CTGR_NM: x.SUB_CTGR_NM}))
          .Distinct()
          .ToArray();

        vm.totalReportTime = vm.ReportSummary[0]
          ? vm.ReportSummary[0].SUM_AMOUNTZ
          : 0;
        if (vm.ReportDealType.length > 0) {
          for (
            var cnt = 0;
            cnt < vm.ReportDealType.length;
            cnt++
          ) {
            if (vm.ReportDealType[cnt].DEAL_TYPE == "PROGRAM") {
              vm.totalDollarAmount =
                vm.ReportDealType[cnt].Total_Dollar_Amount;
            }
            vm.totalDealCount +=
              vm.ReportDealType[cnt].Deal_Count;
            vm.dealCountTooltip +=
              vm.ReportDealType[cnt].DEAL_TYPE +
              ": " +
              vm.ReportDealType[cnt].Deal_Count +
              " ";
            if (vm.ReportDealType[cnt].DEAL_TYPE === "ECAP") {
              vm.ReportDealType[cnt].COLOR = "yellow";
            } else if (
              vm.ReportDealType[cnt].DEAL_TYPE === "VOL_TIER"
            ) {
              vm.ReportDealType[cnt].COLOR = "green";
            } else if (
              vm.ReportDealType[cnt].DEAL_TYPE === "FLEX"
            ) {
              vm.ReportDealType[cnt].COLOR = "blue";
            } else if (
              vm.ReportDealType[cnt].DEAL_TYPE === "KIT"
            ) {
              vm.ReportDealType[cnt].COLOR = "red";
            } else {
              vm.ReportDealType[cnt].COLOR = "aqua";
            }
          }
        }

        if (vm.ReportDashboardData.length > 0) {
            for (
                var cnt = 0;
                cnt < vm.ReportDashboardData.length;
                cnt++
            ) {
                vm.ReportDashboardData[cnt].COLOR_CD = vm.getColor(
                    vm.ReportDashboardData[cnt].RPT_NM,
                    "widget"
                );
            }
        }
        vm.chartDataBAR = [];
        vm.reportCounterPie = [];
        
        //Getting Report Name
        if (vm.ReportLogDeatils.length > 0) {
            let reportLogDeatilsObj= new List<any>(vm.ReportLogDeatils);
            let getReportGroup = reportLogDeatilsObj
                    .Select(x => ({RPT_ALS_NM:x.RPT_ALS_NM}))
                    .Distinct()
                    .ToArray();

            for (var rpt_name_cnt = 0; rpt_name_cnt < getReportGroup.length; rpt_name_cnt++) {

                let dataPoint = reportLogDeatilsObj
                    .Where(x=> x.RPT_ALS_NM == getReportGroup[rpt_name_cnt].RPT_ALS_NM)
                    .Select(x=> ({TOTAL_REPORT_TIME_TAKEN:x.TOTAL_REPORT_TIME_TAKEN}))
                    .OrderByDescending(x=>x.TOTAL_REPORT_TIME_TAKEN)
                    .ToArray();

                let dataPtr = [];
                for (var cntt = 0; cntt < dataPoint.length && cntt < 10; cntt++) {
                    dataPtr.push(dataPoint[cntt]["TOTAL_REPORT_TIME_TAKEN"]);
                }
                //Determine color
                var COLOR_CD = vm.getColor(getReportGroup[rpt_name_cnt].RPT_ALS_NM, 'chart');
                var data = { name: getReportGroup[rpt_name_cnt].RPT_ALS_NM, data: dataPtr, color: COLOR_CD };
                vm.chartDataBAR.push(data);
            }


            for (var countBar = 0; countBar < vm.ReportDashboardData.length; countBar++) {
                var CLR_CD = vm.getColor(vm.ReportDashboardData[countBar].RPT_NM, 'chart');
                var dataColor = { category: vm.ReportDashboardData[countBar].RPT_NM, value: (vm.ReportDashboardData[countBar].TOTAL_TIME * 100 / vm.ReportDashboardData[countBar].TOTAL_REPORT_TIME).toFixed(2), color: CLR_CD };
                vm.reportCounterPie.push(dataColor);
            }
            vm.reportCounterTotal = [];
            vm.totalReportCount = 0;
            vm.sumMaxCounter = 0;
            vm.sumMinCounter = 0;
            for (var rptTolCounter = 0; rptTolCounter < vm.ReportDashboardData.length; rptTolCounter++) {
                vm.totalReportCount += vm.ReportDashboardData[rptTolCounter].RPT_COUNT;
            }
            for (var counterDonut = 0; counterDonut < vm.ReportDashboardData.length; counterDonut++) {
                var COLR_CD = vm.getColor(vm.ReportDashboardData[counterDonut].RPT_NM, 'chart');
                var dataTotalCount = { category: vm.ReportDashboardData[counterDonut].RPT_NM, value: (vm.ReportDashboardData[counterDonut].RPT_COUNT * 100 / vm.totalReportCount).toFixed(2), color: COLR_CD };
                vm.reportCounterTotal.push(dataTotalCount);
            }
        }

        //creating chartbar
        vm.chartPieeSeriesObj = vm.reportCounterTotal;
        vm.chartPieSeriesObj=vm.reportCounterPie;
        vm.chartSeriesObj=vm.chartDataBAR
      }, err=> {
        this.loggerSvc.error("Unable to get Report Data.", err);
      }
    );
  }

  ngOnInit() {
    this.loadReportDashboard();
  }
  ngOnDestroy() {
    //The style removed are adding back
    $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
    $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
}
}
angular.module("app").directive(
  "reportingDashboard",
  downgradeComponent({
    component: ReportingComponent,
  })
);
