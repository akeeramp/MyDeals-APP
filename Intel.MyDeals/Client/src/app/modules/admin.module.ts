import { EmployeeComponent } from '../admin/employee/admin.employee.component';
import { AdminCacheComponent } from '../admin/cache/admin.cache.component';
import { adminCustomerComponent } from '../admin/customer/admin.customer.component';
import { adminCustomerVendorsComponent } from '../admin/CustomerVendors/admin.customerVendors.component';
import { OpLogComponent } from '../admin/oplog/admin.oplog.component';
import { batchTimingComponent } from '../admin/batchTiming/admin.batchTiming.component';
import { adminVistexCustomerMappingComponent } from '../admin/vistexCustomerMapping/admin.vistexCustomerMapping.component';
import { adminPrimeCustomersComponent } from '../admin/PrimeCustomers/admin.primeCustomers.component';
import { geoComponent } from '../admin/geo/admin.geo.component';
import { adminDataFixComponent } from '../admin/dataFix/admin.dataFix.component';
import { ConstantsComponent } from '../admin/constants/admin.constants.component';
import { adminProductAliasComponent } from '../admin/productAlias/admin.productAlias.component';
import { adminProductsComponent } from '../admin/products/admin.products.component';
import { adminProductCategoriesComponent } from '../admin/productCategories/admin.productCategories.component';
import { adminFunFactComponent } from '../admin/funFact/admin.funFact.component';
import { adminDealTypesComponent } from '../admin/dealTypes/admin.dealTypes.component';
import { admindataQualityComponent } from '../admin/dataQuality/admin.dataQuality.component';
import { QuoteLetterComponent } from '../admin/quoteLetter/admin.quoteLetter.component';
import { RuleOwnerComponent } from '../admin/ruleOwner/admin.RuleOwner.component';
import { adminWorkflowStagesComponent } from '../admin/workflowStages/admin.workflowStages.component';
import { adminWorkFlowComponent } from '../admin/workFlow/admin.workFlow.component';
import { AdminDropdownsComponent } from '../admin/dropdowns/admin.dropdowns.component';
import { DropdownBulkUploadDialogComponent } from '../admin/dropdowns/dropdownBulkUploadDialog/admin.dropdowns.bulkUploadDialog.component';
import { adminConsumptionCountryComponent } from '../admin/consumptionCountry/admin.consumptionCountry.component';
import { adminPushDealsToVistexComponent } from '../admin/pushDealstoVistex/admin.pushDealstoVistex.component';
import { adminVistexComponent } from '../admin/vistex/admin.vistex.component';
import { pctQueryBuilderComponent } from '../admin/iCostProducts/directive/pct.queryBuilder.component';
import { iCostProductsComponent } from '../admin/iCostProducts/admin.iCostProducts.component';
import { notificationsSettingsDialog } from '../admin/notifications/admin.notificationsSettings.component';
import { notificationsModalDialog } from '../admin/notifications/admin.notificationsModal.component';
import { adminNotificationsComponent } from '../admin/notifications/admin.notifications.component';
import { DealMassUpdateComponent } from '../admin/dealMassUpdate/admin.dealMassUpdate.component';
import { ValidateVistexR3ChecksComponent } from '../admin/validateVistexR3Checks/admin.validateVistexR3Checks.component';
import { manageEmployeeComponent } from '../admin/employee/admin.manageEmployee.component';
import { ManageEmployeeModalComponent } from "../admin/employee/admin.manageEmployeeModal.component";
import { MeetCompComponent } from "../admin/meetComp/admin.meetComp.component";
import { adminRulesComponent } from '../admin/rules/admin.rules.component';
import { RulesSimulationModalComponent } from '../admin/rules/admin.rulesSimulationModal.component';
import { RuleDetailsModalComponent } from '../admin/rules/admin.ruleDetailsModal.component';
import { adminVistexIntegrationLogComponent } from '../admin/vistex/admin.vistexIntegrationLog.component';
import { adminsupportScriptComponent } from '../admin/supportScript/admin.supportScript.component';
import { adminlegalExceptionComponent } from '../admin/legalException/admin.legalException.component'; 
import { adminexceptionDetailsComponent } from '../admin/legalException/admin.exceptionDetails.component';
import { adminamendmentExceptioncomponent } from '../admin/legalException/admin.amendmentException.component';
import { admincompareExceptionscomponent } from '../admin/legalException/admin.compareExceptions.component';
import { adminviewExceptionsComponent } from '../admin/legalException/admin.viewExceptions.component';
import { adminviewDealListcomponent } from '../admin/legalException/admin.viewDealList.component';
import { adminTestTendersComponent } from '../admin/testTenders/admin.testTenders.component';
import { adminDownloadExceptionscomponent } from '../admin/legalException/admin.downloadExceptions.component'
import { BulkUploadMeetCompModalComponent } from '../admin/meetComp/admin.bulkUploadMeetCompModal.component';
import { adminUnifiedDealReconComponent } from '../admin/unifiedDealRecon/admin.UnifiedDealRecon.component';
import { bulkUnifyModalComponent } from '../admin/unifiedDealRecon/admin.bulkUnifyModal.component';
import { retriggerUnifyModalComponent } from '../admin/unifiedDealRecon/admin.retriggerUnifyModal.component';
import { adminsecurityEngineComponent } from '../admin/securityEngine/admin.securityEngine.component';
import { BulkPricingUpdatesComponent } from '../admin/bulkPricingUpdates/admin.bulkPricingUpdates.component';
import { BulkPricingUpdateModalComponent } from '../admin/bulkPricingUpdates/admin.bulkPricingUpdateModal.component';
import { adminMydealsSupportComponent } from '../admin/mydealssupport/admin.mydealssupport.component';
import { adminVistexProfiseeApiComponent } from '../admin/vistex/admin.vistexProfiseeAPI.component';
import { AsyncProcedureJobsComponent } from '../admin/asyncProcedureJobs/admin.asyncProcedureJobs.component';
import { CreateProcedureJobModalComponent } from '../admin/asyncProcedureJobs/createProcedureJobModal/createProcedureJobModal.component';
import { SdsDealOverridesComponent } from '../admin/sdsDealOverrides/admin.sdsDealOverrides.component';
import { dbAuditToolsComponent } from '../admin/dbAuditTools/admin.dbAuditTools.component';
import { DbAuditToolsViewModalComponent } from '../admin/dbAuditTools/admin.dbAuditToolsViewModal.component';
import { DbAuditToolsCompareModalComponent } from '../admin/dbAuditTools/admin.dbAuditToolsCompareModal.component';
import { QuoteLetterRegenerationComponent } from "../admin/quoteLetter/admin.quoteLetterRegeneration.component";
import { MonacoEditorComponent } from '../shared/monacoCustomEditor/monacoCustomEditor.component';

