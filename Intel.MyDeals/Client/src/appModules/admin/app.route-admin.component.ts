import { Routes } from "@angular/router";
import { authGuard } from "./../../app/shared/util/guardProtection";
import { PendingChangesGuard } from "./../../app/shared/util/gaurdprotectionDeactivate";
 //admins routes
import { batchTimingComponent } from "../../app/admin/batchTiming/admin.batchTiming.component";
import { batchJobConstantsComponent } from "../../app/admin/batchJobConstants/admin.batchJobConstants.component";
import { BulkPricingUpdatesComponent } from "../../app/admin/bulkPricingUpdates/admin.bulkPricingUpdates.component";
import { AdminCacheComponent } from "../../app/admin/cache/admin.cache.component";
import { ConstantsComponent } from "../../app/admin/constants/admin.constants.component";
import { LogArchivalComponent } from "../../app/admin/logArchival/admin.logArchival.component";
import { adminConsumptionCountryComponent } from "../../app/admin/consumptionCountry/admin.consumptionCountry.component";
import { adminCustomerComponent } from "../../app/admin/customer/admin.customer.component";
import { adminCustomerVendorsComponent } from "../../app/admin/CustomerVendors/admin.customerVendors.component";
import { adminDataFixComponent } from "../../app/admin/dataFix/admin.dataFix.component";
import { admindataQualityComponent } from "../../app/admin/dataQuality/admin.dataQuality.component";
import { DealMassUpdateComponent } from "../../app/admin/dealMassUpdate/admin.dealMassUpdate.component";
import { adminDealTypesComponent } from "../../app/admin/dealTypes/admin.dealTypes.component";
import { AdminDropdownsComponent } from "../../app/admin/dropdowns/admin.dropdowns.component";
import { EmployeeComponent } from "../../app/admin/employee/admin.employee.component";
import { manageEmployeeComponent } from "../../app/admin/employee/admin.manageEmployee.component";
import { adminFunFactComponent } from "../../app/admin/funFact/admin.funFact.component";
import { geoComponent } from "../../app/admin/geo/admin.geo.component";
import { iCostProductsComponent } from "../../app/admin/iCostProducts/admin.iCostProducts.component";
import { adminlegalExceptionComponent } from "../../app/admin/legalException/admin.legalException.component";
import { MeetCompComponent } from "../../app/admin/meetComp/admin.meetComp.component";
import { adminNotificationsComponent } from "../../app/admin/notifications/admin.notifications.component";
import { OpLogComponent } from "../../app/admin/oplog/admin.oplog.component";
import { adminPrimeCustomersComponent } from "../../app/admin/PrimeCustomers/admin.primeCustomers.component";
import { adminProductAliasComponent } from "../../app/admin/productAlias/admin.productAlias.component";
import { adminProductCategoriesComponent } from "../../app/admin/productCategories/admin.productCategories.component";
import { adminProductsComponent } from "../../app/admin/products/admin.products.component";
import { adminPushDealsToVistexComponent } from "../../app/admin/pushDealstoVistex/admin.pushDealstoVistex.component";
import { QuoteLetterComponent } from "../../app/admin/quoteLetter/admin.quoteLetter.component";
import { RuleOwnerComponent } from "../../app/admin/ruleOwner/admin.RuleOwner.component";
import { adminRulesComponent } from "../../app/admin/rules/admin.rules.component";
import { adminsecurityEngineComponent } from "../../app/admin/securityEngine/admin.securityEngine.component";
import { adminsupportScriptComponent } from "../../app/admin/supportScript/admin.supportScript.component";
import { adminTestTendersComponent } from "../../app/admin/testTenders/admin.testTenders.component";
import { adminUnifiedDealReconComponent } from "../../app/admin/unifiedDealRecon/admin.UnifiedDealRecon.component";
import { ValidateVistexR3ChecksComponent } from "../../app/admin/validateVistexR3Checks/admin.validateVistexR3Checks.component";
import { adminVistexComponent } from "../../app/admin/vistex/admin.vistex.component";
import { adminVistexIntegrationLogComponent } from "../../app/admin/vistex/admin.vistexIntegrationLog.component";
import { adminVistexCustomerMappingComponent } from "../../app/admin/vistexCustomerMapping/admin.vistexCustomerMapping.component";
import { adminWorkFlowComponent } from "../../app/admin/workFlow/admin.workFlow.component";
import { adminWorkflowStagesComponent } from "../../app/admin/workflowStages/admin.workflowStages.component";
import { adminMydealsSupportComponent } from '../../app/admin/mydealssupport/admin.mydealssupport.component';
import { adminVistexProfiseeApiComponent } from '../../app/admin/vistex/admin.vistexProfiseeAPI.component';
import { AsyncProcedureJobsComponent } from "../../app/admin/asyncProcedureJobs/admin.asyncProcedureJobs.component";
import { SdsDealOverridesComponent } from "../../app/admin/sdsDealOverrides/admin.sdsDealOverrides.component";
import { dbAuditToolsComponent } from "../../app/admin/dbAuditTools/admin.dbAuditTools.component";
import { QuoteLetterRegenerationComponent } from "../../app/admin/quoteLetter/admin.quoteLetterRegeneration.component";
import { ExpireYcs2Component } from "../../app/admin/expireYcs2/admin.expireYcs2.component";
import { DealUnificationReportComponent } from "../../app/admin/dealUnificationReport/dealUnificationReport.component";

