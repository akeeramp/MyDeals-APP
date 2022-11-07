import * as angular from "angular";
import { Component } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { logger } from "../logger/logger";
import * as _ from "underscore";
import { DynamicEnablementService } from "../services/dynamicEnablement.service";

@Component({
    selector: "global-route",
    template:''
})

export class globalRouteComponent {
    constructor(private loggerSVC:logger,private dynamicEnablementService: DynamicEnablementService) { }
    //To load angular Contract Manager from search change value to false, will be removed once contract manager migration is done
    public angularEnabled:boolean=false;

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
    async redirectToRoute(){
        //this code tells where to route  either Angular or AngularJS
        this.angularEnabled=await this.dynamicEnablementService.isAngularEnabled();
        //based on the flag it will redirect to Angular or AngularJS
        const url = window.location.href.split('/');
        let index = url.indexOf('manager');
        if(index && index>0){
            let cid = url[index + 1];
            if(this.angularEnabled){
                window.location.href = "#/contractmanager/CNTRCT/" + cid + "/0/0/0";
            }
            else{
                window.location.href = "#/managers/" + cid;
            }
        }
        else{
            window.location.href = "#/portal";
        }

     }
    ngOnInit() {
        this.redirectToRoute();
    }
}

angular.module("app").directive(
    "globalRoute",
    downgradeComponent({
        component: globalRouteComponent,
    })
);
