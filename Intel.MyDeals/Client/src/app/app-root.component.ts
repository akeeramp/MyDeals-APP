import { Component } from "@angular/core";
import { each } from "underscore";

@Component({
    selector: 'app-root',
    templateUrl: 'Client/src/app/app-root.component.html',
    styleUrls: ['Client/src/app/app-root.component.css']
})
export class AppRootComponent {
    constructor() { }

    ngOnInit() {
         //this functionality will enable when dashboard landing to this page
         document.getElementsByClassName('loading-screen')[0]?.setAttribute('style', 'display:none');
         let divLoader=document.getElementsByClassName('jumbotron')
         if(divLoader&& divLoader.length>0){
         each(divLoader,div=>{
             div.setAttribute('style', 'display:none');
         })
         }
         //this functionality will disable anything of .net ifloading to stop when dashboard landing to this page
         document.getElementById('mainBody')?.setAttribute('style', 'display:none');
    }
}