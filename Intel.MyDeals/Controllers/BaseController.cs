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
            OpUserToken user = AppLib.InitAVM(op);

            // Set the user details to view bag, these variables are available to all the views
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            ViewBag.IsDeveloper = user.IsDeveloper();
            ViewBag.IsSuper = user.IsSuper();
            ViewBag.IsSuperSa = user.IsSuperSa();
            ViewBag.IsTester = user.IsTester();
        }
    }
}