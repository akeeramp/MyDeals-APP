import { Component, Input } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { contractManagerservice } from "../contractManager/contractManager.service";
import { GridUtil } from "../grid.util";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: "performance-bars",
    templateUrl: "Client/src/app/contract/performanceBars/performanceBar.component.html",
    styleUrls: ['Client/src/app/contract/performanceBars/performanceBar.component.css']
})

export class performanceBarsComponent {
    @Input() type: string;
    public dealArray: any[];
    constructor(private loggerSvc: logger, private contractManagerSvc:contractManagerservice) {}
    public perfDataValue: {
        executionMs: any,
        data: any[]
    };
    
    public executionMsValue: any = 0;
    public chartData =[];
    public totalExecutionTime: number =0;
    public showPerfDetails: boolean= false;
    public blockVlaue: any = null;
    public totTimesValue: any = null;
    public totTimesArray = [];
    public marks = [];
    public tempMarkArray = [];
    public tempMarks: any = {};
    private readonly destroy$ = new Subject();

    private barChartObj:any={
        legend: {
            visible: false
        },
        chartArea: {
            width: 400,
            height: 40
        },
        seriesDefaults: {
            type: "bar",
            stack: {
                type: "100%"
            }
        },
        valueAxis: {
            line: { visible: false },
            labels: { visible: false },
            minorGridLines: { visible: false },
            majorGridLines: { visible: false }
        },
        categoryAxis: {
            line: { visible: false },
            minorGridLines: { visible: false },
            majorGridLines: { visible: false }
        },
        tooltip: {
            visible: true,
            template:'',
        }              
    }
    getTooltipValue(value){
        let tooltipvalue = '';
        tooltipvalue = (value / 1000).toFixed(4);
        return tooltipvalue;
    }

    getChartColor(key) {
        if (key === "UI") return "#FFA300";
        if (key === "MT") return "#00AEEF";
        if (key === "DB") return "#C4D600";
        if (key === "Network") return "#FC4C02";
        return "#dddddd";
    };

    getBottomStyle() {
        if (this.type == 'Contract_Manager') return '60%';
        else if (this.type == 'Tender') return '-110%';
        else if (this.type == 'Contract') return '-462%';
    }

    getBottomVal() {
        if (this.type == 'Contract_Manager') return '100%';
        else if (this.type == 'Tender') return '-1096%';
        else if (this.type == 'Contract') return '-1455%';
    }

    setInitialDetails(action, label, initial?: boolean) {
        if (initial) {
            this.marks = [];
            this.tempMarkArray = [];
            this.tempMarks = {};
            this.dealArray = [];
        }
        this.tempMarks[action] = GridUtil.perfCacheBlock(action, label)
    }

    setFinalDetails(item, model, final?: boolean) {
        if (final) {
            GridUtil.add(GridUtil.stop(this.tempMarks[item]), this.marks);
        } else if (item == 'Save Contract Root') {
            GridUtil.add(GridUtil.stop(this.tempMarks[item]), this.dealArray);
        } else {
            GridUtil.add(GridUtil.stop(this.tempMarks[item]), this.tempMarkArray);
        }
        this.tempMarks[item].chartData = [{
            name: this.tempMarks[item].category,
            title: this.tempMarks[item].title,
            data: [this.tempMarks[item].executionMs],
            color: GridUtil.getChartColor(model)
        }];
        if (this.dealArray.length > 0) {
            this.dealArray[0].marks = this.tempMarkArray;
            if (this.marks.length > 0) this.marks[0].marks = this.dealArray;
        }
        else
            if (this.marks.length > 0) this.marks[0].marks = this.tempMarkArray;
    }

    addPerfTime(item, perfTimes) {
        this.tempMarks[item].marks = GridUtil.addPerfTimes(perfTimes);
    }

    mark(title) {
        GridUtil.add(GridUtil.prefCacheMark(title), this.tempMarkArray);
    };

    generatechart(drawChart) {
        if (this.marks != undefined && this.marks.length > 0 && drawChart) {
            this.drawChart();
        }
    }

    getChartData(marks) {
        if (marks.marks.length > 0) {
            var rtn = [];
            // get all blocks
            for (let m = 0; m < marks.marks.length; m++) {
                if (marks.marks[m].type === "block") {
                    var data = this.getChartData(marks.marks[m]);
                    for (var d = 0; d < data.length; d++) {
                        rtn.push(data[d]);
                    }
                }
            }
            // get gap time
            let totTime = 0;
            for (let r = 0; r < rtn.length; r++) {
                totTime += rtn[r].data[0];
            }
            if (marks.executionMs >= totTime) {
                    rtn.push({
                        name: "Unknown",
                        title: marks.title,
                        data: [marks.executionMs - totTime],
                        color: this.getChartColor('')
                    });
                }
            return rtn;
        } else {
            return [
                {
                    name: marks.category,
                    title: marks.title,
                    data: [marks.executionMs],
                    color: this.getChartColor(marks.category)
                }
            ];
        }
    }

   
    drawChart() {
        let data = {
            executionMs: this.marks[0].executionMs,
            data: this.getChartData(this.marks[0])
        };
        this.perfDataValue = data;
        let totTimes = {};
        let uid = GridUtil.generateUUID();
        let logData = [];
        for (let d = 0; d < data.data.length; d++) {
            let item = data.data[d];
            if (totTimes[item.name] === undefined) totTimes[item.name] = 0;
            totTimes[item.name] += item.data[0];
            this.totalExecutionTime += Number(item.data[0]);
            logData.push({
                uid: uid,
                title: this.marks[0].title,
                executionMs: this.marks[0].executionMs,
                start: this.marks[0].start,
                end: this.marks[0].end,
                mode: item.name,
                task: item.title,
                taskMs: item.data[0]
            });
        }
        this.contractManagerSvc.loggingPerfomanceTimes(logData).pipe(takeUntil(this.destroy$)).subscribe((res) => {}, (err) => {
            this.loggerSvc.error("perfomanceTimes error " , err);
        });
        this.totTimesValue = totTimes;
        this.executionMsValue = (this.totalExecutionTime /1000).toFixed(4);
        this.chartData = data.data;
        this.totTimesArray  = Object.keys(totTimes).map(function(key)  
        {  
            let value = (totTimes[key] /1000).toFixed(4);
            return [key, value];  
        }); 
        
    };
    getTitle(value){
    }
    closeDetails(){
        this.showPerfDetails = false;
    }
    showDetails() {
        this.showPerfDetails = true;
    }
    showFixedValues(value){
        let returnValue = (value /1000).toFixed(4)+'s';
        return returnValue;
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}