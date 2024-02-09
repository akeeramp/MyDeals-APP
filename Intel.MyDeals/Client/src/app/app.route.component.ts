import { Routes } from "@angular/router";
import { batchTimingComponent } from "./admin/batchTiming/admin.batchTiming.component";
import { BulkPricingUpdatesComponent } from "./admin/bulkPricingUpdates/admin.bulkPricingUpdates.component";
import { AdminCacheComponent } from "./admin/cache/admin.cache.component";
import { ConstantsComponent } from "./admin/constants/admin.constants.component";
import { adminConsumptionCountryComponent } from "./admin/consumptionCountry/admin.consumptionCountry.component";
import { adminCustomerComponent } from "./admin/customer/admin.customer.component";
import { adminCustomerVendorsComponent } from "./admin/CustomerVendors/admin.customerVendors.component";
import { adminDataFixComponent } from "./admin/dataFix/admin.dataFix.component";
import { admindataQualityComponent } from "./admin/dataQuality/admin.dataQuality.component";
import { DealMassUpdateComponent } from "./admin/dealMassUpdate/admin.dealMassUpdate.component";
import { adminDealTypesComponent } from "./admin/dealTypes/admin.dealTypes.component";
import { AdminDropdownsComponent } from "./admin/dropdowns/admin.dropdowns.component";
import { EmployeeComponent } from "./admin/employee/admin.employee.component";
import { manageEmployeeComponent } from "./admin/employee/admin.manageEmployee.component";
import { adminFunFactComponent } from "./admin/funFact/admin.funFact.component";
import { geoComponent } from "./admin/geo/admin.geo.component";
import { iCostProductsComponent } from "./admin/iCostProducts/admin.iCostProducts.component";
import { adminlegalExceptionComponent } from "./admin/legalException/admin.legalException.component";
import { MeetCompComponent } from "./admin/meetComp/admin.meetComp.component";
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
import { goToComponent } from "./contract/goTo.component";
import { TenderDashboardComponent } from "./advanceSearch/tenderDashboard/tenderDashboard.component";
import { ContractDetailsComponent } from "./contract/contractDetails/contractDetails.component";
import { pricingTableComponent } from "./contract/pricingTable/pricingTable.component";
import { TenderManagerComponent } from "./contract/tenderManager/tenderManager.component";
import { DashboardComponent } from "./dashboard/dashboard/dashboard.component";
import { ReportingComponent } from "./reporting/reporting.component";
import { globalRouteComponent } from "./shared/globalroute/globalroute.component";
import { adminMydealsSupportComponent } from './admin/mydealssupport/admin.mydealssupport.component';
import { adminVistexProfiseeApiComponent } from './admin/vistex/admin.vistexProfiseeAPI.component';
import { AsyncProcedureJobsComponent } from "./admin/asyncProcedureJobs/admin.asyncProcedureJobs.component";
import { SdsDealOverridesComponent } from "./admin/sdsDealOverrides/admin.sdsDealOverrides.component";
import { dbAuditToolsComponent } from "./admin/dbAuditTools/admin.dbAuditTools.component";

//added for security check
import { SecurityResolver } from "./shared/security.resolve";
import { CodingPracticesComponent } from "./codingPractices/codingPractices.component";
import { BusinessProcessComponent } from "./codingPractices/businessProcess/businessProcess.component";
import { CicdPipelineComponent } from "./codingPractices/cicdPipeline/cicdPipeline.component";
import { CodeQualityComponent } from "./codingPractices/codeQuality/codeQuality.component";
import { CodingToolsComponent } from "./codingPractices/codingTools/codingTools.component";
import { ProjectFlowComponent } from "./codingPractices/projectFlow/projectFlow.component";
import { ScopeDecisionComponent } from "./codingPractices/scopeDecision/scopeDecision.component";
//added protection rule before leaving a page
import { PendingChangesGuard } from "./shared/util/gaurdprotectionDeactivate";


