import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-gettingStarted-dev',
    templateUrl: 'Client/src/app/codingPractices/gettingStartedForDev/gettingStartedForDev.component.html',
    styleUrls: ['Client/src/app/codingPractices/gettingStartedForDev/gettingStartedForDev.component.css'],
})
export class GettingStartedForDevComponent implements OnInit {
    public list_breadcrumbs: any;
    public left_nav: any;
    public isVisible: boolean = true;
    public flagBool: string;

    constructor() { }

    ngOnInit(): void {
        this.list_breadcrumbs = [
            { text: "Coding practices", url: "Home" },
            { text: "Getting Started for Developer", url: "GettingStartedForDeveloper" },
            { text: "Get Access", url: "javascript:void(0)" }
        ];

        this.left_nav = [
            {
                text: "Get Access",
                url: '#getAccess',
                bool: 'getAccess',
                items: [
                    { text: "AGS Requests", url: '#myAGS', bool: 'myRequests' },
                    { text: "Local Project Setup", url: '#projectClone', bool: 'projectCloning' },
                ]
            },
            { text: "Onboarding Process for DB", url: '#onboardingProcessForDB', bool: 'onboardingProcessForDB' },
            { text: "SSIS Batch Job Process", url: '#batchJobProcess', bool: 'batchJobProcess' },
            { text: "KT Docs", url: '#ktDocs', bool: 'ktDocs' },
        ];
    }

    responseLnav(e: any, sKey?) {
        this.flagBool = e.bool;
        if (this.flagBool == "getAccess") {
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Getting Started For Developer", url: "GettingStartedForDeveloper" },
                { text: "Get Access", url: '#getAccess' }
            ];
        } else if (this.flagBool == "myRequests") {
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Getting Started For Developer", url: "GettingStartedForDeveloper" },
                { text: "AGS Requests", url: '#myAGS' }
            ];

        }
        else if (this.flagBool == "projectCloning") {
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Getting Started For Developer", url: "GettingStartedForDeveloper" },
                { text: "Local Project Setup", url: '#projectClone' }
            ];
        }
        else if (this.flagBool == "onboardingProcessForDB") {
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Getting Started For Developer", url: "GettingStartedForDeveloper" },
                { text: "Onboarding Process for DB", url: '#onboardingProcessForDB' },
            ];
        }
        else if (this.flagBool == "batchJobProcess") {
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Getting Started For Developer", url: "GettingStartedForDeveloper" },
                { text: "SSIS Batch Job Process", url: '#batchJobProcess' },
            ];
        }
        else if (this.flagBool == "ktDocs") {
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Getting Started For Developer", url: "GettingStartedForDeveloper" },
                { text: "KT Docs", url: '#ktDocs' },
            ];
        }
        const url = document.querySelector(e.url);
        url.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    Toggle() {
        this.isVisible = !this.isVisible
    }

    navigateToSelectedLink(dataItem, sKey?) {
        const url = document.querySelector(dataItem.url);
        url.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.responseLnav(dataItem, sKey);
    }
}