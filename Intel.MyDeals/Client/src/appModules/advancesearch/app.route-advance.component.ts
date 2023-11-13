import { Routes } from "@angular/router";
import { authGuard } from "./../../app/shared/util/guardProtection";
 
 //search routes
 import { AdvancedSearchComponent } from "../../app/advanceSearch/advancedSearch.component";
 import { goToComponent } from "../../app/contract/goTo.component";
 import { TenderDashboardComponent } from "../../app/advanceSearch/tenderDashboard/tenderDashboard.component";

//added for security check
import { SecurityResolver } from "../../app/shared/security.resolve";
import { PendingChangesGuard } from "../../app/shared/util/gaurdprotectionDeactivate";

export const routesAdvance: Routes = [
    //search routes
    { path: 'gotoPs/:cid', component: goToComponent, data: { title: 'AdvancedSearch', BaseHref: 'AdvancedSearch' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'gotoDeal/:cid', component: goToComponent, data: { title: 'AdvancedSearch', BaseHref: 'AdvancedSearch' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'advanceSearch', component: AdvancedSearchComponent, data: { title: 'AdvancedSearch', BaseHref: 'AdvancedSearch' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] ,canDeactivate:[PendingChangesGuard]},
    { path: 'tenderDashboard', component: TenderDashboardComponent, data: { title: 'Tender Dashboard', BaseHref: 'AdvancedSearch' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] ,canDeactivate:[PendingChangesGuard]},
];