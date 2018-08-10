using System.Web.Optimization;

namespace Intel.MyDeals
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/scripts").Include(
                "~/Scripts/jquery-3.1.1.min.js",
                "~/Scripts/Angular/1.6.9/angular.min.js",
                "~/Scripts/kendo/2017.R1/jszip.min.js",
                "~/Scripts/kendo/2017.R1/kendo.all.min.js",
                "~/Scripts/kendo/kendo.aspnetmvc.min.js",
                "~/Scripts/moment.js",
                "~/Scripts/moment-timezone.js",
                "~/Scripts/Opaque/OpaqueUtils.js",
                "~/Scripts/toastr.min.js",
                "~/Scripts/jquery.rainbowJSON.js",
                "~/Scripts/jquery-ui.min.js",
                "~/Scripts/bootstrap.min.js",
                "~/Scripts/angular-bootstrap-toggle.js",
                "~/Scripts/Angular/select.min.js",
                "~/Scripts/Angular/angular-linq.min.js",
                "~/Scripts/Angular/ngStorage.min.js",
                "~/Scripts/angular-gridster.min.js",
                "~/Scripts/base64-string.js",
                "~/Scripts/lz-string.min.js",
                "~/Scripts/bootstrap-switch.min.js",
                "~/Scripts/intcAnalytics.js",
                "~/Scripts/Angular/clipboard.min.js",
                "~/Scripts/Angular/ngclipboard.min.js",
                "~/Scripts/modernizr-2.6.2.min.js"
                )); 

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
           "~/Scripts/Angular/1.6.9/angular-ui-router.min.js"
           , "~/Scripts/Angular/1.6.9/angular-animate.min.js"
           , "~/Scripts/Angular/1.6.9/angular-sanitize.min.js"
           , "~/Scripts/Angular/ui-bootstrap-tpls-2.2.0.min.js"
           , "~/Scripts/Angular/angular-linq.min.js"
           , "~/Scripts/Angular/angular-filter.min.js"
           ));

            bundles.Add(new ScriptBundle("~/bundles/angularReusable").Include(
                 "~/app/app.module.js"
                , "~/app/blocks/confirmationModal/confirmationModal.module.js"
                , "~/app/blocks/exception/exception.module.js"
                , "~/app/blocks/exception/exception-handler.provider.js"
                , "~/app/blocks/exception/exception.js"
                , "~/app/blocks/logger/logger.module.js"
                , "~/app/blocks/logger/logger.js"
                , "~/app/blocks/router/router.module.js"
                , "~/app/blocks/router/routehelper.js"
                , "~/app/blocks/secUtil/secUtil.module.js"
                , "~/app/blocks/secUtil/secUtil.service.js"
                , "~/app/blocks/uiControls/uiControls.module.js"
                , "~/app/blocks/confirmationModal/confirmationModal.service.js"
                , "~/app/core/core.module.js"
                , "~/app/core/progressInterceptor.js"
                , "~/app/core/constants.js"
                , "~/app/core/config.js"
                , "~/app/core/dataservice.js"
                , "~/app/core/directives/queryBuilder.directive.js"
                , "~/app/core/directives/expandKendogrid.directive.js"
                , "~/app/core/directives/dirtyTracking.directive.js"
                , "~/app/core/directives/bindToHeight.directive.js"
                , "~/app/core/directives/moveablemodal.directive.js"
                , "~/app/core/directives/adminBanner/adminBanner.directive.js"
                , "~/app/core/directives/attributeBuilder/attributeBuilder.directive.js"
                , "~/app/core/directives/attributeSearch/attributeSearchGrid.directive.js"
                , "~/app/core/directives/buttons/btnRunPctMct.directive.js"
                , "~/app/core/directives/dealPopup/dealPopup.directive.js"
                , "~/app/core/directives/dealPopup/dealPopupDock.directive.js"
                , "~/app/core/directives/dealPopup/dealPopupIcon.directive.js"
                , "~/app/core/directives/gridCell/dealDetail.directive.js"
                , "~/app/core/directives/gridCell/dealTools.directive.js"
                , "~/app/core/directives/gridCell/dealToolsTender.directive.js"
                , "~/app/core/directives/gridCell/iconMctPct.directive.js"
                , "~/app/core/directives/gridCell/percentBar.directive.js"
                , "~/app/core/directives/gridStatusBoard/contractStatusBoard.directive.js"
                , "~/app/core/directives/gridStatusBoard/gridStatusBoard.directive.js"
                , "~/app/core/directives/loadingPanel/loadingPanel.directive.js"
                , "~/app/core/directives/messageBoard/messageBoard.directive.js"
                , "~/app/core/directives/opGrid/opGrid.directive.js"
                , "~/app/core/directives/opPopover/opPopover.directive.js"
                , "~/app/core/directives/overlappingDeals/overlappingDeals.directive.js"
                , "~/app/core/directives/ping/ping.directive.js"
                , "~/app/core/directives/searchResults/searchResults.directive.js"
                , "~/app/core/directives/securityLoader/securityLoader.directive.js"
                , "~/app/core/directives/trashcan/trashcan.directive.js"
                , "~/app/core/directives/timeline/timelineDetails.directive.js"
                , "~/app/core/directives/meetComp/meetComp.directive.js"
                , "~/app/core/directives/meetComp/meetCompDealDetails.js"
                , "~/app/core/filters/kitProducts.filter.js"
                , "~/app/core/filters/kitCalculatedValues.filter.js"
                , "~/app/core/filters/gridMath.filter.js"
                , "~/app/blocks/util.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/angularModules").Include(
                 "~/app/admin/admin.module.js"
                , "~/app/admin/admin.route.js"
                , "~/app/shared/_requestVerificationToken.js"
                , "~/app/admin/cache/admin.cache.controller.js"
                , "~/app/admin/cache/cache.service.js"
                , "~/app/admin/cache/cache.manager.resize.directive.js"
                , "~/app/admin/oplog/admin.oplog.controller.js"
                , "~/app/admin/oplog/oplog.service.js"
                , "~/app/admin/constants/admin.constants.controller.js"
                , "~/app/admin/constants/constants.service.js"
                , "~/app/admin/customer/admin.customer.controller.js"
                , "~/app/admin/customer/customer.service.js"
                , "~/app/admin/dropdowns/admin.dropdowns.controller.js"
                , "~/app/admin/dropdowns/dropdowns.service.js"
                , "~/app/admin/employee/employee.service.js"
                , "~/app/admin/employee/admin.employee.controller.js"
                , "~/app/admin/employee/manageEmployee.service.js"
                , "~/app/admin/employee/admin.manageEmployee.controller.js"
                , "~/app/admin/employee/manageEmployeeModal.controller.js"
                , "~/app/admin/geo/admin.geo.controller.js"
                , "~/app/admin/geo/geo.service.js"
                , "~/app/admin/iCostProducts/directive/pct.queryBuilder.directive.js"
                , "~/app/admin/iCostProducts/admin.iCostProduct.service.js"
                , "~/app/admin/iCostProducts/admin.iCostProducts.controller.js"
                , "~/app/admin/legalExceptions/legalExceptions.service.js"
                , "~/app/admin/legalExceptions/admin.legalException.controller.js"
                , "~/app/admin/productCategories/admin.productCategories.controller.js"
                , "~/app/admin/productCategories/productCategories.service.js"
                , "~/app/admin/products/admin.products.controller.js"
                , "~/app/admin/products/products.service.js"
                , "~/app/admin/productAlias/admin.productAlias.controller.js"
                , "~/app/admin/productAlias/productAlias.service.js"
                , "~/app/admin/productIncExc/admin.productEntryIncExc.controller.js"
                , "~/app/admin/productIncExc/productEntryIncExc.service.js"
                , "~/app/admin/rules/admin.rules.controller.js"
                , "~/app/admin/rules/rules.service.js"
                , "~/app/admin/securityAttributes/adminDealTypes/adminDealTypes.controller.js"
                , "~/app/admin/securityAttributes/adminDealTypes/adminDealTypes.service.js"
                , "~/app/admin/securityAttributes/adminRoleTypes/adminRoleTypes.controller.js"
                , "~/app/admin/securityAttributes/adminRoleTypes/adminRoleTypes.service.js"
                , "~/app/admin/securityEngine/securityEngineUtils.js"
                , "~/app/admin/securityEngine/securityEngineDrawDeals.directive.js"
                , "~/app/admin/securityEngine/securityEngine.service.js"
                , "~/app/admin/securityEngine/securityEngine.controller.js"
                , "~/app/admin/quoteLetter/admin.quoteLetter.controller.js"
                , "~/app/admin/quoteLetter/quoteLetter.service.js"
                , "~/app/admin/funfact/admin.funfact.controller.js"
                , "~/app/admin/funfact/funfact.service.js"
                , "~/app/admin/workflow/admin.workflow.controller.js"
                , "~/app/admin/workflow/workflow.service.js"
                , "~/app/admin/workflowStage/admin.workflowStages.controller.js"
                , "~/app/admin/workflowStage/workflowStages.service.js"
                , "~/app/admin/meetComp/admin.meetComp.controller.js"
                , "~/app/admin/meetComp/meetComp.service.js"
                , "~/app/advancedSearch/advancedSearch.module.js"
                , "~/app/advancedSearch/advancedSearch.route.js"
                , "~/app/advancedSearch/advancedSearch.controller.js"
                , "~/app/advancedSearch/attributeSearch.controller.js"
                , "~/app/advancedSearch/dealSearch.controller.js"
                , "~/app/advancedSearch/globalSearch.directive.js"
                , "~/app/advancedSearch/globalSearchResults.directive.js"
                , "~/app/advancedSearch/psSearch.controller.js"
                , "~/app/advancedSearch/ptSearch.controller.js"
                , "~/app/advancedSearch/tenderSearch.controller.js"
                , "~/app/contract/contract.module.js"
                , "~/app/contract/contract.route.js"
                , "~/app/contract/controllers/actionSummaryModal.controller.js"
                , "~/app/contract/controllers/allDeals.controller.js"
                , "~/app/contract/controllers/contract.controller.js"
                , "~/app/contract/controllers/datePickerModal.controller.js"
                , "~/app/contract/controllers/dealProductsModal.controller.js"
                , "~/app/contract/controllers/dealTimelineModal.controller.js"
                , "~/app/contract/controllers/dropdownModal.controller.js"
                , "~/app/contract/controllers/ecapTrackerAutoFillModal.controller.js"
                , "~/app/contract/controllers/ecapTrackerModal.controller.js"
                , "~/app/contract/controllers/emailModal.controller.js"
                , "~/app/contract/controllers/excludeDealGroupMultiSelect.controller.js"
                , "~/app/contract/controllers/export.controller.js"
                , "~/app/contract/controllers/manager.controller.js"
                , "~/app/contract/controllers/managerDealType.controller.js"
                , "~/app/contract/controllers/managerExcludeGroups.controller.js"
                , "~/app/contract/controllers/managerOverlapping.controller.js"
                , "~/app/contract/controllers/managerPct.controller.js"
                , "~/app/contract/controllers/managerTimeline.controller.js"
                , "~/app/contract/controllers/mrktSegMultiSelect.service.js"
                , "~/app/contract/controllers/multiSelectModal.controller.js"
                , "~/app/contract/controllers/pctGroupModal.controller.js"
                , "~/app/contract/controllers/pctOverrideReasonModal.controller.js"
                , "~/app/contract/controllers/pricingTable.controller.js"
                , "~/app/contract/controllers/renameTitleModal.controller.js"
                , "~/app/contract/controllers/selectPricingTableModal.controller.js"
                , "~/app/contract/productSelector/productSelector.controller.js"
                , "~/app/contract/productCorrector/productCorrector.controller.js"
                , "~/app/contract/productCorrector/productCorrectorBeta.controller.js"
                , "~/app/contract/productCorrector/productCorrector.service.js"
                , "~/app/contract/productCorrector/productCorrectorBeta.controller.js"
                , "~/app/contract/productSelector/kendoGridCheckBox.directive.js"
                , "~/app/contract/productCAPBreakout/productCAPBreakout.controller.js"
                , "~/app/contract/targetRegionPicker/targetRegionPicker.controller.js"
                , "~/app/contract/autofillSettings/autofillSettings.controller.js"
                , "~/app/tenderManager/tenderManager.module.js"
                , "~/app/tenderManager/tenderManager.route.js"
                , "~/app/tenderManager/controllers/tenderManager.controller.js"
                , "~/app/costTest/costtest.module.js"
                , "~/app/costTest/costtest.route.js"
                , "~/app/dashboard/dashboard.module.js"
                , "~/app/dashboard/dashboard.route.js"
                , "~/app/dashboard/controllers/dashboard.controller.js"
                , "~/app/blocks/uiControls/focusOnShow.directive.js"
                , "~/app/blocks/uiControls/opControl.directive.js"
                , "~/app/blocks/uiControls/opControlFlat.directive.js"
                , "~/app/blocks/uiControls/opControlDataElement.directive.js"
                , "~/app/shared/services/lookups.service.js"
                , "~/app/shared/services/customerCalendar.service.js"
                , "~/app/shared/services/objset.service.js"
                , "~/app/shared/services/security.service.js"
                , "~/app/shared/services/performanceTestingService.service.js"
                , "~/app/shared/services/productSelector.service.js"
                , "~/app/shared/services/templates.service.js"
                , "~/app/shared/services/userPreferences.service.js"
                , "~/app/testCases/testCases.module.js"
                , "~/app/testCases/testCases.route.js"
                , "~/app/testCases/controls/controls.controller.js"
                , "~/app/testCases/grids/basic.controller.js"
                , "~/app/testCases/grids/status.controller.js"
                , "~/app/testCases/grids/opGrid.controller.js"
                , "~/app/testCases/rules/businessRules.controller.js"
                , "~/app/testCases/uiControls/uiControls.controller.js"
                , "~/app/testCases/opMessages/opMessages.controller.js"
                , "~/app/testCases/performanceTesting/performanceTesting.controller.js"
                , "~/app/testCases/performanceTesting/performanceTesting.service.js"
                , "~/app/testCases/suggestProduct/suggestProduct.controller.js"
                , "~/app/testCases/suggestProduct/suggestProduct.service.js"
                ));

            bundles.Add(new ScriptBundle("~/MyDeals/scripts").Include(
                "~/js/_util.js",
                "~/js/_gridUtil.js",
                "~/js/helpUtil.js"
                ));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/css/toastr.min.css",
                "~/css/font-awesome.min.css",
                "~/css/jquery.rainbowJSON.css",
                "~/css/jquery-ui.min.css",
                "~/Content/kendo/2017.R1/kendo.common-material.min.css",
                "~/css/it-mlaf.min.css",
                "~/css/kendo.intel.css",
                "~/css/angular-bootstrap-toggle.min.css",
                "~/css/select.min.css",
                "~/css/select2.min.css",
                "~/css/nv.d3.min.css",
                "~/css/angular-gridster.css",
                "~/css/bootstrap-switch.min.css",
                "~/app/core/directives/dealPopup/dealPopup.directive.css",
                "~/app/core/directives/dealPopup/dealPopupDock.directive.css",
                "~/app/core/directives/dealPopup/dealPopupIcon.directive.css"
                // TODO: Check with Tory...Commenting this for now as its affecting global css
                // May be refer this in handbook html directly
                //"~/css/simple-sidebar.css"
                ));

            //"~/Content/kendo/2016.3.914/kendo.office365.min.css",

            bundles.Add(new StyleBundle("~/MyDeals/css").Include(
                "~/css/_dealUtil.css",
                "~/css/_secEngine.css",
                "~/Content/styles.css",
                "~/css/_controls.css",
                "~/css/_contractManager.css",
                "~/css/_loadingPanel.directive.css",
                "~/css/_dashboard.css"
                ));
        }
    }
}