import { EnvironmentsComponent } from "../../app/admin/environmentDetails/admin.environments.component";

import { userRolePermissionComponent } from "../../app/admin/userRolePermission/admin.userRolePermission.component";
import { PctExceptionReportComponent } from "../../app/admin/pctExceptionReport/admin.pctExceptionReport.component";
//added for security check
import { SecurityResolver } from "../../app/shared/security.resolve";

export const routesAdmin: Routes = [
    //Admin routes
    { path: 'adminemployeedashboard', component: EmployeeComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard], canDeactivate: [PendingChangesGuard] },
    { path: 'admincache', component: AdminCacheComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'customers', component: adminCustomerComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'CustomerVendors', component: adminCustomerVendorsComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard], canDeactivate: [PendingChangesGuard] },
    { path: 'opLog', component: OpLogComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'batchTiming', component: batchTimingComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'batchJobConstants', component: batchJobConstantsComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'VistexCustomerMapping', component: adminVistexCustomerMappingComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] ,canDeactivate:[PendingChangesGuard]},
    { path: 'UnifiedCustomerAdmin', component: adminPrimeCustomersComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard],canDeactivate:[PendingChangesGuard] },
    { path: 'UnifiedDealRecon', component: adminUnifiedDealReconComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] ,canDeactivate:[PendingChangesGuard]},
    { path: 'adminGeo', component: geoComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'productCategories', component: adminProductCategoriesComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] ,canDeactivate:[PendingChangesGuard]},
    { path: 'constants', component: ConstantsComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] ,canDeactivate:[PendingChangesGuard]},
    { path: 'logArchival', component: LogArchivalComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] ,canDeactivate:[PendingChangesGuard]},
    { path: 'productAlias', component: adminProductAliasComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] ,canDeactivate:[PendingChangesGuard]},
    { path: 'products', component: adminProductsComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard]},
    { path: 'funfact', component: adminFunFactComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] ,canDeactivate:[PendingChangesGuard] },
    { path: 'securityengine', component: adminsecurityEngineComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard],canDeactivate:[PendingChangesGuard] },
    { path: 'dealTypes', component: adminDealTypesComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'dataquality', component: admindataQualityComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'quoteLetter', component: QuoteLetterComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard],canDeactivate:[PendingChangesGuard] },
    { path: 'ruleOwner', component: RuleOwnerComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] ,canDeactivate:[PendingChangesGuard]},
    { path: 'workflowStages', component: adminWorkflowStagesComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard],canDeactivate:[PendingChangesGuard] },
    { path: 'workFlow', component: adminWorkFlowComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] ,canDeactivate:[PendingChangesGuard]},
    { path: 'dropdowns', component: AdminDropdownsComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] ,canDeactivate:[PendingChangesGuard]},
    { path: 'consumptionCountry', component: adminConsumptionCountryComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] ,canDeactivate:[PendingChangesGuard]},
    { path: 'pushDealstoVistex', component: adminPushDealsToVistexComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] ,canDeactivate:[PendingChangesGuard]},
    { path: 'vistexTestApi', component: adminVistexComponent, data: { title: 'Dashboard', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] ,canDeactivate:[PendingChangesGuard]},
    { path: 'icostproducts', component: iCostProductsComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] ,canDeactivate:[PendingChangesGuard]},
    { path: 'notifications', component: adminNotificationsComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'dealmassupdate', component: DealMassUpdateComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] ,canDeactivate:[PendingChangesGuard]},
    { path: 'validateVistexR3Checks', component: ValidateVistexR3ChecksComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] ,canDeactivate:[PendingChangesGuard]},
    { path: 'manageEmployee', component: manageEmployeeComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'rules/:rid', component: adminRulesComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'rules', component: adminRulesComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'dataFix', component: adminDataFixComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'vistex', component: adminVistexIntegrationLogComponent, data: { title: 'Dashboard', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard],canDeactivate:[PendingChangesGuard] },
    { path: 'meetComp', component: MeetCompComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'testTenders', component: adminTestTendersComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] ,canDeactivate:[PendingChangesGuard]},
    { path: 'supportScript', component: adminsupportScriptComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] ,canDeactivate:[PendingChangesGuard]},
    { path: 'legalException', component: adminlegalExceptionComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard], canDeactivate:[PendingChangesGuard]},
    { path: 'bulkPricingUpdate', component: BulkPricingUpdatesComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] ,canDeactivate:[PendingChangesGuard]},
    { path: 'MyDealsSupport', component: adminMydealsSupportComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'vistexProfiseeApi', component: adminVistexProfiseeApiComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'asyncProcedureJobs', component: AsyncProcedureJobsComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'sdsDealOverrides', component: SdsDealOverridesComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'dbAuditTools', component: dbAuditToolsComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'quoteLetterRegeneration', component: QuoteLetterRegenerationComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard]},
    { path: 'expireYcs2', component: ExpireYcs2Component, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard]},
    { path: 'DealUnificationReport', component: DealUnificationReportComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'environments', component: EnvironmentsComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard], canDeactivate: [PendingChangesGuard] },

    { path: 'DealUnificationReport', component: DealUnificationReportComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'userRolePermission', component: userRolePermissionComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'pctExceptionReport', component: PctExceptionReportComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] }
];