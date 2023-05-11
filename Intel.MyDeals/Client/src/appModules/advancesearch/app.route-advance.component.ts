import { Routes } from "@angular/router";

 
 //search routes
 import { AdvancedSearchComponent } from "../../app/advanceSearch/advancedSearch.component";
 import { goToComponent } from "../../app/contract/goTo.component";
 import { TenderDashboardComponent } from "../../app/advanceSearch/tenderDashboard/tenderDashboard.component";

//added for security check
import { SecurityResolver } from "../../app/shared/security.resolve";

export const routesAdvance: Routes = [
    //search routes
    { path: 'gotoPs/:cid', component: goToComponent, data: { title: 'AdvancedSearch', BaseHref: 'AdvancedSearch' }, resolve: { security: SecurityResolver } },
    { path: 'gotoDeal/:cid', component: goToComponent, data: { title: 'AdvancedSearch', BaseHref: 'AdvancedSearch' }, resolve: { security: SecurityResolver } },
    { path: 'advanceSearch', component: AdvancedSearchComponent, data: { title: 'AdvancedSearch', BaseHref: 'AdvancedSearch' }, resolve: { security: SecurityResolver } },
    { path: 'tenderDashboard', component: TenderDashboardComponent, data: { title: 'Tender Dashboard', BaseHref: 'AdvancedSearch' }, resolve: { security: SecurityResolver } },
];