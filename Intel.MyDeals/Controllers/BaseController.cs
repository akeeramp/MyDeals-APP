using System.Linq;
using System.Web.Mvc;
using Intel.MyDeals.App;
using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.Controllers
{
    /// <summary>
    /// To make sure OppAppConfig initialized on each controller
    /// </summary>
    public abstract class BaseController : Controller
    {
        /// <summary>
        /// Op core
        /// </summary>
        public OpCore op;

        public BaseController()
        {
            op = OpAppConfig.Init();
        }

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            OpUserToken user = AppLib.InitAvm(op);

            // Set the user details to view bag, these variables are available to all the views
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            ViewBag.IsDeveloper = user.IsDeveloper();
            ViewBag.IsSuper = user.IsSuper();
            ViewBag.IsAdmin = user.IsAdmin();
            ViewBag.IsFinanceAdmin = user.IsFinanceAdmin();
            ViewBag.IsSuperSa = user.IsSuperSa();
            ViewBag.IsTester = user.IsTester();

            var idsid = user.Usr.Idsid.ToUpper();
            if (AppLib.UserSettings != null && AppLib.UserSettings.ContainsKey(idsid) && AppLib.UserSettings[idsid].AllMyCustomers.CustomerInfo.Any()) return;

            // Redirect to "Request Customer" page
            filterContext.Result = new RedirectResult("/Error/NeedCustomers");
        }
    }
}