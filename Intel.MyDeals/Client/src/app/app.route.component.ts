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


export const routes: Routes = [
    { path: '', redirectTo: '/portal', pathMatch: 'full' },
    { path: 'reportingdashboard', component: ReportingComponent },
    { path: 'tenderDashboard', component: TenderDashboardComponent },
    { path: 'advanceSearch', component: AdvancedSearchComponent },
    { path: 'mydashboard', component: DashboardComponent, resolve: { security: SecurityResolver } },
    { path: 'portal', component: DashboardComponent, resolve: { security: SecurityResolver } },
    { path: 'adminemployeedashboard', component: EmployeeComponent, resolve: { security: SecurityResolver } },
    { path: 'admincache', component: CacheComponent },
    { path: 'customers', component: adminCustomerComponent },
    { path: 'CustomerVendors', component: adminCustomerVendorsComponent },
    { path: 'opLog', component: OpLogComponent },
    { path: 'batchTiming', component: batchTimingComponent },
    { path: 'VistexCustomerMapping', component: adminVistexCustomerMappingComponent },
    { path: 'UnifiedCustomerAdmin', component: adminPrimeCustomersComponent },
    { path: 'UnifiedDealRecon', component: adminUnifiedDealReconComponent },
    { path: 'adminGeo', component: geoComponent },
    { path: 'productCategories', component: adminProductCategoriesComponent },
    { path: 'constants', component: ConstantsComponent },
    { path: 'productAlias', component: adminProductAliasComponent },
    { path: 'products', component: adminProductsComponent },
    { path: 'funfact', component: adminFunFactComponent },
    { path: 'securityengine', component: adminsecurityEngineComponent },
    { path: 'dealTypes', component: adminDealTypesComponent },
    { path: 'dataquality', component: admindataQualityComponent },
    { path: 'quoteLetter', component: QuoteLetterComponent },
    { path: 'ruleOwner', component: RuleOwnerComponent },
    { path: 'workflowStages', component: adminWorkflowStagesComponent },
    { path: 'workFlow', component: adminWorkFlowComponent },
    { path: 'dropdowns', component: dropdownsComponent },
    { path: 'consumptionCountry', component: adminConsumptionCountryComponent },
    { path: 'pushDealstoVistex', component: adminPushDealsToVistexComponent },
    { path: 'vistexTestApi', component: adminVistexComponent },
    { path: 'icostproducts', component: iCostProductsComponent },
    { path: 'notifications', component: adminNotificationsComponent },
    { path: 'dealmassupdate', component: dealMassUpdateComponent },
    { path: 'validateVistexR3Checks', component: ValidateVistexR3ChecksComponent },
    { path: 'manageEmployee', component: manageEmployeeComponent },
    { path: 'rules/:rid', component: adminRulesComponent },
    { path: 'rules', component: adminRulesComponent },
    { path: 'dataFix', component: adminDataFixComponent },
    { path: 'vistex', component: adminVistexIntegrationLogComponent },
    { path: 'meetComp', component: meetCompComponent },
    { path: 'testTenders', component: adminTestTendersComponent },
    { path: 'supportScript', component: adminsupportScriptComponent },
    { path: 'legalException', component: adminlegalExceptionComponent },
    { path: 'bulkPricingUpdate', component: BulkPricingUpdatesComponent },
    { path: 'gotoPs/:cid', component: goToComponent, resolve: { security: SecurityResolver }  },
    { path: 'gotoDeal/:cid', component: goToComponent, resolve: { security: SecurityResolver }  },
    { path: 'contractdetails/:cid', component: contractDetailsComponent },
    { path: 'contractdetails/copycid/:', component: contractDetailsComponent },
    { path: 'manager/:cid', component: globalRouteComponent, resolve: { security: SecurityResolver } },
    { path: 'manager/:type/:cid/:PSID/:PTID/:DealID', component: globalRouteComponent, resolve: { security: SecurityResolver } },
    { path: 'contractmanager/:type/:cid/:PSID/:PTID/:DealID', component: pricingTableComponent },
    { path:'tendermanager/:cid',component:tenderManagerComponent}

];