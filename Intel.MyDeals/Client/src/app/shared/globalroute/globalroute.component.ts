import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as _ from "underscore";

@Component({
    selector: "global-route",
    template:''
})

export class globalRouteComponent {
    constructor(private route: ActivatedRoute) { }
    
    ngAfterViewInit() {
        //this functionality will enable when dashboard landing to this page
        document.getElementsByClassName('loading-screen')[0]?.setAttribute('style', 'display:none');
        let divLoader=document.getElementsByClassName('jumbotron')
        if(divLoader&& divLoader.length>0){
         _.each(divLoader,div=>{
            div.setAttribute('style', 'display:none');
         })
        }
        //this functionality will disable anything of .net ifloading to stop when dashboard landing to this page
        document.getElementById('mainBody')?.setAttribute('style', 'display:none');
    }
    async redirectToRoute() {
        const cid = this.route.snapshot.paramMap.get('cid');
        const PSID = this.route.snapshot.paramMap.get('PSID');
        const PTID = this.route.snapshot.paramMap.get('PTID');
        const DealID = this.route.snapshot.paramMap.get('DealID');
        
        const type = this.route.snapshot.paramMap.get('type');
        if (type == "CNTRCT") {
            window.location.href = "#/contractmanager/CNTRCT/" + cid + "/0/0/0";
        }
        else if (type == "PS") {// if user searched Pricing Strategy
            window.location.href = "#/contractmanager/PT/" + cid + "/" + PSID + "/0/0";
        }
        else if (type == "PT") {// if user searched Pricing Table
            window.location.href = "#/contractmanager/PT/" + cid + "/" + PSID + "/" + PTID + "/0";
        }
        else if (type == "WIP") {// if user searched Deal Id
            window.location.href = "#/contractmanager/WIP/" + cid + "/" + PSID + "/" + PTID + "/" + DealID;
        } else if (type == null && cid != null &&  cid != "0") {
            window.location.href = "#/contractmanager/CNTRCT/" + cid + "/0/0/0";   
        }
        else {
            window.location.href = "#/portal";
        } 

     }
    ngOnInit() {
        this.redirectToRoute();
    }
}