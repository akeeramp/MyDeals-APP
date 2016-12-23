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
                "~/Scripts/kendo/2016.3.914/jszip.min.js",
                "~/Scripts/kendo/2016.3.914/kendo.all.min.js",
                "~/Scripts/kendo/kendo.aspnetmvc.min.js",
                "~/Scripts/jquery.easypiechart.min.js",
                "~/Scripts/moment.js",
                "~/Scripts/d3.min.js",
                "~/Scripts/Opaque/OpaqueUtils.js",
                "~/Scripts/toastr.min.js",
                "~/Scripts/topbar.min.js",
                "~/Scripts/jquery.rainbowJSON.js",
                "~/Scripts/jquery-ui.min.js",
                "~/Scripts/tooltipster.bundle.min.js",
                "~/js/bootstrap.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                "~/Scripts/Angular/1.5.8/angular-ui-router.min.js"
                , "~/Scripts/Angular/1.5.8/angular-animate.min.js"
                , "~/Scripts/Angular/1.5.8/angular-sanitize.min.js"
				, "~/Scripts/Angular/ui-bootstrap-tpls-2.2.0.min.js"
				));

            bundles.Add(new ScriptBundle("~/bundles/angularReusable").Include(
                 "~/app/app.module.js"
                , "~/app/blocks/exception/exception.module.js"
                , "~/app/blocks/exception/exception-handler.provider.js"
                , "~/app/blocks/exception/exception.js"
                , "~/app/blocks/logger/logger.module.js"
                , "~/app/blocks/logger/logger.js"
                , "~/app/blocks/router/router.module.js"
                , "~/app/blocks/router/routehelper.js"
                , "~/app/core/core.module.js"
                , "~/app/core/progressInterceptor.js"
                , "~/app/core/constants.js"
                , "~/app/core/config.js"
                , "~/app/core/dataservice.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/angularModules").Include(
                  "~/app/admin/admin.module.js"
                , "~/app/admin/admin.route.js"
                , "~/app/admin/cache/cache.service.js"
                , "~/app/admin/cache/admin.cache.controller.js"
                , "~/app/admin/constants/constants.service.js"
                , "~/app/admin/constants/admin.constants.controller.js"
                , "~/app/admin/customer/customer.service.js"
                , "~/app/admin/geo/admin.geo.controller.js"
                , "~/app/admin/geo/geo.service.js"
                , "~/app/admin/products/admin.products.controller.js"
                , "~/app/admin/products/products.service.js"
                , "~/app/admin/customer/admin.customer.controller.js"
                , "~/app/admin/securityAttributes/securityActions/securityActions.service.js"
                , "~/app/admin/securityAttributes/securityActions/securityActions.controller.js"
                , "~/app/admin/securityAttributes/adminApplications/adminApplications.service.js"
                , "~/app/admin/securityAttributes/adminApplications/adminApplications.controller.js"
                , "~/app/admin/securityAttributes/adminDealTypes/adminDealTypes.service.js"
                , "~/app/admin/securityAttributes/adminDealTypes/adminDealTypes.controller.js"
                , "~/app/admin/securityAttributes/adminRoleTypes/adminRoleTypes.service.js"
                , "~/app/admin/securityAttributes/adminRoleTypes/adminRoleTypes.controller.js"
                , "~/app/costTest/costtest.module.js"
                , "~/app/costTest/costtest.route.js"
				, "~/app/dashboard/dashboard.module.js"
				, "~/app/dashboard/dashboard.route.js"
				));

            bundles.Add(new ScriptBundle("~/MyDeals/scripts").Include(
                "~/js/_util.js",
                "~/js/_dealUtil.js"
                ));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/css/toastr.min.css",
                "~/css/font-awesome.min.css",
                "~/css/jquery.rainbowJSON.css",
                "~/css/jquery-ui.min.css",
                "~/css/tooltipster.bundle.min.css",
                "~/css/tooltipster-sideTip-light.min.css",
                "~/Content/kendo/2016.3.914/kendo.common-bootstrap.min.css",
                "~/Content/kendo/2016.3.914/kendo.metro.min.css",
                "~/css/it-mlaf.min.css",
                "~/css/kendo.intel.css"
                ));

            //"~/Content/kendo/2016.3.914/kendo.office365.min.css",

            bundles.Add(new StyleBundle("~/MyDeals/css").Include(
                "~/css/_dealUtil.css",
                "~/Content/styles.css"
                ));

        }
    }
}
