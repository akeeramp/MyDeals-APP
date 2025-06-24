import { Routes } from "@angular/router";
import { ReportingComponent } from "../../app/reporting/reporting.component";
import { authGuard } from "./../../app/shared/util/guardProtection";

//added for security check
import { SecurityResolver } from "../../app/shared/security.resolve";
import { ProductDetailsReportComponent } from "../../app/reporting/productDetailsReport/productDetailsReport.component";

export const routesReport: Routes = [
    { path: 'reportingdashboard', component: ReportingComponent, data: { title: 'Reporting', BaseHref: 'Reporting' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'productdetailsreport', component: ProductDetailsReportComponent, data: { title: 'ProductDetails', BaseHref: 'Reporting' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
];