export const routes: Routes = [
    { path: '', redirectTo: '/portal', pathMatch: 'full', data: { title: 'Dashboard', BaseHref: 'Dashboard' }, resolve: { security: SecurityResolver } ,canDeactivate:[PendingChangesGuard]},
    { path: 'reportingdashboard', component: ReportingComponent, data: { title: 'Reporting', BaseHref: 'Reporting' }, resolve: { security: SecurityResolver } },
    { path: 'tenderDashboard', component: TenderDashboardComponent, data: { title: 'Tender Dashboard', BaseHref: 'AdvancedSearch' }, resolve: { security: SecurityResolver } ,canDeactivate:[PendingChangesGuard]},
    { path: 'advanceSearch', component: AdvancedSearchComponent, data: { title: 'AdvancedSearch', BaseHref: 'AdvancedSearch' }, resolve: { security: SecurityResolver } ,canDeactivate:[PendingChangesGuard]},
    { path: 'mydashboard', component: DashboardComponent, data: { title: 'Dashboard', BaseHref: 'Dashboard' }, resolve: { security: SecurityResolver },canDeactivate:[PendingChangesGuard] },
    { path: 'portal', component: DashboardComponent, data: { title: 'Dashboard', BaseHref: 'Dashboard' }, resolve: { security: SecurityResolver } ,canDeactivate:[PendingChangesGuard]},
    { path: 'adminemployeedashboard', component: EmployeeComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'admincache', component: AdminCacheComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'customers', component: adminCustomerComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'CustomerVendors', component: adminCustomerVendorsComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'opLog', component: OpLogComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'batchTiming', component: batchTimingComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'VistexCustomerMapping', component: adminVistexCustomerMappingComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } ,canDeactivate:[PendingChangesGuard]},
    { path: 'UnifiedCustomerAdmin', component: adminPrimeCustomersComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } ,canDeactivate:[PendingChangesGuard]},
    { path: 'UnifiedDealRecon', component: adminUnifiedDealReconComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } ,canDeactivate:[PendingChangesGuard]},
    { path: 'adminGeo', component: geoComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'productCategories', component: adminProductCategoriesComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } ,canDeactivate:[PendingChangesGuard]},
    { path: 'constants', component: ConstantsComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } ,canDeactivate:[PendingChangesGuard]},
    { path: 'productAlias', component: adminProductAliasComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } ,canDeactivate:[PendingChangesGuard]},
    { path: 'products', component: adminProductsComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'funfact', component: adminFunFactComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver },canDeactivate:[PendingChangesGuard] },
    { path: 'securityengine', component: adminsecurityEngineComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } ,canDeactivate:[PendingChangesGuard]},
    { path: 'dealTypes', component: adminDealTypesComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'dataquality', component: admindataQualityComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }  },
    { path: 'quoteLetter', component: QuoteLetterComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } ,canDeactivate:[PendingChangesGuard]},
    { path: 'ruleOwner', component: RuleOwnerComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'workflowStages', component: adminWorkflowStagesComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } ,canDeactivate:[PendingChangesGuard]},
    { path: 'workFlow', component: adminWorkFlowComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } ,canDeactivate:[PendingChangesGuard]},
    { path: 'dropdowns', component: AdminDropdownsComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } ,canDeactivate:[PendingChangesGuard]},
    { path: 'consumptionCountry', component: adminConsumptionCountryComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver },canDeactivate:[PendingChangesGuard]  },
    { path: 'pushDealstoVistex', component: adminPushDealsToVistexComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver },canDeactivate:[PendingChangesGuard] },
    { path: 'vistexTestApi', component: adminVistexComponent, data: { title: 'Dashboard', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } ,canDeactivate:[PendingChangesGuard]},
    { path: 'icostproducts', component: iCostProductsComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } ,canDeactivate:[PendingChangesGuard]},
    { path: 'notifications', component: adminNotificationsComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'dealmassupdate', component: DealMassUpdateComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'validateVistexR3Checks', component: ValidateVistexR3ChecksComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'manageEmployee', component: manageEmployeeComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'rules/:rid', component: adminRulesComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'rules', component: adminRulesComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'dataFix', component: adminDataFixComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'vistex', component: adminVistexIntegrationLogComponent, data: { title: 'Dashboard', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'meetComp', component: MeetCompComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'testTenders', component: adminTestTendersComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'supportScript', component: adminsupportScriptComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } ,canDeactivate:[PendingChangesGuard]},
    { path: 'legalException', component: adminlegalExceptionComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver },canDeactivate:[PendingChangesGuard]},
    { path: 'bulkPricingUpdate', component: BulkPricingUpdatesComponent, data: { title: 'Admin', BaseHref: 'Admin', resolve: { security: SecurityResolver } } ,canDeactivate:[PendingChangesGuard]},
    { path: 'gotoPs/:cid', component: goToComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'gotoDeal/:cid', component: goToComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'contractdetails/:cid', component: ContractDetailsComponent, data: { title: 'Dashboard', BaseHref: 'Contract' }, resolve: { security: SecurityResolver } },
    { path: 'contractdetails/copycid/:cid', component: ContractDetailsComponent, data: { title: 'Dashboard', BaseHref: 'Contract' }, resolve: { security: SecurityResolver } },
    { path: 'manager/:cid', component: globalRouteComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver }, },
    { path: 'manager/:type/:cid/:PSID/:PTID/:DealID', component: globalRouteComponent, resolve: { security: SecurityResolver }, data: { title: 'Admin', BaseHref: 'Admin' } },
    { path: 'contractmanager/:type/:cid/:PSID/:PTID/:DealID', component: pricingTableComponent, data: { title: 'Contract', BaseHref: 'Contract' }, resolve: { security: SecurityResolver } },
    { path: 'tendermanager/:cid', component: TenderManagerComponent, data: { title: 'Dashboard', BaseHref: 'Contract' }, resolve: { security: SecurityResolver } },
    { path: 'MyDealsSupport', component: adminMydealsSupportComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'vistexProfiseeApi', component: adminVistexProfiseeApiComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'asyncProcedureJobs', component: AsyncProcedureJobsComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'sdsDealOverrides', component: SdsDealOverridesComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'dbAuditTools', component: dbAuditToolsComponent, data: { title: 'Admin', BaseHref: 'Admin' }, resolve: { security: SecurityResolver } },
    { path: 'Home', component: CodingPracticesComponent, data: { title: 'CodingPractices', BaseHref: 'CodingPractices' }, resolve: { security: SecurityResolver } },
    { path: 'BusinessDesign', component: BusinessProcessComponent, data: { title: 'CodingPractices', BaseHref: 'CodingPractices' }, resolve: { security: SecurityResolver } },
    { path: 'CodingTools', component: CodingToolsComponent, data: { title: 'CodingPractices', BaseHref: 'CodingPractices' }, resolve: { security: SecurityResolver } },
    { path: 'CodeQuality', component: CodeQualityComponent, data: { title: 'CodingPractices', BaseHref: 'CodingPractices' }, resolve: { security: SecurityResolver } },
    { path: 'Project', component: ProjectFlowComponent, data: { title: 'CodingPractices', BaseHref: 'CodingPractices' }, resolve: { security: SecurityResolver } },
    { path: 'Flows', component: ScopeDecisionComponent, data: { title: 'CodingPractices', BaseHref: 'CodingPractices' }, resolve: { security: SecurityResolver } },
    { path: 'CiCdPipeline', component: CicdPipelineComponent, data: { title: 'CodingPractices', BaseHref: 'CodingPractices' }, resolve: { security: SecurityResolver } },
  ];