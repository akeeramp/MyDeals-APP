import { Component } from "@angular/core";
import * as _ from "underscore";

@Component({
    selector: "global-route",
    template:''
})

export class globalRouteComponent {
    constructor() { }
    
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
        const url = new URL(window.location.href).toString().split('/');
        let index = url.indexOf('manager');
        if(index && index>0){
            let cid = url[index + 1];
            if (!Number.isNaN(Number(cid))) {//if user entered angular js url - contract url
                window.location.href = "#/contractmanager/CNTRCT/" + cid + "/0/0/0";                
            }
            else { // Global Search Scenarios redirection
                if (cid == "CNTRCT") {// if user searched contract
                    let index = url.indexOf('CNTRCT');
                    window.location.href = "#/contractmanager/CNTRCT/" + url[index + 1] + "/0/0/0";                    
                }
                else if (cid == "PS") {// if user searched Pricing Strategy
                    let index = url.indexOf('PS');
                    window.location.href = "#/contractmanager/PT/" + url[index + 1] + "/" + url[index + 2] + "/0/0";                    
                }
                else if (cid == "PT") {// if user searched Pricing Table
                    let index = url.indexOf('PT');
                    window.location.href = "#/contractmanager/PT/" + url[index + 1] + "/" + url[index + 2] + "/" + url[index + 3] +"/0";
                }
                else if (cid == "WIP") {// if user searched Deal Id
                    let index = url.indexOf('WIP');
                    window.location.href = "#/contractmanager/WIP/" + url[index + 1] + "/" + url[index + 2] + "/" + url[index + 3] + "/" + url[index + 4];
                }
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