export const AdminComponents =[
    EmployeeComponent,
    AdminCacheComponent,
    adminCustomerComponent,
    adminCustomerVendorsComponent,
    OpLogComponent,
    batchTimingComponent,
    adminVistexCustomerMappingComponent,
    adminPrimeCustomersComponent,
    geoComponent,
    adminDataFixComponent,
    ConstantsComponent,
    adminProductAliasComponent,
    adminProductsComponent,
    adminProductCategoriesComponent,
    adminFunFactComponent,
    adminDealTypesComponent,
    admindataQualityComponent,
    QuoteLetterComponent,
    RuleOwnerComponent,
    adminWorkflowStagesComponent,
    adminWorkFlowComponent,
    adminPushDealsToVistexComponent,
    adminWorkFlowComponent,
    AdminDropdownsComponent,
    DropdownBulkUploadDialogComponent,
    adminConsumptionCountryComponent,
    adminVistexComponent,
    pctQueryBuilderComponent,
    iCostProductsComponent,
    notificationsSettingsDialog,
    notificationsModalDialog,
    adminNotificationsComponent,
    DealMassUpdateComponent,
    ValidateVistexR3ChecksComponent,
    manageEmployeeComponent,
    ManageEmployeeModalComponent,
    MeetCompComponent,
    adminRulesComponent,
    RulesSimulationModalComponent,
    RuleDetailsModalComponent,
    adminVistexIntegrationLogComponent,
    adminTestTendersComponent,
    BulkUploadMeetCompModalComponent,
    adminsupportScriptComponent,
    adminlegalExceptionComponent,
    adminexceptionDetailsComponent,
    adminamendmentExceptioncomponent,
    admincompareExceptionscomponent,
    adminviewExceptionsComponent,
    adminviewDealListcomponent, 
    adminsecurityEngineComponent,
    adminDownloadExceptionscomponent,
    adminUnifiedDealReconComponent,
    bulkUnifyModalComponent,
    BulkPricingUpdatesComponent,
    BulkPricingUpdateModalComponent,
    adminMydealsSupportComponent,
    adminVistexProfiseeApiComponent,
    retriggerUnifyModalComponent,
    AsyncProcedureJobsComponent,
    CreateProcedureJobModalComponent,
    SdsDealOverridesComponent,
    dbAuditToolsComponent,
    DbAuditToolsViewModalComponent,
    DbAuditToolsCompareModalComponent,
    MonacoEditorComponent,
    QuoteLetterRegenerationComponent
]