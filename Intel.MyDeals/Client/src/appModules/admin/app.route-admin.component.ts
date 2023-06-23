import { Routes } from "@angular/router";
import { authGuard } from "./../../app/shared/util/guardProtection";
 //admins routes
import { batchTimingComponent } from "../../app/admin/batchTiming/admin.batchTiming.component";
import { BulkPricingUpdatesComponent } from "../../app/admin/bulkPricingUpdates/admin.bulkPricingUpdates.component";
import { CacheComponent } from "../../app/admin/cache/admin.cache.component";
import { ConstantsComponent } from "../../app/admin/constants/admin.constants.component";
import { adminConsumptionCountryComponent } from "../../app/admin/consumptionCountry/admin.consumptionCountry.component";
import { adminCustomerComponent } from "../../app/admin/customer/admin.customer.component";
import { adminCustomerVendorsComponent } from "../../app/admin/CustomerVendors/admin.customerVendors.component";
import { adminDataFixComponent } from "../../app/admin/dataFix/admin.dataFix.component";
import { admindataQualityComponent } from "../../app/admin/dataQuality/admin.dataQuality.component";
import { dealMassUpdateComponent } from "../../app/admin/dealMassUpdate/admin.dealMassUpdate.component";
import { adminDealTypesComponent } from "../../app/admin/dealTypes/admin.dealTypes.component";
import { dropdownsComponent } from "../../app/admin/dropdowns/admin.dropdowns.component";
import { EmployeeComponent } from "../../app/admin/employee/admin.employee.component";
import { manageEmployeeComponent } from "../../app/admin/employee/admin.manageEmployee.component";
import { adminFunFactComponent } from "../../app/admin/funFact/admin.funFact.component";
import { geoComponent } from "../../app/admin/geo/admin.geo.component";
import { iCostProductsComponent } from "../../app/admin/iCostProducts/admin.iCostProducts.component";
import { adminlegalExceptionComponent } from "../../app/admin/legalException/admin.legalException.component";
import { meetCompComponent } from "../../app/admin/meetComp/admin.meetComp.component";
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


//added for security check
import { SecurityResolver } from "../../app/shared/security.resolve";

export const routesAdmin: Routes = [
    //Admin routes
    { path: 'adminemployeedashboard', component: EmployeeComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'admincache', component: CacheComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'customers', component: adminCustomerComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'CustomerVendors', component: adminCustomerVendorsComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'opLog', component: OpLogComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'batchTiming', component: batchTimingComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'VistexCustomerMapping', component: adminVistexCustomerMappingComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'UnifiedCustomerAdmin', component: adminPrimeCustomersComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'UnifiedDealRecon', component: adminUnifiedDealReconComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'adminGeo', component: geoComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'productCategories', component: adminProductCategoriesComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'constants', component: ConstantsComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'productAlias', component: adminProductAliasComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'products', component: adminProductsComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'funfact', component: adminFunFactComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'securityengine', component: adminsecurityEngineComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'dealTypes', component: adminDealTypesComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'dataquality', component: admindataQualityComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'quoteLetter', component: QuoteLetterComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'ruleOwner', component: RuleOwnerComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'workflowStages', component: adminWorkflowStagesComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'workFlow', component: adminWorkFlowComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'dropdowns', component: dropdownsComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'consumptionCountry', component: adminConsumptionCountryComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'pushDealstoVistex', component: adminPushDealsToVistexComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'vistexTestApi', component: adminVistexComponent, data: { title: 'Dashboard', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'icostproducts', component: iCostProductsComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'notifications', component: adminNotificationsComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'dealmassupdate', component: dealMassUpdateComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'validateVistexR3Checks', component: ValidateVistexR3ChecksComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'manageEmployee', component: manageEmployeeComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'rules/:rid', component: adminRulesComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'rules', component: adminRulesComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'dataFix', component: adminDataFixComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'vistex', component: adminVistexIntegrationLogComponent, data: { title: 'Dashboard', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'meetComp', component: meetCompComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'testTenders', component: adminTestTendersComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'supportScript', component: adminsupportScriptComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'legalException', component: adminlegalExceptionComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'bulkPricingUpdate', component: BulkPricingUpdatesComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'MyDealsSupport', component: adminMydealsSupportComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'vistexProfiseeApi', component: adminVistexProfiseeApiComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
];