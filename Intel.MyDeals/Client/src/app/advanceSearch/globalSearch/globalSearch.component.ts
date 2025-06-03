import { Component, ViewChild, OnDestroy } from "@angular/core";
import { broadCastService } from "../../core/dealPopup/broadcast.service";
import { GlobalSearchResultsComponent } from "../globalSearchResults/globalSearchResults.component";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
@Component({
  selector: 'global-search-angular',
  templateUrl: 'Client/src/app/advanceSearch/globalSearch/globalSearch.component.html',
  styleUrls:['Client/src/app/advanceSearch/globalSearch/globalSearch.component.css']
})
export class GlobalSearchComponent implements OnDestroy {
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();
    //for calling Child function from Parent
    @ViewChild(GlobalSearchResultsComponent) GlobalSearchResults: GlobalSearchResultsComponent; 
    private searchText = "";
    private opType = "ALL";
    private searchDialogVisible = false;
    private windowOpened = false;
    private windowTop = 75; windowLeft = 300; windowWidth = 950; windowHeight = 500; windowMinWidth = 100; windowMinHeight = 100;

    constructor(private broadcastService: broadCastService) { }

    enterPressed(event: any) {
        //KeyCode 13 is 'Enter'
        if (event.keyCode === 13) {
            if (this.searchText != "") {
                //opening kendo window
                this.searchText = this.searchText.trim();
                this.executeOnly(this.opType);
                this.setWindowWidth();
                this.windowOpened = true;
            } else {
                this.searchDialogVisible = true;
            }
        }
    }

    setWindowWidth() {
        if (this.opType == "ALL") {
            this.windowWidth = 1000;
        } else {
            this.windowWidth = 600;
        }
    }

    closeDialog() {
        this.searchDialogVisible = false;
    }

    executeOnly(opType: string) {
        if (this.searchText != "") {
            //opening kendo window
            this.opType = opType;
            this.setWindowWidth();
            //this condition is required since this should work only if kendo window is open 
            if (this.GlobalSearchResults) {
                this.GlobalSearchResults.onOpTypeChange(this.opType);
                this.windowOpened = true;
            } else {
                this.windowOpened = true;
            }
        } else {
            this.searchDialogVisible = true;
        }
    }

    windowClose() {
        this.windowOpened = false;
    }

    //these methods are output methods from GlobalSearchResultsComponent
    getWindowWidth($event: number) {
        this.windowWidth = $event;
    }

    isWindowOpen($event: boolean) {
        this.windowOpened = $event;
        this.searchText = "";
    }

    ngOnInit() {
        this.broadcastService.on("contractSearch").pipe(takeUntil(this.destroy$)).subscribe(event => {
            this.searchText = event.payload.searchText;
            this.opType = event.payload.opType;

            if (event.payload.event == "selectedValue") {
                this.executeOnly(event.payload.opType);
            } else {
                this.enterPressed(event.payload.event);
            }
        });
    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}