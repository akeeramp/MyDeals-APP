import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-scope-decision',
    templateUrl: 'Client/src/app/codingPractices/scopeDecision/scopeDecision.component.html',
    styleUrls: ['Client/src/app/codingPractices/scopeDecision/scopeDecision.component.css'],
})
export class ScopeDecisionComponent implements OnInit {

    constructor() { }

    public list_breadcrumbs : any;
    public proLnav: any[]
    public left_nav: any;
    public isVisible: boolean = true;

    public group = [{ field: "group" }];

    dataDesignPath = [
        { name: "Pricing Tables", type: "Independent" },{ name: "Pricing Table Association", type: "Independent" },{ name: "Overlapping Deals", type: "User defined" },
        { name: "Meet Comp Test", type: "All offline" },{ name: "Pricing Cost Test", type: "All offline" },{ name: "Term and Conditions", type: "Manually" },
        { name: "Contract", type: "Manual" },{ name: "Deal Validation", type: "None" },{ name: "Deal Entry", type: "Manual" },{ name: "Contract Versions", type: "Independent" },
        { name: "Contract Approval", type: "Independent" },{ name: "Deal Approval", type: "Independent" },{ name: "Customer Acceptance (C2A)", type: "Independent" },

        { name: "Pricing Tables", type: "Independent" },{ name: "Pricing Table Association", type: "Independent" },{ name: "Overlapping Deals", type: "User defined" },
        { name: "Meet Comp Test", type: "All offline" },{ name: "Pricing Cost Test", type: "All offline" },{ name: "Term and Conditions", type: "Manually" },
        { name: "Contract", type: "Manual" },{ name: "Deal Validation", type: "None" },{ name: "Deal Entry", type: "Manual" },{ name: "Contract Versions", type: "Independent" },
        { name: "Contract Approval", type: "Independent" },{ name: "Deal Approval", type: "Independent" },{ name: "Customer Acceptance (C2A)", type: "In App" },

        { name: "Pricing Tables", type: "Independent" },{ name: "Pricing Table Association", type: "Independent" },{ name: "Overlapping Deals", type: "User defined" },
        { name: "Meet Comp Test", type: "All offline" },{ name: "Pricing Cost Test", type: "All offline" },{ name: "Term and Conditions", type: "Manually" },
        { name: "Contract", type: "Manual" },{ name: "Deal Validation", type: "None" },{ name: "Deal Entry", type: "Manual" },{ name: "Contract Versions", type: "Independent" },
        { name: "Contract Approval", type: "Independent" },{ name: "Deal Approval", type: "In App" },{ name: "Customer Acceptance (C2A)", type: "Independent" },

        { name: "Pricing Tables", type: "Independent" },{ name: "Pricing Table Association", type: "Independent" },{ name: "Overlapping Deals", type: "User defined" },
        { name: "Meet Comp Test", type: "All offline" },{ name: "Pricing Cost Test", type: "All offline" },{ name: "Term and Conditions", type: "Manually" },
        { name: "Contract", type: "Manual" },{ name: "Deal Validation", type: "None" },{ name: "Deal Entry", type: "Manual" },{ name: "Contract Versions", type: "Independent" },
        { name: "Contract Approval", type: "Independent" },{ name: "Deal Approval", type: "In App" },{ name: "Customer Acceptance (C2A)", type: "In App" },

        { name: "Pricing Tables", type: "Independent" },{ name: "Pricing Table Association", type: "Independent" },{ name: "Overlapping Deals", type: "User defined" },
        { name: "Meet Comp Test", type: "All offline" },{ name: "Pricing Cost Test", type: "All offline" },{ name: "Term and Conditions", type: "Manually" },
        { name: "Contract", type: "Manual" },{ name: "Deal Validation", type: "None" },{ name: "Deal Entry", type: "Manual" },{ name: "Contract Versions", type: "Independent" },
        { name: "Contract Approval", type: "In App" },{ name: "Deal Approval", type: "Independent" },{ name: "Customer Acceptance (C2A)", type: "Independent" },

        { name: "Pricing Tables", type: "Independent" },{ name: "Pricing Table Association", type: "Independent" },{ name: "Overlapping Deals", type: "User defined" },
        { name: "Meet Comp Test", type: "All offline" },{ name: "Pricing Cost Test", type: "All offline" },{ name: "Term and Conditions", type: "Manually" },
        { name: "Contract", type: "Manual" },{ name: "Deal Validation", type: "None" },{ name: "Deal Entry", type: "Manual" },{ name: "Contract Versions", type: "Independent" },
        { name: "Contract Approval", type: "In App" },{ name: "Deal Approval", type: "Independent" },{ name: "Customer Acceptance (C2A)", type: "In App" },

        { name: "Pricing Tables", type: "Independent" },{ name: "Pricing Table Association", type: "Independent" },{ name: "Overlapping Deals", type: "User defined" },
        { name: "Meet Comp Test", type: "All offline" },{ name: "Pricing Cost Test", type: "All offline" },{ name: "Term and Conditions", type: "Manually" },
        { name: "Contract", type: "Manual" },{ name: "Deal Validation", type: "None" },{ name: "Deal Entry", type: "Manual" },{ name: "Contract Versions", type: "Independent" },
        { name: "Contract Approval", type: "In App" },{ name: "Deal Approval", type: "In App" },{ name: "Customer Acceptance (C2A)", type: "Independent" },

        { name: "Pricing Tables", type: "Independent" },{ name: "Pricing Table Association", type: "Independent" },{ name: "Overlapping Deals", type: "User defined" },
        { name: "Meet Comp Test", type: "All offline" },{ name: "Pricing Cost Test", type: "All offline" },{ name: "Term and Conditions", type: "Manually" },
        { name: "Contract", type: "Manual" },{ name: "Deal Validation", type: "None" },{ name: "Deal Entry", type: "Manual" },{ name: "Contract Versions", type: "Independent" },
        { name: "Contract Approval", type: "In App" },{ name: "Deal Approval", type: "In App" },{ name: "Customer Acceptance (C2A)", type: "In App" },

        { name: "Pricing Tables", type: "Independent" },{ name: "Pricing Table Association", type: "Independent" },{ name: "Overlapping Deals", type: "User defined" },
        { name: "Meet Comp Test", type: "All offline" },{ name: "Pricing Cost Test", type: "All offline" },{ name: "Term and Conditions", type: "Manually" },
        { name: "Contract", type: "Manual" },{ name: "Deal Validation", type: "None" },{ name: "Deal Entry", type: "Manual" },{ name: "Contract Versions", type: "In App" },
        { name: "Contract Approval", type: "Independent" },{ name: "Deal Approval", type: "Independent" },{ name: "Customer Acceptance (C2A)", type: "Independent" },

        { name: "Pricing Tables", type: "Independent" },{ name: "Pricing Table Association", type: "Independent" },{ name: "Overlapping Deals", type: "User defined" },
        { name: "Meet Comp Test", type: "All offline" },{ name: "Pricing Cost Test", type: "All offline" },{ name: "Term and Conditions", type: "Manually" },
        { name: "Contract", type: "Manual" },{ name: "Deal Validation", type: "None" },{ name: "Deal Entry", type: "Manual" },{ name: "Contract Versions", type: "In App" },
        { name: "Contract Approval", type: "Independent" },{ name: "Deal Approval", type: "Independent" },{ name: "Customer Acceptance (C2A)", type: "In App" },
    ];

