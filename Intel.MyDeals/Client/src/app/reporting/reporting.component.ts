import {Component,OnDestroy,ViewChild, ViewContainerRef } from "@angular/core";
import {logger} from "../shared/logger/logger";
import {reportingService} from "./reporting.service";
import {List} from "linqts";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SeriesLabelsContentArgs } from "@progress/kendo-angular-charts";
import { ExcelColumnsConfig } from '../admin/ExcelColumnsconfig.util';
import { GridUtil } from "../contract/grid.util";
@Component({
  selector: "reporting-dashboard",
    templateUrl: "Client/src/app/reporting/reporting.component.html",
    styleUrls: ['Client/src/app/reporting/reporting.component.css']
})
export class ReportingComponent implements OnDestroy{
    constructor(private reportingSvc: reportingService,private loggerSvc:logger) { }
    //created for Angular loader
    public isLoading: string = 'true';
    public loadMessage: string = "Report is Loading ...";
    public moduleName: string = "Report Dashboard";
    private GetReportMissingCostDataColumn = ExcelColumnsConfig.GetReportMissingCostDataExcel;
    private GetReportNewProductMissingCostDataColumn = ExcelColumnsConfig.GetReportNewProductMissingCostDataExcel;
    private GetGetUCMReportDataColumn = ExcelColumnsConfig.GetUCMReportDataDataExcel;
    private reportCustomerExcel = ExcelColumnsConfig.reportCustomerExcel;
    private reportProductExcel = ExcelColumnsConfig.reportProductExcel;
    private colorStages = {
        Complete: "#C4D600",
        InComplete: "#FC4C02",
        Draft: "#d8dddf",
        Pending: "#FFA300",
        Requested: "#f9eaa7",
        Submitted: "#ffd180",
        Approved: "#c4d600",
        InProgress: "#d8dddf",
        Processed: "#C4D600",
        Active: "#c4d600",
        Offer: "#FFA300",
        Lost: "#FC4C02",
        Won: "#acbc00",
        Hold: "#aaaaaa",
        Cancelled: "#aaaaaa"
    }
//*******************for chart purpose***************************//
 public chartPieeSeriesObj:any=null;
 public chartPieSeriesObj:any=null;
 public chartSeriesObj:any=null;
 private readonly destroy$ = new Subject<void>();
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
        template: "#= category # : #= value #%",
        format: "{0}%"
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
        template: '#= category # : #= value #%',
        format: "{0}%"
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
        position: "top"
    },
    legend: {
        position: "bottom",
        orientation:"horizontal"
    },
    chartArea: {
      background: "",
      margin:1,
      height:350
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
  private totalAllDealCount: number = 1;
  visibleChart = false;
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
  private ReportDealType: Array<any> = []; ReportDealStage: Array<any> = []; ReportName: Array<any> = []; ReportSummary: Array<any> = []; ReportDashboardData: Array<any> = []; ReportLogDeatils: Array<any> = []; ReportDealTypeStage: Array<any> = [];
  private ReportCustomerReport: Array<any> = [];
  private ReportEcapQuarter: Array<any> = []; ReportFlexQuarter: Array<any> = []; ReportKitQuarter: Array<any> = []; ReportProgramQuarter: Array<any> = []; ReportRevtierQuarter: Array<any> = []; ReportVoltierQuarter: Array<any> = []; ReportLumpSumQuarter: Array<any> = [];
  private ReportDealTypeQuarter: Array<any> = [];ReportQuarters: Array<any> = []; ReportProducts: Array<any> = []; ReportAllDealCount: Array<any> = [];
  private customerGrandTotal: number = 1;
  private btnText: string = "Show more ";
  private isRecordAvailable: boolean = false;
  private getReportCatagory: any;
  getReportSubCatagory: any;
  visibleIndex = -1;
    private dataDealTypeStages: Array<any> = [];
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

    labelContent(e: SeriesLabelsContentArgs): string {
        return e.category;
    }

    colorAddedStage(dealStages) {
        for (let i = 0; i < dealStages.length; i++) {
            for (const key in this.colorStages) {
                if (dealStages[i].DEAL_STAGE == key) {
                    /*let color = { color: this.colorStages [key]}*/
                    dealStages[i]["color"] = this.colorStages[key]
                }
            }
        }
        return dealStages
    }

    downloadICostReport() {
        this.loggerSvc.warn("Please wait downloading inprogress","");
        this.reportingSvc.GetReportMissingCostData().pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                if (response && response.length > 0) {
                    GridUtil.dsToExcelReport(this.GetReportMissingCostDataColumn, response, "missingCostData");
                    this.loggerSvc.success("Successfully downloaded the report data");
                } else {
                    this.loggerSvc.error("Unable to Download Report Data","");
                }
            }, (error) => {
                this.loggerSvc.error("Unable to Download Report Data", error);
            })
    }

    downloadGetReportNewProductMissingCostData() {
        this.reportingSvc.GetReportNewProductMissingCostData().pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                if (response) {
                    GridUtil.dsToExcelReportNewProductMissingCostData(this.GetReportNewProductMissingCostDataColumn, response, "New Product Missing Cost Report");
                    this.loggerSvc.success("Successfully downloaded the report data");
                } else {
                    this.loggerSvc.error("Unable to Download Report Data", "");
                }
            }, (error) => {
                this.loggerSvc.error("Unable to Download Report Data", error);
            })
    }

    downloadUCMReportData() {
        this.loggerSvc.warn("Please wait downloading inprogress", "");
        this.reportingSvc.GetUCMReportData().pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                if (response) {
                    GridUtil.dsToExcelGetUCMReportData(this.GetGetUCMReportDataColumn, response, "UCMReport");
                    this.loggerSvc.success("Successfully downloaded the report data");
                } else {
                    this.loggerSvc.error("Unable to Download Report Data", "");
                }
            }, (error) => {
                this.loggerSvc.error("Unable to Download Report Data", error);
            })
    }

 
    reportDealTypesBarChart() {
        let Val = this.ReportDealTypeQuarter.filter(val => {
            if (val.DEAL_TYPE == "ECAP") {
                this.ReportEcapQuarter.push(val.DEAL_COUNT)
            }
            if (val.DEAL_TYPE == "FLEX") {
                this.ReportFlexQuarter.push(val.DEAL_COUNT)
            }
            if (val.DEAL_TYPE == "KIT") {
                this.ReportKitQuarter.push(val.DEAL_COUNT)
            }
            if (val.DEAL_TYPE == "PROGRAM") {
                this.ReportProgramQuarter.push(val.DEAL_COUNT)
            }
            if (val.DEAL_TYPE == "REV_TIER") {
                this.ReportRevtierQuarter.push(val.DEAL_COUNT)
            }
            if (val.DEAL_TYPE == "LUMP_SUM") {
                this.ReportLumpSumQuarter.push(val.DEAL_COUNT)
            }
            if (val.DEAL_TYPE == "VOL_TIER") {
                this.ReportVoltierQuarter.push(val.DEAL_COUNT)
                this.ReportQuarters.push(val.QUARTER)
            }
        })

    }

  loadReportDashboard() {
    let vm = this;
    this.reportingSvc.getReportData()
        .pipe(takeUntil(this.destroy$)).subscribe(response => {
        //loader stops
        vm.isLoading = 'false';
        //variable assignment
        vm.masterData = response; // changing to see all values
        vm.ReportDealType=vm.masterData["ReportDealType"];
        vm.ReportName = vm.masterData["ReportName"]
        vm.ReportDealStage = vm.masterData["ReportDealStage"]
        vm.ReportDealTypeStage = this.colorAddedStage(vm.masterData["ReportDealTypeStage"])
        vm.ReportSummary = vm.masterData["ReportSummary"]
        vm.ReportDashboardData=vm.masterData["ReportDashboardData"]
        vm.ReportLogDeatils = vm.masterData["ReportLogDeatils"]

        vm.ReportCustomerReport = vm.masterData["ReportCustomerReport"]
        vm.ReportDealTypeQuarter = vm.masterData["ReportDealTypeQuarter"];
        vm.ReportProducts = vm.masterData["ReportProducts"]
        vm.ReportAllDealCount = vm.masterData["ReportAllDealCount"]
        vm.SUM_AMOUNT = vm.ReportSummary[0].SUM_AMOUNT;
        this.reportDealTypesBarChart()
        if (vm.ReportLogDeatils.length > 0) {
          vm.isRecordAvailable = true;
        }
        vm.totalDealCount = 0;
        vm.totalAllDealCount = 0;
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
        //Customer grand total
        this.customerGrandTotal = 0;
        if (vm.ReportCustomerReport.length > 0) {
            for (let i = 0; i < vm.ReportCustomerReport.length; i++) {
                this.customerGrandTotal += vm.ReportCustomerReport[i].DEAL_COUNT;
            }
        }
        
        //Only RA, SA will have access to Unified Customer Management Report
        if ((<any>window).usrRole != "SA" &&
          (<any>window).usrRole != "RA" &&
          !((<any>window).isSuper || (<any>window).isDeveloper)
        ) {
          vm.ReportName = vm.ReportName.filter(
            x => x.RPT_UNIQ_NM != "Unified Customer Management Report"
          );
            }

        //Only RA, SA will have access to Unified Customer Management Report
        if ((<any>window).usrRole != "SA" &&
                !((<any>window).isSuper || (<any>window).isDeveloper)
            ) {
                vm.ReportName = vm.ReportName.filter(
                    x => x.RPT_UNIQ_NM != "iCost report"
                );
            }

            //Only RA, SA will have access to Unified Customer Management Report
            if ((<any>window).usrRole != "SA" &&
                !((<any>window).isSuper || (<any>window).isDeveloper)
            ) {
                vm.ReportName = vm.ReportName.filter(
                    x => x.RPT_UNIQ_NM != "New Product Missing Cost Report"
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
              if (vm.ReportDealType[cnt].DEAL_TYPE == "PROGRAM" || vm.ReportDealType[cnt].DEAL_TYPE == "LUMP_SUM") {
              vm.totalDollarAmount =
                vm.ReportDealType[cnt].Total_Dollar_Amount;
            }
            vm.totalDealCount += vm.ReportDealType[cnt].Deal_Count;
            vm.totalAllDealCount += vm.ReportAllDealCount[cnt].Deal_Count;
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
    hoverIndex(ind, dealType) {
        this.visibleIndex = ind;
        this.dataDealTypeStages = [];
        for (let j = 0; j < this.ReportDealTypeStage.length; j++) {
            if (this.ReportDealTypeStage[j].DEAL_TYPE == dealType) {
                this.dataDealTypeStages.push(this.ReportDealTypeStage[j])
            }
        }       
    }

    closeHover() {
        this.visibleIndex = -1
    }

    inChart() {
        this.visibleChart = true;
    }

    outChart() {
        this.visibleChart = false;
    }

    downloadReportCustomer(custName: any){
      let data = {value: custName} 
      this.reportingSvc.downloadDealCountData(data)
        .pipe(takeUntil(this.destroy$)).subscribe(response => { 
          this.isLoading = 'false';
          let titleExcel = custName+"-Report"
          GridUtil.dsToExcelReportCustomer(this.reportCustomerExcel, response, titleExcel);
          this.loggerSvc.success("Successfully downloaded the Customer report data");
      })
    }

    downloadReportProduct(product: any){
      let data = {value: product} 
      this.reportingSvc.downloadProductDealCountData(data)
        .pipe(takeUntil(this.destroy$)).subscribe(response => { 
          this.isLoading = 'false';
          let titleExcel = "Product-Report"
          GridUtil.dsToExcelReportProduct(this.reportProductExcel, response, titleExcel);
          this.loggerSvc.success("Successfully downloaded the Product report data");
      })
    }

    ngOnInit() {
        this.loadReportDashboard();
    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
    }

}