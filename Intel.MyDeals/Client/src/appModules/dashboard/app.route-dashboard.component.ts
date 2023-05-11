import { Routes } from "@angular/router";
import { DashboardComponent } from "../../app/dashboard/dashboard/dashboard.component";
//added for security check
import { SecurityResolver } from "../../app/shared/security.resolve";

export const routesDashboard: Routes = [
    //Dashboard routes
    { path: 'portal', component: DashboardComponent, data: { title: 'Dashboard', BaseHref: 'Dashboard' }, resolve: { security: SecurityResolver } },
    { path: '', redirectTo: '/portal', pathMatch: 'full', data: { title: 'Dashboard', BaseHref: 'Dashboard' }, resolve: { security: SecurityResolver } },
];