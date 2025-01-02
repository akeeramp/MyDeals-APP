import { Routes } from "@angular/router";
import { DashboardComponent } from "../../app/dashboard/dashboard/dashboard.component";
import { jobMonitorComponent } from "../../app/dashboard/jobMonitor/jobMonitor.component";
import { jobMonitorDetailsComponent } from "../../app/dashboard/jobMonitorDetails/jobMonitorDetails.component";
//added for security check
import { SecurityResolver } from "../../app/shared/security.resolve";
import { authGuard } from "../../app/shared/util/guardProtection";

export const routesDashboard: Routes = [
    //Dashboard routes
    { path: 'portal', component: DashboardComponent, data: { title: 'Dashboard', BaseHref: 'Dashboard' }, resolve: { security: SecurityResolver } },
    { path: 'jobmonitor', component: jobMonitorComponent, data: { title: 'JobMonitor', BaseHref: 'Dashboard' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'jobmonitordetails/:jobName', component: jobMonitorDetailsComponent, data: { title: 'JobMonitor', BaseHref: 'Dashboard' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: '', redirectTo: '/portal', pathMatch: 'full', data: { title: 'Dashboard', BaseHref: 'Dashboard' }, resolve: { security: SecurityResolver } },
];