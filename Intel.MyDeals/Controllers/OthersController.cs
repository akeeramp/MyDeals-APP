using System.Web.Mvc;
using Intel.MyDeals.App;
using Intel.Opaque;

namespace Intel.MyDeals.Controllers
{
    public class OthersController : Controller
    {
        OpCore op = OpAppConfig.Init();  // Initialize MyDeal's Opaque

        // GET: Others
        public ActionResult Index()
        {
            OpUserToken user = AppLib.InitAVM(op);    // Get user details from authentication
            ViewBag.UserToken = user;                 // Apply User Token to viewbag for client use
            ViewBag.AppToken = op.AppToken;           // Apply Application Token to viewbag for client use

            return View();
        }

        public ActionResult Constants()
        {
            OpUserToken user = AppLib.InitAVM(op);    // Get user details from authentication
            ViewBag.UserToken = user;                 // Apply User Token to viewbag for client use
            ViewBag.AppToken = op.AppToken;           // Apply Application Token to viewbag for client use

            return View();
        }
    }
}