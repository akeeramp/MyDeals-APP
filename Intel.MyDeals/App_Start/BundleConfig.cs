using System.Web;
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

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/scripts").Include(
                "~/Scripts/jquery-2.2.0.min.js",
                "~/Scripts/Angular/1.5.8/angular.min.js",
                "~/Scripts/kendo/2017.R1/jszip.min.js",
                "~/Scripts/kendo/2017.R1/kendo.all.min.js",
                "~/Scripts/kendo/kendo.aspnetmvc.min.js",
                "~/Scripts/jquery.easypiechart.min.js",
                "~/Scripts/moment.js",
                "~/Scripts/Opaque/OpaqueUtils.js",
                "~/Scripts/toastr.min.js",
                "~/Scripts/topbar.min.js",
                "~/Scripts/jquery.rainbowJSON.js",
                "~/Scripts/jquery-ui.min.js",
                "~/Scripts/tooltipster.bundle.min.js",
                "~/js/bootstrap.min.js",
                "~/Scripts/angular-bootstrap-toggle.js",
                "~/Scripts/Angular/select.min.js",
                "~/Scripts/Angular/angular-linq.min.js",
                "~/Scripts/angular-gridster.min.js",
                "~/Scripts/d3/d3.min.js",
                "~/Scripts/angular-nvd3.min.js",
                "~/Scripts/nv.d3.min.js",
                "~/Scripts/angular-confirm.min.js",
                "~/Scripts/base64-string.js",
                "~/Scripts/lz-string.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
           "~/Scripts/Angular/1.5.8/angular-ui-router.min.js"
           , "~/Scripts/Angular/1.5.8/angular-animate.min.js"
           , "~/Scripts/Angular/1.5.8/angular-sanitize.min.js"
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
                , "~/app/core/directives/gridCell/dealDetail.directive.js"
                , "~/app/core/directives/gridCell/dealTools.directive.js"
                , "~/app/core/directives/gridCell/percentBar.directive.js"
                , "~/app/core/directives/gridStatusBoard/contractStatusBoard.directive.js"
                , "~/app/core/directives/gridStatusBoard/gridStatusBoard.directive.js"
                , "~/app/core/directives/messageBoard/messageBoard.directive.js"
                , "~/app/core/directives/opGrid/opGrid.directive.js"
                , "~/app/core/directives/opPopover/opPopover.directive.js"
                , "~/app/core/directives/searchResults/searchResults.directive.js"
                , "~/app/blocks/util.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/angularModules").Include(
                 "~/app/admin/admin.module.js"
                , "~/app/admin/admin.route.js"
                , "~/app/admin/cache/admin.cache.controller.js"
                , "~/app/admin/cache/cache.service.js"
                , "~/app/admin/cache/cache.manager.resize.directive.js"
                , "~/app/admin/constants/admin.constants.controller.js"
                , "~/app/admin/constants/constants.service.js"
                , "~/app/admin/customer/admin.customer.controller.js"
                , "~/app/admin/customer/customer.service.js"
                , "~/app/admin/dropdowns/admin.dropdowns.controller.js"
                , "~/app/admin/dropdowns/dropdowns.service.js"
                , "~/app/admin/geo/admin.geo.controller.js"
                , "~/app/admin/geo/geo.service.js"
                , "~/app/admin/iCostProducts/directive/pct.queryBuilder.directive.js"
                , "~/app/admin/iCostProducts/admin.iCostProduct.service.js"
                , "~/app/admin/iCostProducts/admin.iCostProducts.controller.js"
                , "~/app/admin/productCategories/admin.productCategories.controller.js"
                , "~/app/admin/productCategories/productCategories.service.js"
                , "~/app/admin/products/admin.products.controller.js"
                , "~/app/admin/products/products.service.js"
                , "~/app/admin/productAlias/admin.productAlias.controller.js"
                , "~/app/admin/productAlias/productAlias.service.js"
                , "~/app/admin/productSelector/admin.ProductSelector.controller.js"
                , "~/app/admin/productSelector/ProductSelector.service.js"
                , "~/app/admin/productIncExc/admin.productEntryIncExc.controller.js"
                , "~/app/admin/productIncExc/productEntryIncExc.service.js"
                , "~/app/admin/rules/admin.rules.controller.js"
                , "~/app/admin/rules/rules.service.js"
                , "~/app/admin/securityAttributes/adminApplications/adminApplications.controller.js"
                , "~/app/admin/securityAttributes/adminApplications/adminApplications.service.js"
                , "~/app/admin/securityAttributes/adminDealTypes/adminDealTypes.controller.js"
                , "~/app/admin/securityAttributes/adminDealTypes/adminDealTypes.service.js"
                , "~/app/admin/securityAttributes/adminRoleTypes/adminRoleTypes.controller.js"
                , "~/app/admin/securityAttributes/adminRoleTypes/adminRoleTypes.service.js"
                , "~/app/admin/securityAttributes/securityActions/securityActions.controller.js"
                , "~/app/admin/securityAttributes/securityActions/securityActions.service.js"
                , "~/app/admin/securityEngine/securityEngineUtils.js"
                , "~/app/admin/securityEngine/securityEngineDrawDeals.directive.js"
                , "~/app/admin/securityEngine/securityEngine.service.js"
                , "~/app/admin/securityEngine/securityEngine.controller.js"
                , "~/app/admin/workflow/admin.workflow.controller.js"
                , "~/app/admin/workflow/workflow.service.js"
                , "~/app/admin/workflowStage/admin.workflowStages.controller.js"
                , "~/app/admin/workflowStage/workflowStages.service.js"
                , "~/app/contract/contract.module.js"
                , "~/app/contract/contract.route.js"
                , "~/app/contract/controllers/allDeals.controller.js"
                , "~/app/contract/controllers/contract.controller.js"
                , "~/app/contract/controllers/manager.controller.js"
                , "~/app/contract/controllers/managerDealType.controller.js"
                , "~/app/contract/controllers/managerPct.controller.js"
                , "~/app/contract/controllers/mrktSegMultiSelect.service.js"
                , "~/app/contract/controllers/datePickerModalCtrl.controller.js"
                , "~/app/contract/controllers/multiSelectModalCtrl.controller.js"
                , "~/app/contract/controllers/pricingTable.controller.js"
                , "~/app/contract/productSelector/productSelector.controller.js"
                , "~/app/contract/productCorrector/productCorrector.controller.js"
                , "~/app/contract/productCorrector/productCorrector.service.js"
                , "~/app/contract/productSelector/kendoGridCheckBox.directive.js"
                , "~/app/contract/productCAPBreakout/productCAPBreakout.controller.js"
                , "~/app/costTest/costtest.module.js"
                , "~/app/costTest/costtest.route.js"
                , "~/app/dashboard/dashboard.module.js"
                , "~/app/dashboard/dashboard.route.js"
                , "~/app/dashboard/controllers/dashboard.controller.js"
                , "~/app/blocks/uiControls/focusOnShow.directive.js"
                , "~/app/blocks/uiControls/opcontrol.directive.js"
                , "~/app/blocks/uiControls/opcontrolFlat.directive.js"
                , "~/app/blocks/uiControls/opcontrolDataElement.directive.js"
                , "~/app/shared/services/lookups.service.js"
                , "~/app/shared/services/customer.service.js"
                , "~/app/shared/services/objset.service.js"
                , "~/app/shared/services/templates.service.js"
                , "~/app/testCases/testCases.module.js"
                , "~/app/testCases/testCases.route.js"
                , "~/app/testCases/grids/basic.controller.js"
                , "~/app/testCases/grids/status.controller.js"
                , "~/app/testCases/grids/opGrid.controller.js"
                , "~/app/testCases/rules/businessRules.controller.js"
                , "~/app/testCases/uiControls/uiControls.controller.js"
                , "~/app/testCases/opMessages/opMessages.controller.js"
                , "~/app/testCases/suggestProduct/suggestProduct.controller.js"
                , "~/app/testCases/suggestProduct/suggestProduct.service.js"
                ));

            bundles.Add(new ScriptBundle("~/MyDeals/scripts").Include(
                "~/js/_util.js",
                "~/js/_gridUtil.js",
                "~/js/_dealUtil.js"
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
                "~/css/angular-gridster.css"
                ));

            //"~/Content/kendo/2016.3.914/kendo.office365.min.css",

            bundles.Add(new StyleBundle("~/MyDeals/css").Include(
                "~/css/_dealUtil.css",
                "~/css/_secEngine.css",
                "~/Content/styles.css",
                "~/css/_controls.css",
                "~/css/_contractManager.css",
                "~/css/_dashboard.css"
                ));
        }
    }
}