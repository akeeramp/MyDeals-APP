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
                "~/Scripts/kendo/2016.Q3/jszip.min.js",
                "~/Scripts/kendo/2016.Q3/kendo.all.min.js",
                "~/Scripts/kendo/kendo.aspnetmvc.min.js",
                "~/Scripts/angular.min.js",
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
                "~/Content/kendo/2016.Q3/kendo.common-bootstrap.min.css",
                "~/Content/kendo/2016.Q3/kendo.metro.min.css",
                "~/css/it-mlaf.min.css",
                "~/css/kendo.intel.css"
                ));

            //"~/Content/kendo/2016.Q3/kendo.office365.min.css",

            bundles.Add(new StyleBundle("~/MyDeals/css").Include(
                "~/css/_dealUtil.css",
                "~/Content/styles.css"
                ));

        }
    }
}
