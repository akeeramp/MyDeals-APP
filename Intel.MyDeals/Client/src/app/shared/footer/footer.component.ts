import { Component, OnDestroy } from "@angular/core";
import { footerService } from "./footer.service";
import { logger } from "../logger/logger";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "app-footer",
    templateUrl: "Client/src/app/shared/footer/footer.component.html",
    styleUrls: ['Client/src/app/shared/footer/footer.component.css']
})

export class FooterComponent implements OnDestroy {
    constructor(private footerSvc: footerService,private loggerSVC:logger) { }
    private appVersion: string;
    private environment: string;
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();
    loadFooter() {
        this.footerSvc.getFooterDetails().pipe(takeUntil(this.destroy$)).subscribe(res => {
            this.appVersion=res.AppVer;
            this.environment=res.AppEnv;
        }, err => {
           this.loggerSVC.error("FooterComponent::getFooterDetails::",err);
        });
    }
    ngOnInit() {
        this.loadFooter();
    }
    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
