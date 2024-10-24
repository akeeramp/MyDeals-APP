import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Router } from "@angular/router";

import { BreadCrumbItem } from '@progress/kendo-angular-navigation';

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: 'Client/src/app/codingPractices/shared/breadcrumbs/breadcrumbs.component.html',
    styleUrls: ['Client/src/app/codingPractices/shared/breadcrumbs/breadcrumbs.component.css'],
})
export class BreadcrumbsComponent implements  OnChanges  {

    @Input() list_breadcrumbs: any; 
    @Output() selectedBreadCrumb: EventEmitter<object> = new EventEmitter<object>();

    public items: BreadCrumbItem[];

    constructor(private router: Router) { }

    ngOnChanges(changes: SimpleChanges): void {
        this.items = this.list_breadcrumbs;
    }
    
    public onItemClick(item: BreadCrumbItem): void {
        if (item['url'].includes('#')) {
            this.selectedBreadCrumb.emit(item);
        } else {
            this.router.navigate([item['url']]);
        } 
      }

}