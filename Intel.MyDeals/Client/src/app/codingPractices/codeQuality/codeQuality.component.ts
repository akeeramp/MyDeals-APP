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

    loadSelected(dataItem){
        
    }

    ngOnInit(): void {
        this.list_breadcrumbs = [
            { text: "Coding practices", url: "Home" },
            { text: "MyDeals Code Quality Standards", url: "CodeQuality", bool: 'codeQuality' },
            { text: "Introduction", url: "javascript:void(0)", bool: 'codeQuality' }
        ];

        this.left_nav = [
            { text: "Introduction", url:'#codeQuality', bool: "codeQuality" },
        ];
    }
    Toggle() {
        this.isVisible = !this.isVisible
    }
}
