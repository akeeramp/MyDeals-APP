using System.Web.Mvc;
using Intel.MyDeals.App;
using Intel.Opaque;

namespace Intel.MyDeals.Controllers
{
    public class OthersController : BaseController
    {
        // GET: Others
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Constants()
        {
            return View();
        }

        public ActionResult TestSaveContract()
        {
            OpUserToken user = AppLib.InitAVM(op);    // Get user details from authentication
            ViewBag.UserToken = user;                 // Apply User Token to viewbag for client use
            ViewBag.AppToken = op.AppToken;           // Apply Application Token to viewbag for client use

            return View();
        }
    }
}