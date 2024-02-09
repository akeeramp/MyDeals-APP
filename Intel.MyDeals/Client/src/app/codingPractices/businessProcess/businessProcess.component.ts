import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-business-process',
    templateUrl: 'Client/src/app/codingPractices/businessProcess/businessProcess.component.html',
    styleUrls: ['Client/src/app/codingPractices/businessProcess/businessProcess.component.css'],
})
export class BusinessProcessComponent implements OnInit {
    public list_breadcrumbs : any;
    public left_nav : any;
    public isVisible: boolean = true;
    public flagBool: string;

    constructor() { }

    ngOnInit(): void {
        this.list_breadcrumbs = [
            { text: "Coding practices", url: "Home" },
            { text: "Business Process and Abstract Design", url: "BusinessDesign" },
            { text: "Introduction", url: "javascript:void(0)" }
        ];

        this.left_nav = [
            { text: "Introduction", url:'#Introduction', bool: 'Introduction' },
            {
                text: "Scope in Business Process",
                url: '#scopeBusinessProcess',
                bool: 'scopeBusinessProcess',
                items: [
                    { text: "Business Process Injection Points", url: '#injectionPoints', bool: 'injectionPoints' },
                    { text: "Rebate Strategies", url: '#rebateStrategies', bool:'rebateStrategies' },
                    { text: "Pricing Strategies", url: '#pricingStrategies', bool: 'pricingStrategies' },
                    { text: "Pricing Table Association", url: '#ptAssociation', bool: 'ptAssociation' },
                    { text: "Rebate Strategy Versions", url: '#rsVersions', bool: 'rsVersions' },
                    { text: "Rebate Strategy Approval", url: '#rsApproval', bool: 'rsApproval' },
                    { text: "Deal Validation", url: '#dealValidation', bool: 'dealValidation' },
                    { text: "Overlapping Deals", url: '#overlappingDeals', bool:'overlappingDeals' },
                    { text: "Meet Comp Test", url: '#meetCompTest', bool:'meetCompTest' },
                    { text: "Pricing Cost Test", url: '#pricingCostTest', bool:'pricingCostTest' },
                    { text: "Term and Conditions", url: '#termAndConditions', bool:'termAndConditions' },
                    { text: "Contract", url: '#Contract', bool:'Contract' },
                    { text: "Customer Acceptance", url: '#customerAcceptance', bool:'customerAcceptance' },
                    { text: "Deal Entry", url: '#dealEntry', bool:'dealEntry' },
                    { text: "Deal Approval", url: '#dealApproval', bool:'dealApproval' },
                ]
            },
            { text: "Data Model Object", url:'#dataModelObject', bool:'dataModelObject' },
            { text: "Other Features", url:'#otherFeatures', bool:'otherFeatures' }
        ];
    }

