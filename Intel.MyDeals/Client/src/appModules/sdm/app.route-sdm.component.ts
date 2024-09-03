import { Routes } from "@angular/router";
//added for security check
import { SDMComponent } from "../../app/sdm/sdm.component";
import { SecurityResolver } from "../../app/shared/security.resolve";
import { authGuard } from "./../../app/shared/util/guardProtection";
import { sdmBulkUploadComponent } from "../../app/sdm/sdmBulkUpload/sdmBulkUpload.component";

export const routesSDM: Routes = [
    //Dashboard routes
    { path: 'RpdDashboard', component: SDMComponent, data: { title: 'Retail Pull Dollar', BaseHref: 'RPD' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'RpdBulkupload', component: sdmBulkUploadComponent, data: { title: 'Retail Pull Dollar - BulkUpload', BaseHref: 'RPD' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
];