    dataTable = [
        {
            "group": "02) Pricing Tables",
            "title": "Independent",
            "desc": "Pricing Tables are manually pieced together from offline spreadsheets",
            "class": "fa fa-money",
            "perf": 2,
            "perfReason": "Current process, so no gain",
            "integ": 2,
            "integReason": "Process and checks already in place, but human error can occur",
            "size": 5,
            "sizeReason": "Current process",
            "roi": 2,
            "roiReason": "Maximum flexibily",
            "ux": 2,
            "uxReason": "Current process"
        }, {
            "group": "02) Pricing Tables",
            "title": "Auto generated",
            "desc": "Pricing tables are auto-generated from spreadsheets into the app",
            "class": "fa fa-money",
            "perf": 2,
            "perfReason": "There would still need to be a manual piece to map to pricing table",
            "integ": 3,
            "integReason": "Controlled checks and balances",
            "size": 0,
            "sizeReason": "Too many customer-defined processes",
            "roi": 3,
            "roiReason": "Controlled process",
            "ux": 3,
            "uxReason": "Little known about what the UX might be"
        }, {
            "group": "03) Pricing Table Association",
            "title": "Independent",
            "desc": "User manages and controls how pricing tables should be converted",
            "class": "fa fa-table",
            "perf": 2,
            "perfReason": "Current process, so no gain",
            "integ": 2,
            "integReason": "Current process, but prone to human error",
            "size": 5,
            "sizeReason": "Current process",
            "roi": 2,
            "roiReason": "Current process",
            "ux": 2,
            "uxReason": "Current process"
        }, {
            "group": "03) Pricing Table Association",
            "title": "Automated",
            "desc": "Direct tie to deals via rules",
            "class": "fa fa-table",
            "perf": 5,
            "perfReason": "",
            "integ": 5,
            "integReason": "",
            "size": 3,
            "sizeReason": "",
            "roi": 5,
            "roiReason": "",
            "ux": 5,
            "uxReason": ""
        }, {
            "group": "03) Pricing Table Association",
            "title": "Manually Mapped",
            "desc": "Direct tie: user maps to Deal Type",
            "class": "fa fa-table",
            "perf": 3,
            "perfReason": "",
            "integ": 3,
            "integReason": "",
            "size": 4,
            "sizeReason": "",
            "roi": 3,
            "roiReason": "",
            "ux": 3,
            "uxReason": ""
        }, {
            "group": "04) Overlapping Deals",
            "title": "User defined",
            "desc": "",
            "class": "fa fa-exchange",
            "perf": 2,
            "perfReason": "",
            "integ": 2,
            "integReason": "",
            "size": 5,
            "sizeReason": "",
            "roi": 2,
            "roiReason": "",
            "ux": 2,
            "uxReason": ""
        }, {
            "group": "04) Overlapping Deals",
            "title": "App Identifies",
            "desc": "Overlapping Deals identified by App",
            "class": "fa fa-exchange",
            "perf": 3,
            "perfReason": "",
            "integ": 2,
            "integReason": "",
            "size": 4,
            "sizeReason": "",
            "roi": 3,
            "roiReason": "",
            "ux": 3,
            "uxReason": ""
        }, {
            "group": "04) Overlapping Deals",
            "title": "App Maps",
            "desc": "Automatically Grouped based on Rules",
            "class": "fa fa-exchange",
            "perf": 5,
            "perfReason": "",
            "integ": 5,
            "integReason": "",
            "size": 3,
            "sizeReason": "",
            "roi": 5,
            "roiReason": "",
            "ux": 5,
            "uxReason": ""
        }, {
            "group": "05) Meet Comp Test",
            "title": "All offline",
            "desc": "Calculated and stored offline",
            "class": "fa fa-laptop",
            "perf": 2,
            "perfReason": "",
            "integ": 2,
            "integReason": "",
            "size": 4,
            "sizeReason": "",
            "roi": 3,
            "roiReason": "",
            "ux": 2,
            "uxReason": ""
        }, {
            "group": "05) Meet Comp Test",
            "title": "Calc offline and App Stored",
            "desc": "Calculated offline but stored with deal in app",
            "class": "fa fa-laptop",
            "perf": 2,
            "perfReason": "",
            "integ": 2,
            "integReason": "",
            "size": 4,
            "sizeReason": "",
            "roi": 4,
            "roiReason": "",
            "ux": 2,
            "uxReason": ""
        }, {
            "group": "05) Meet Comp Test",
            "title": "All in App",
            "desc": "Calculated and stored in app",
            "class": "fa fa-laptop",
            "perf": 4,
            "perfReason": "",
            "integ": 4,
            "integReason": "",
            "size": 3,
            "sizeReason": "",
            "roi": 5,
            "roiReason": "",
            "ux": 4,
            "uxReason": ""
        }, {
            "group": "06) Pricing Cost Test",
            "title": "All offline",
            "desc": "Calculated and stored offline",
            "class": "fa fa-usd",
            "perf": 2,
            "perfReason": "",
            "integ": 2,
            "integReason": "",
            "size": 4,
            "sizeReason": "",
            "roi": 3,
            "roiReason": "",
            "ux": 2,
            "uxReason": ""
        }, {
            "group": "06) Pricing Cost Test",
            "title": "Calc offline and App Stored",
            "desc": "Calculated offline but stored with deal in app",
            "class": "fa fa-usd",
            "perf": 2,
            "perfReason": "",
            "integ": 2,
            "integReason": "",
            "size": 4,
            "sizeReason": "",
            "roi": 4,
            "roiReason": "",
            "ux": 2,
            "uxReason": ""
        }, {
            "group": "06) Pricing Cost Test",
            "title": "All in App",
            "desc": "Calculated and stored in app",
            "class": "fa fa-usd",
            "perf": 5,
            "perfReason": "",
            "integ": 4,
            "integReason": "",
            "size": 3,
            "sizeReason": "",
            "roi": 5,
            "roiReason": "",
            "ux": 4,
            "uxReason": ""
        }, {
            "group": "07) Term and Conditions",
            "title": "Manually",
            "desc": "Manually managed",
            "class": "fa fa-legal",
            "perf": 2,
            "perfReason": "",
            "integ": 2,
            "integReason": "",
            "size": 4,
            "sizeReason": "",
            "roi": 2,
            "roiReason": "",
            "ux": 2,
            "uxReason": ""
        }, {
            "group": "07) Term and Conditions",
            "title": "Pre-Approved In App",
            "desc": "Module to manage Legal Pre-Approved T&Cs",
            "class": "fa fa-legal",
            "perf": 4,
            "perfReason": "",
            "integ": 3,
            "integReason": "",
            "size": 3,
            "sizeReason": "",
            "roi": 3,
            "roiReason": "",
            "ux": 4,
            "uxReason": ""
        }, {
            "group": "08) Contract",
            "title": "Manual",
            "desc": "Manual creation",
            "class": "fa fa-certificate",
            "perf": 2,
            "perfReason": "",
            "integ": 2,
            "integReason": "",
            "size": 4,
            "sizeReason": "",
            "roi": 2,
            "roiReason": "",
            "ux": 2,
            "uxReason": ""
        }, {
            "group": "08) Contract",
            "title": "Cut-N-Paste",
            "desc": "Cut-N-Paste",
            "class": "fa fa-certificate",
            "perf": 3,
            "perfReason": "",
            "integ": 4,
            "integReason": "",
            "size": 3,
            "sizeReason": "",
            "roi": 3,
            "roiReason": "",
            "ux": 4,
            "uxReason": ""
        }, {
            "group": "09) Deal Validation",
            "title": "None",
            "desc": "No Validation (Let business process control)",
            "class": "fa fa-check-square-o",
            "perf": 4,
            "perfReason": "",
            "integ": 1,
            "integReason": "",
            "size": 5,
            "sizeReason": "",
            "roi": 1,
            "roiReason": "",
            "ux": 5,
            "uxReason": ""
        }, {
            "group": "09) Deal Validation",
            "title": "In App",
            "desc": "In App (Defined business rules)",
            "class": "fa fa-check-square-o",
            "perf": 3,
            "perfReason": "",
            "integ": 4,
            "integReason": "",
            "size": 3,
            "sizeReason": "",
            "roi": 5,
            "roiReason": "",
            "ux": 3,
            "uxReason": ""
        }, {
            "group": "10) Deal Entry",
            "title": "Manual",
            "desc": "Manual (Hand entered from contract or Excel file)",
            "class": "fa fa-file",
            "perf": 2,
            "perfReason": "",
            "integ": 2,
            "integReason": "",
            "size": 4,
            "sizeReason": "",
            "roi": 1,
            "roiReason": "",
            "ux": 1,
            "uxReason": ""
        }, {
            "group": "10) Deal Entry",
            "title": "Auto-Created",
            "desc": "Auto-Created by App (Pricing Tables to Deals)",
            "class": "fa fa-file",
            "perf": 5,
            "perfReason": "",
            "integ": 5,
            "integReason": "",
            "size": 3,
            "sizeReason": "",
            "roi": 5,
            "roiReason": "",
            "ux": 5,
            "uxReason": ""
        }, {
            "group": "11) Contract Versions",
            "title": "Independent",
            "desc": "",
            "class": "fa fa-sort-numeric-asc",
            "perf": 2,
            "perfReason": "",
            "integ": 2,
            "integReason": "",
            "size": 5,
            "sizeReason": "",
            "roi": 2,
            "roiReason": "",
            "ux": 3,
            "uxReason": ""
        }, {
            "group": "11) Contract Versions",
            "title": "In App",
            "desc": "",
            "class": "fa fa-sort-numeric-asc",
            "perf": 3,
            "perfReason": "",
            "integ": 2,
            "integReason": "",
            "size": 4,
            "sizeReason": "",
            "roi": 2,
            "roiReason": "",
            "ux": 4,
            "uxReason": ""
        }, {
            "group": "12) Contract Approval",
            "title": "Independent",
            "desc": "Independent (not recorded)",
            "class": "fa fa-refresh",
            "perf": 2,
            "perfReason": "",
            "integ": 2,
            "integReason": "",
            "size": 5,
            "sizeReason": "",
            "roi": 2,
            "roiReason": "",
            "ux": 3,
            "uxReason": ""
        }, {
            "group": "12) Contract Approval",
            "title": "In App",
            "desc": "In App",
            "class": "fa fa-refresh",
            "perf": 4,
            "perfReason": "",
            "integ": 4,
            "integReason": "",
            "size": 4,
            "sizeReason": "",
            "roi": 3,
            "roiReason": "",
            "ux": 3,
            "uxReason": ""
        }, {
            "group": "13) Deal Approval",
            "title": "Independent",
            "desc": "Independent (not recorded)",
            "class": "fa fa-random",
            "perf": 2,
            "perfReason": "",
            "integ": 1,
            "integReason": "",
            "size": 5,
            "sizeReason": "",
            "roi": 2,
            "roiReason": "",
            "ux": 2,
            "uxReason": ""
        }, {
            "group": "13) Deal Approval",
            "title": "In App",
            "desc": "",
            "class": "fa fa-random",
            "perf": 5,
            "perfReason": "",
            "integ": 5,
            "integReason": "",
            "size": 4,
            "sizeReason": "",
            "roi": 4,
            "roiReason": "",
            "ux": 4,
            "uxReason": ""
        }, {
            "group": "14) Customer Acceptance (C2A)",
            "title": "Independent",
            "desc": "",
            "class": "fa fa-users",
            "perf": 2,
            "perfReason": "",
            "integ": 2,
            "integReason": "",
            "size": 5,
            "sizeReason": "",
            "roi": 2,
            "roiReason": "",
            "ux": 3,
            "uxReason": ""
        }, {
            "group": "14) Customer Acceptance (C2A)",
            "title": "In App",
            "desc": "",
            "class": "fa fa-users",
            "perf": 2,
            "perfReason": "",
            "integ": 2,
            "integReason": "",
            "size": 4,
            "sizeReason": "",
            "roi": 3,
            "roiReason": "",
            "ux": 4,
            "uxReason": ""
        }
    ];

    loadSelected(dataItem){
        
    }

    calcIcons(perf:any){
        let icons = "";
        for(let i = 0; i < perf; i++){
            icons += 'X ';
        }
        return icons;
    }

    ngOnInit(): void {
        this.list_breadcrumbs = [
            { text: "Coding practices", url: "Home" },
            { text: "MyDeals scope decision", url: "Flows", bool: 'scopeDecision' },
            { text: "Introduction", url: "javascript:void(0)", bool: 'scopeDecision' }
        ];

        this.left_nav = [
            { text: "Introduction", url:'#scopeDecision', bool: "scopeDecision" },
        ];
    }
    Toggle() {
        this.isVisible = !this.isVisible
    }

}