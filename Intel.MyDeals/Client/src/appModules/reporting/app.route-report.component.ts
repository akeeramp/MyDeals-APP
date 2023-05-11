import { Routes } from "@angular/router";
import { ReportingComponent } from "../../app/reporting/reporting.component";

//added for security check
import { SecurityResolver } from "../../app/shared/security.resolve";

export const routesReport: Routes = [
    { path: 'reportingdashboard', component: ReportingComponent, data: { title: 'Reporting', BaseHref: 'Reporting' }, resolve: { security: SecurityResolver } },

];