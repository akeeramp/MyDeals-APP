import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-cicd-pipeline',
    templateUrl: 'Client/src/app/codingPractices/cicdPipeline/cicdPipeline.component.html',
    styleUrls: ['Client/src/app/codingPractices/cicdPipeline/cicdPipeline.component.css'],
})
export class CicdPipelineComponent implements OnInit {
   
    constructor() { }

    public list_breadcrumbs : any;
    public proLnav: any[]
    public left_nav: any;
    public isVisible: boolean = true;

    loadSelected(dataItem){
        
    }

    ngOnInit(): void {
        this.list_breadcrumbs = [
            { text: "Coding practices", url: "Home" },
            { text: "MyDeals CI/CD Pipeline", url: "CiCdPipeline", bool: 'cicdPipeline' },
            { text: "Introduction", url: "javascript:void(0)", bool: 'cicdPipeline' }
        ];

        this.left_nav = [
            { text: "Introduction", url:'#cicdPipeline', bool: "cicdPipeline" },
        ];
    }
    Toggle() {
        this.isVisible = !this.isVisible
    }


}