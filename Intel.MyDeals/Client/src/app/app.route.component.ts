import { Routes } from "@angular/router";
import { batchTimingComponent } from "./admin/batchTiming/admin.batchTiming.component";
import { BulkPricingUpdatesComponent } from "./admin/bulkPricingUpdates/admin.bulkPricingUpdates.component";
import { CacheComponent } from "./admin/cache/admin.cache.component";
import { ConstantsComponent } from "./admin/constants/admin.constants.component";
import { adminConsumptionCountryComponent } from "./admin/consumptionCountry/admin.consumptionCountry.component";
import { adminCustomerComponent } from "./admin/customer/admin.customer.component";
import { adminCustomerVendorsComponent } from "./admin/CustomerVendors/admin.customerVendors.component";
import { adminDataFixComponent } from "./admin/dataFix/admin.dataFix.component";
import { admindataQualityComponent } from "./admin/dataQuality/admin.dataQuality.component";
import { dealMassUpdateComponent } from "./admin/dealMassUpdate/admin.dealMassUpdate.component";
import { adminDealTypesComponent } from "./admin/dealTypes/admin.dealTypes.component";
import { dropdownsComponent } from "./admin/dropdowns/admin.dropdowns.component";
import { EmployeeComponent } from "./admin/employee/admin.employee.component";
import { manageEmployeeComponent } from "./admin/employee/admin.manageEmployee.component";
import { adminFunFactComponent } from "./admin/funFact/admin.funFact.component";
import { geoComponent } from "./admin/geo/admin.geo.component";
import { iCostProductsComponent } from "./admin/iCostProducts/admin.iCostProducts.component";
import { adminlegalExceptionComponent } from "./admin/legalException/admin.legalException.component";
import { meetCompComponent } from "./admin/meetComp/admin.meetComp.component";
import { adminNotificationsComponent } from "./admin/notifications/admin.notifications.component";
import { OpLogComponent } from "./admin/oplog/admin.oplog.component";
import { adminPrimeCustomersComponent } from "./admin/PrimeCustomers/admin.primeCustomers.component";
import { adminProductAliasComponent } from "./admin/productAlias/admin.productAlias.component";
import { adminProductCategoriesComponent } from "./admin/productCategories/admin.productCategories.component";
import { adminProductsComponent } from "./admin/products/admin.products.component";
import { adminPushDealsToVistexComponent } from "./admin/pushDealstoVistex/admin.pushDealstoVistex.component";
import { QuoteLetterComponent } from "./admin/quoteLetter/admin.quoteLetter.component";
import { RuleOwnerComponent } from "./admin/ruleOwner/admin.RuleOwner.component";
import { adminRulesComponent } from "./admin/rules/admin.rules.component";
import { adminsecurityEngineComponent } from "./admin/securityEngine/admin.securityEngine.component";
import { adminsupportScriptComponent } from "./admin/supportScript/admin.supportScript.component";
import { adminTestTendersComponent } from "./admin/testTenders/admin.testTenders.component";
import { adminUnifiedDealReconComponent } from "./admin/unifiedDealRecon/admin.UnifiedDealRecon.component";
import { ValidateVistexR3ChecksComponent } from "./admin/validateVistexR3Checks/admin.validateVistexR3Checks.component";
import { adminVistexComponent } from "./admin/vistex/admin.vistex.component";
import { adminVistexIntegrationLogComponent } from "./admin/vistex/admin.vistexIntegrationLog.component";
import { adminVistexCustomerMappingComponent } from "./admin/vistexCustomerMapping/admin.vistexCustomerMapping.component";
import { adminWorkFlowComponent } from "./admin/workFlow/admin.workFlow.component";
import { adminWorkflowStagesComponent } from "./admin/workflowStages/admin.workflowStages.component";
import { AdvancedSearchComponent } from "./advanceSearch/advancedSearch.component";
import { goToComponent } from "./advanceSearch/goTo.component";
import { TenderDashboardComponent } from "./advanceSearch/tenderDashboard/tenderDashboard.component";
import { contractDetailsComponent } from "./contract/contractDetails/contractDetails.component";
import { pricingTableComponent } from "./contract/pricingTable/pricingTable.component";
import { tenderManagerComponent } from "./contract/tenderManager/tenderManager.component";
import { DashboardComponent } from "./dashboard/dashboard/dashboard.component";
import { ReportingComponent } from "./reporting/reporting.component";
import { globalRouteComponent } from "./shared/globalroute/globalroute.component";
import { SecurityResolver } from "./shared/security.resolve";
import { adminMydealsSupportComponent } from './admin/mydealssupport/admin.mydealssupport.component';
export const routes: Routes = [
    { path: '', redirectTo: '/portal', pathMatch: 'full', data: { title: 'Dashboard' } },
    { path: 'reportingdashboard', component: ReportingComponent , data: { title: 'Reporting' } },
    { path: 'tenderDashboard', component: TenderDashboardComponent, data: { title: 'Tender Dashboard' } },
    { path: 'advanceSearch', component: AdvancedSearchComponent, data: { title: 'AdvancedSearch' } },
    { path: 'mydashboard', component: DashboardComponent, resolve: { security: SecurityResolver }, data: { title: 'Dashboard' } },
    { path: 'portal', component: DashboardComponent, resolve: { security: SecurityResolver }, data: { title: 'Dashboard' } },
    { path: 'adminemployeedashboard', component: EmployeeComponent, resolve: { security: SecurityResolver }, data: { title: 'Admin' } },
    { path: 'admincache', component: CacheComponent, data: { title: 'Admin' } },
    { path: 'customers', component: adminCustomerComponent, data: { title: 'Admin' } },
    { path: 'CustomerVendors', component: adminCustomerVendorsComponent, data: { title: 'Admin' } },
    { path: 'opLog', component: OpLogComponent, data: { title: 'Admin' } },
    { path: 'batchTiming', component: batchTimingComponent, data: { title: 'Admin' } },
    { path: 'VistexCustomerMapping', component: adminVistexCustomerMappingComponent, data: { title: 'Admin' } },
    { path: 'UnifiedCustomerAdmin', component: adminPrimeCustomersComponent, data: { title: 'Admin' } },
    { path: 'UnifiedDealRecon', component: adminUnifiedDealReconComponent, data: { title: 'Admin' } },
    { path: 'adminGeo', component: geoComponent, data: { title: 'Admin' } },
    { path: 'productCategories', component: adminProductCategoriesComponent, data: { title: 'Admin' } },
    { path: 'constants', component: ConstantsComponent, data: { title: 'Admin' } },
    { path: 'productAlias', component: adminProductAliasComponent, data: { title: 'Admin' } },
    { path: 'products', component: adminProductsComponent, data: { title: 'Admin' } },
    { path: 'funfact', component: adminFunFactComponent, data: { title: 'Admin' } },
    { path: 'securityengine', component: adminsecurityEngineComponent, data: { title: 'Admin' } },
    { path: 'dealTypes', component: adminDealTypesComponent, data: { title: 'Admin' } },
    { path: 'dataquality', component: admindataQualityComponent, data: { title: 'Admin' } },
    { path: 'quoteLetter', component: QuoteLetterComponent, data: { title: 'Admin' } },
    { path: 'ruleOwner', component: RuleOwnerComponent, data: { title: 'Admin' } },
    { path: 'workflowStages', component: adminWorkflowStagesComponent, data: { title: 'Admin' } },
    { path: 'workFlow', component: adminWorkFlowComponent, data: { title: 'Admin' } },
    { path: 'dropdowns', component: dropdownsComponent, data: { title: 'Admin' } },
    { path: 'consumptionCountry', component: adminConsumptionCountryComponent, data: { title: 'Admin' } },
    { path: 'pushDealstoVistex', component: adminPushDealsToVistexComponent, data: { title: 'Admin' } },
    { path: 'vistexTestApi', component: adminVistexComponent, data: { title: 'Dashboard' } },
    { path: 'icostproducts', component: iCostProductsComponent, data: { title: 'Admin' } },
    { path: 'notifications', component: adminNotificationsComponent, data: { title: 'Admin' } },
    { path: 'dealmassupdate', component: dealMassUpdateComponent, data: { title: 'Admin' } },
    { path: 'validateVistexR3Checks', component: ValidateVistexR3ChecksComponent, data: { title: 'Admin' } },
    { path: 'manageEmployee', component: manageEmployeeComponent, data: { title: 'Admin' } },
    { path: 'rules/:rid', component: adminRulesComponent, data: { title: 'Admin' } },
    { path: 'rules', component: adminRulesComponent, data: { title: 'Admin' } },
    { path: 'dataFix', component: adminDataFixComponent, data: { title: 'Admin' } },
    { path: 'vistex', component: adminVistexIntegrationLogComponent, data: { title: 'Dashboard' } },
    { path: 'meetComp', component: meetCompComponent, data: { title: 'Admin' } },
    { path: 'testTenders', component: adminTestTendersComponent, data: { title: 'Admin' } },
    { path: 'supportScript', component: adminsupportScriptComponent, data: { title: 'Admin' } },
    { path: 'legalException', component: adminlegalExceptionComponent, data: { title: 'Admin' } },
    { path: 'bulkPricingUpdate', component: BulkPricingUpdatesComponent, data: { title: 'Admin' } },
    { path: 'gotoPs/:cid', component: goToComponent, resolve: { security: SecurityResolver }, data: { title: 'Admin' } },
    { path: 'gotoDeal/:cid', component: goToComponent, resolve: { security: SecurityResolver }, data: { title: 'Admin' } },
    { path: 'contractdetails/:cid', component: contractDetailsComponent, data: { title: 'Dashboard' } },
    { path: 'contractdetails/copycid/:', component: contractDetailsComponent, data: { title: 'Dashboard' } },
    { path: 'manager/:cid', component: globalRouteComponent, resolve: { security: SecurityResolver }, data: { title: 'Admin' } },
    { path: 'manager/:type/:cid/:PSID/:PTID/:DealID', component: globalRouteComponent, resolve: { security: SecurityResolver }, data: { title: 'Admin' } },
    { path: 'contractmanager/:type/:cid/:PSID/:PTID/:DealID', component: pricingTableComponent, data: { title: 'Contract' } },
    { path: 'tendermanager/:cid', component: tenderManagerComponent, data: { title: 'Dashboard' } },
    { path: 'mydealsupport', component: adminMydealsSupportComponent, data: { title: 'Admin' } },
];