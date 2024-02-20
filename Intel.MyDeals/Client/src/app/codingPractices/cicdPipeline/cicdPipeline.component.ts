import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-cicd-pipeline',
    templateUrl: 'Client/src/app/codingPractices/cicdPipeline/cicdPipeline.component.html',
    styleUrls: ['Client/src/app/codingPractices/cicdPipeline/cicdPipeline.component.css'],
})
export class CicdPipelineComponent implements OnInit {
   
    constructor() { }

    public list_breadcrumbs : any;
    public proLnav: any[];
    public flagBool: string;
    public left_nav: any;
    public keySelected: any = '0';
    public isVisible: boolean = true;

    loadSelected(e: any, sKey?){
        this.flagBool = e.bool;
        if (this.flagBool == "intro") {
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "MyDeals CI/CD Pipeline", url: "CiCdPipeline" },
                { text: "Introduction", url: "javascript:void(0)" }
            ];
        } else if (this.flagBool == "ui-pipeline") {
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "MyDeals CI/CD Pipeline", url: "CiCdPipeline" },
                { text: "UI Pipeline", url: "javascript:void(0)" }
            ];
            this.keySelected = sKey;
        } else if (this.flagBool == "db-pipeline") {
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "MyDeals CI/CD Pipeline", url: "CiCdPipeline" },
                { text: "DB Pipeline", url: "javascript:void(0)" }
            ];
        } else if (this.flagBool == "deployment-process") {
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "MyDeals CI/CD Pipeline", url: "CiCdPipeline" },
                { text: "Deployment process", url: "javascript:void(0)" }
            ];
            this.keySelected = sKey;
        } 

        const url = document.querySelector(e.url);
        url.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    ngOnInit(): void {
        this.list_breadcrumbs = [
            { text: "Coding practices", url: "Home" },
            { text: "MyDeals CI/CD Pipeline", url: "CiCdPipeline", bool: 'cicdPipeline' },
            { text: "Introduction", url: "javascript:void(0)", bool: 'intro' }
        ];

        this.left_nav = [
            { text: "Introduction", url: '#intro', bool: "intro" },
            { text: "UI Pipeline", url: '#ui-pipeline', bool: "ui-pipeline" },
            { text: "DB Pipeline", url: '#db-pipeline', bool: "db-pipeline" },
            { text: "Deployment process", url: '#deployment-process', bool: "deployment-process" },
        ];
    }
    Toggle() {
        this.isVisible = !this.isVisible
    }


}