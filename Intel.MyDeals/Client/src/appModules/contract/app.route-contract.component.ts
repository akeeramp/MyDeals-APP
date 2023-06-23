import { Routes } from "@angular/router";
import { contractDetailsComponent } from "../../app/contract/contractDetails/contractDetails.component";
import { pricingTableComponent } from "../../app/contract/pricingTable/pricingTable.component";
import { tenderManagerComponent } from "../../app/contract/tenderManager/tenderManager.component";
import { globalRouteComponent } from "../../app/shared/globalroute/globalroute.component";
import { goToComponent } from "../../app/contract/goTo.component";
import { authGuard } from "./../../app/shared/util/guardProtection";

//added for security check
import { SecurityResolver } from "../../app/shared/security.resolve";

export const routesContract: Routes = [
    { path: 'gotoPs/:cid', component: goToComponent, data: { title: 'Contract', BaseHref: 'Contract' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'gotoDeal/:cid', component: goToComponent, data: { title: 'Contract', BaseHref: 'Contract' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'contractdetails/:cid', component: contractDetailsComponent, data: { title: 'Contract', BaseHref: 'Contract' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'contractdetails/copycid/:cid', component: contractDetailsComponent, data: { title: 'Contract', BaseHref: 'Contract' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'manager/:cid', component: globalRouteComponent, data: { title: 'Contract', BaseHref: 'Contract' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'manager/:type/:cid/:PSID/:PTID/:DealID', component: globalRouteComponent, resolve: { security: SecurityResolver }, data: { title: 'Contract', BaseHref: 'Contract' }, canActivate: [authGuard] },
    { path: 'contractmanager/:type/:cid/:PSID/:PTID/:DealID', component: pricingTableComponent, data: { title: 'Contract', BaseHref: 'Contract' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'tendermanager/:cid', component: tenderManagerComponent, data: { title: 'Contract', BaseHref: 'Contract' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
];