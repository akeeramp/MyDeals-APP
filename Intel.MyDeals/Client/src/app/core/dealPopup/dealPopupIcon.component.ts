import { Component,  Input } from "@angular/core";
import { AppEvent, broadCastService } from "./broadcast.service";
import { quickDealConstants } from "../angular.constants"; 

@Component({
    selector: "deal-popup-icon",
    templateUrl: "Client/src/app/core/dealPopup/dealPopupIcon.component.html", 
})

export class dealPopupIconComponent {

    constructor( private brdcstservice: broadCastService) {}

    iconEnabled: any;

    @Input() dealId; 

    menuClick($event) { 
        const x = $event.clientX + 12;
        const y = $event.clientY + 2;

       const dealdata = {
           x: x,
           y: y,
           id: this.dealId,
           key:"QuickDealToggleDeal"
        }
       
        this.brdcstservice.dispatch(new AppEvent(dealdata.key, dealdata)); 
    }

    ngOnInit() {
       this.iconEnabled = quickDealConstants.enabled;
    }
}

 