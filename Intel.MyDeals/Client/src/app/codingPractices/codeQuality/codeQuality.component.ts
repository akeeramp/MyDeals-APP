import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-code-quality',
    templateUrl: 'Client/src/app/codingPractices/codeQuality/codeQuality.component.html',
    styleUrls: ['Client/src/app/codingPractices/codeQuality/codeQuality.component.css'],
})
export class CodeQualityComponent implements OnInit {

    constructor() { }

    public list_breadcrumbs : any;
    public proLnav: any[]
    public left_nav: any;
    public isVisible: boolean = true;
    public flagBool: string;
    public keySelected: any = '0';



    ngOnInit(): void {
        this.list_breadcrumbs = [
            { text: "Coding practices", url: "Home" },
            { text: "MyDeals Code Quality Standards", url: "CodeQuality", bool: 'codeQuality' },
            { text: "Introduction", url: "javascript:void(0)", bool: 'codeQuality' }
        ];

        this.left_nav = [
            { text: "Introduction", url:'#codeQuality', bool: "codeQuality" },
            { text: "Unit Testing", url:'#unitTest', bool: "unitTest" },
            { text: "SonarQube", url: '#sonarScan', bool: "sonarScan" },
            { text: "Spectral Scan", url: '#spectralScan', bool: "spectralScan" },
            { text: "UIPath", url: '#uipath', bool: "uipath" },
            { text: "JMeter", url: '#jmeter', bool: "jmeter" },
            { text: "Semgrep", url: '#semgrep', bool: "semgrep" },
            { text: "Dynatrace", url: '#dynatrace', bool: "dynatrace" },
            
            
        ]
    }
    Toggle() {
        this.isVisible = !this.isVisible
    }

    navigateToSelectedLink(dataItem,sKey?){
        const url = document.querySelector(dataItem.url);
        url.scrollIntoView({ behavior: 'smooth', block: 'start'});
        this.responseLnav(dataItem,sKey);
    }

    responseLnav(e:any,sKey?){
        this.flagBool = e.bool;
        if(this.flagBool == "codeQuality"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "MyDeals Code Quality Standards", url: "CodeQuality" },
                { text: "Introduction", url: "javascript:void(0)" }
            ];
        } else if(this.flagBool == "unitTest"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "MyDeals Code Quality Standards", url: "CodeQuality" },
                { text: "Unit Testing", url: "javascript:void(0)" }
            ];
            this.keySelected = sKey;
        } else if(this.flagBool == "sonarScan"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "MyDeals Code Quality Standards", url: "CodeQuality" },
                { text: "SonarQube", url: "javascript:void(0)" }
            ];
        }  else if ( this.flagBool == 'spectralScan'){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "MyDeals Code Quality Standards", url: "CodeQuality" },
                { text: "Spectral Scan", url: "javascript:void(0)" }
            ];
        } else if (this.flagBool == 'uipath') {
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "MyDeals Code Quality Standards", url: "CodeQuality" },
                { text: "UIPath", url: "javascript:void(0)" }
            ];
        } else if (this.flagBool == 'jmeter') {
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "MyDeals Code Quality Standards", url: "CodeQuality" },
                { text: "JMeter", url: "javascript:void(0)" }
            ];
        } else if (this.flagBool == 'semgrep') {
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "MyDeals Code Quality Standards", url: "CodeQuality" },
                { text: "Semgrep", url: "javascript:void(0)" }
            ];
        } else if (this.flagBool == 'dynatrace') {
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "MyDeals Code Quality Standards", url: "CodeQuality" },
                { text: "Dynatrace", url: "javascript:void(0)" }
            ];
        }

        const url = document.querySelector(e.url);
        url.scrollIntoView({ behavior: 'smooth', block: 'start'});
    }
}
