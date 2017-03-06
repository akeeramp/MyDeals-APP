using System.Web.Mvc;
using Intel.MyDeals.App;
using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.Areas.Admin.Controllers
{
    public class AdminConstantsController : Controller
    {
        OpCore op = OpAppConfig.Init();

        // GET: Admin/AdminConstants
        public ActionResult Index()
        {

            OpUserToken user = AppLib.InitAVM(op);    // Get user details from authentication
            ViewBag.UserToken = user;                 // Apply User Token to viewbag for client use
            ViewBag.AppToken = op.AppToken;           // Apply Application Token to viewbag for client use

            if (!user.IsDeveloper()) return RedirectToAction("Security", "Error");

            return View();
        }
    }
}