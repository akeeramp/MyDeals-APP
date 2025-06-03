import { Component, OnDestroy } from "@angular/core";
import { pingService } from '../core.shared.service';
import { logger } from "../../shared/logger/logger";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector:'ping',
    template: `<i class="fa fa-signal ping-net" role="button" [ngClass]="getClassName(pingTime)" (click)="pingHost()" title="Network Ping: {{pingTime}} ms" aria-hidden="true"></i>
        <i class="batch-running" *ngIf="batchInProgress" title="There is a database batch job currently in progress&#013;This will effect performance a little" style="padding-left: 10px;"><b>BATCH IN PROGRESS</b></i>`,
    styles: [`.ping-net.high {color: #FC4C02;} .ping-net.med {color: #ffda24;}.ping-net.low {color: #76d600; }.ping-net.none { color: #cccccc;} .batch-running {color: #f3d54e;margin- right: 20px;}`]
})

export class PingComponent implements OnDestroy {
    constructor(private pingSvc: pingService,private loggerSvc:logger) { }

    public pingTime: any = null;
    public batchInProgress = false;
    public pingCycle = 60000;
    public pingValues: Array<number> = [];
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();

    ngOnInit() {
        this.ping();
    }

    ping() {
        this.pingHost();
        this.pingSvc.getBatchStatus().pipe(takeUntil(this.destroy$))
            .subscribe(output => {
                this.batchInProgress = false;
                if (output.CNST_VAL_TXT !== undefined && output.CNST_VAL_TXT.toUpperCase() !== "COMPLETED") {
                    this.batchInProgress = true;
                }
            },(err)=>{
                this.loggerSvc.error("Ping Error","Error",err);
            });
    }

    pingHost() {
        const ping: Date = new Date();
        this.pingSvc.pingHost().pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.pingTime = <any>new Date() - <any>ping;
                this.pingValues.push(this.pingTime);
                if (this.pingValues.length > 10) this.pingValues.shift();
                setTimeout(() => {
                    this.pingHost();
                }, this.pingCycle);
            }, err => {
                    this.loggerSvc.error("Ping Error", err);
            });
    }

    getClassName(pingTime) {
        if (pingTime === undefined || pingTime === null) {
            return "none";
        } else if (pingTime < 150) {
            return "low";
        } else if (pingTime < 400) {
            return "med";
        }
        return "high";                   
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