    showContractDetailsInfo() {
        window.open('https://wiki.ith.intel.com/display/Handbook/Create+Contract', '_blank');
    }
    showMyDealsTypesLink() {
        window.open('https://wiki.ith.intel.com/display/Handbook/Deal+Types', '_blank');
    }
    showOverlapInfoLink() {
        window.open('https://wiki.ith.intel.com/display/Handbook/Overlapping+Deals+Check', '_blank');
    }
    showMeetCompData() {
        window.open('https://wiki.ith.intel.com/display/Handbook/Meet+Comp', '_blank');
    }
    showPriceCostTest() {
        window.open('https://wiki.ith.intel.com/display/Handbook/Cost+Test', '_blank');
    }
    showRebateContractInfoLink() {
        window.open('https://wiki.ith.intel.com/display/Handbook/Contract+Navigator', '_blank');
    }
    showPricingTableInfo() {
        window.open('https://wiki.ith.intel.com/pages/viewpage.action?pageId=1205144854', '_blank');
    }
    showAutofillInfo() {
        window.open('https://wiki.ith.intel.com/display/Handbook/Autofill+Defaults', '_blank');
    }
    responseLnav(e:any,sKey?){
        this.flagBool = e.bool;
        if(this.flagBool == "Introduction"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Business Process and Abstract Design", url: "BusinessDesign" },
                { text: "Introduction", url:'#Introduction' }
            ];
        } else if(this.flagBool == "scopeBusinessProcess"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Business Process and Abstract Design", url: "BusinessDesign" },
                { text: "Scope in Business Process", url: '#scopeBusinessProcess' },
            ];
        } else if(this.flagBool == "injectionPoints"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Business Process and Abstract Design", url: "BusinessDesign" },
                { text: "Business Process Injection Points", url: '#injectionPoints' },
            ];
        } else if(this.flagBool == "rebateStrategies"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Business Process and Abstract Design", url: "BusinessDesign" },
                { text: "Rebate Strategies", url: '#rebateStrategies' }
            ];
        } else if(this.flagBool == "pricingStrategies"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Business Process and Abstract Design", url: "BusinessDesign" },
                { text: "Pricing Strategies", url: '#pricingStrategies' }
            ];
        } else if(this.flagBool == "ptAssociation"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Business Process and Abstract Design", url: "BusinessDesign" },
                { text: "Pricing Table Association", url: '#ptAssociation' }
            ];
        } else if(this.flagBool == "rsVersions"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Business Process and Abstract Design", url: "BusinessDesign" },
                { text: "Rebate Strategy Versions", url: '#rsVersions' }
            ];
        } else if(this.flagBool == "rsApproval"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Business Process and Abstract Design", url: "BusinessDesign" },
                { text: "Rebate Strategy Approval", url: '#rsApproval' }
            ];
        } else if(this.flagBool == "dealValidation"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Business Process and Abstract Design", url: "BusinessDesign" },
                { text: "Deal Validation", url: '#dealValidation' }
            ];
        } else if(this.flagBool == "overlappingDeals"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Business Process and Abstract Design", url: "BusinessDesign" },
                { text: "Overlapping Deals", url: '#overlappingDeals' }
            ];
        } else if(this.flagBool == "meetCompTest"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Business Process and Abstract Design", url: "BusinessDesign" },
                { text: "Meet Comp Test", url: '#meetCompTest' }
            ];
        } else if(this.flagBool == "pricingCostTest"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Business Process and Abstract Design", url: "BusinessDesign" },
                { text: "Pricing Cost Test", url: '#pricingCostTest' }
            ];
        } else if(this.flagBool == "termAndConditions"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Business Process and Abstract Design", url: "BusinessDesign" },
                { text: "Term and Conditions", url: '#termAndConditions' }
            ];
        } else if(this.flagBool == "Contract"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Business Process and Abstract Design", url: "BusinessDesign" },
                { text: "Contract", url: '#Contract' }
            ];
        } else if(this.flagBool == "customerAcceptance"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Business Process and Abstract Design", url: "BusinessDesign" },
                { text: "Customer Acceptance", url: '#customerAcceptance' }
            ];
        } else if(this.flagBool == "dealEntry"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Business Process and Abstract Design", url: "BusinessDesign" },
                { text: "Deal Entry", url: '#dealEntry' }
            ];
        } else if(this.flagBool == "dealApproval"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Business Process and Abstract Design", url: "BusinessDesign" },
                { text: "Deal Approval", url: '#dealApproval' }
            ];
        } else if(this.flagBool == "dataModelObject"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Business Process and Abstract Design", url: "BusinessDesign" },
                { text: "Data Model Object", url:'#dataModelObject' }
            ];
        } else if(this.flagBool == "otherFeatures"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Business Process and Abstract Design", url: "BusinessDesign" },
                { text: "Other Features", url:'#otherFeatures' }
            ];
        }
        const url = document.querySelector(e.url);
        url.scrollIntoView({ behavior: 'smooth', block: 'start'});
    }

    Toggle() {
        this.isVisible = !this.isVisible
    }

    navigateToSelectedLink(dataItem,sKey?){
        const url = document.querySelector(dataItem.url);
        url.scrollIntoView({ behavior: 'smooth', block: 'start'});
        this.responseLnav(dataItem,sKey);
    }

}